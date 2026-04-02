import type {
  LearningItem,
  Status,
  Category,
  FilterOptions,
  SortOptions,
} from '@/types'
import { NotFoundError } from '@/lib/errors'
import { handleNotionError } from '@/lib/errors'
import {
  NOTION_CACHE_TTL,
  MIN_SEARCH_LENGTH,
  APP_TO_NOTION_STATUS,
  NOTION_TO_APP_CATEGORY,
} from '@/lib/constants'
import { queryDatabaseAll, getPage } from '@/services/notion-service'
import {
  mapNotionPagesToLearningItems,
  mapNotionPageToLearningItem,
} from '@/services/mappers/learning-mapper'
import { ValidationError } from '@/lib/errors'

// ============================================================================
// 환경 변수 읽기 (런타임)
// ============================================================================

/**
 * Notion 데이터베이스 ID를 런타임에 가져옵니다.
 * 환경 변수가 없으면 에러를 throw합니다.
 */
function getDatabaseId(): string {
  const id = process.env.NOTION_DATABASE_ID
  if (!id) {
    throw new ValidationError(
      'NOTION_DATABASE_ID 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요.'
    )
  }
  return id
}

// ============================================================================
// 인메모리 캐시
// ============================================================================

interface CacheEntry {
  data: LearningItem[]
  timestamp: number
}

/** 캐시 저장소 (키 → 데이터 + 타임스탬프) */
const cache = new Map<string, CacheEntry>()

/**
 * 캐시 항목이 유효한지 확인합니다.
 * NOTION_CACHE_TTL(300초)을 초과하면 만료됩니다.
 */
function isCacheValid(entry: CacheEntry): boolean {
  const elapsedMs = Date.now() - entry.timestamp
  return elapsedMs < NOTION_CACHE_TTL * 1000
}

/**
 * 캐시에서 데이터를 가져옵니다. 유효하지 않으면 null을 반환합니다.
 */
function getFromCache(key: string): LearningItem[] | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (!isCacheValid(entry)) {
    cache.delete(key)
    return null
  }
  return entry.data
}

/**
 * 캐시에 데이터를 저장합니다.
 */
function setCache(key: string, data: LearningItem[]): void {
  cache.set(key, { data, timestamp: Date.now() })
}

// ============================================================================
// 필터링 & 정렬 헬퍼
// ============================================================================

/**
 * LearningItem 배열에 FilterOptions를 적용합니다.
 */
function applyFilter(
  items: LearningItem[],
  filter: FilterOptions
): LearningItem[] {
  return items.filter(item => {
    // 상태 필터
    if (filter.status) {
      const statuses = Array.isArray(filter.status)
        ? filter.status
        : [filter.status]
      if (!statuses.includes(item.status)) return false
    }

    // 카테고리 필터
    if (filter.category) {
      const categories = Array.isArray(filter.category)
        ? filter.category
        : [filter.category]
      if (!categories.includes(item.category)) return false
    }

    // 검색어 필터 (제목, 요약, 태그)
    if (filter.searchText) {
      const query = filter.searchText.toLowerCase()
      const inTitle = item.title.toLowerCase().includes(query)
      const inSummary = item.summary.toLowerCase().includes(query)
      const inTags = item.tags.some(tag => tag.toLowerCase().includes(query))
      if (!inTitle && !inSummary && !inTags) return false
    }

    // 날짜 범위 필터 (시작 날짜 기준)
    if (filter.startDate && item.startDate) {
      if (item.startDate < filter.startDate) return false
    }
    if (filter.endDate && item.startDate) {
      if (item.startDate > filter.endDate) return false
    }

    return true
  })
}

/**
 * LearningItem 배열에 SortOptions를 적용합니다.
 */
function applySort(items: LearningItem[], sort: SortOptions): LearningItem[] {
  return [...items].sort((a, b) => {
    let comparison = 0

    switch (sort.by) {
      case 'title':
        comparison = a.title.localeCompare(b.title, 'ko')
        break
      case 'status': {
        // 상태 우선순위: todo → in_progress → done
        const statusOrder: Record<Status, number> = {
          todo: 0,
          in_progress: 1,
          done: 2,
        }
        comparison = statusOrder[a.status] - statusOrder[b.status]
        break
      }
      case 'category':
        comparison = a.category.localeCompare(b.category)
        break
      case 'date': {
        // 날짜가 없는 항목은 뒤로 정렬
        const aTime = a.startDate?.getTime() ?? 0
        const bTime = b.startDate?.getTime() ?? 0
        comparison = aTime - bTime
        break
      }
    }

    return sort.order === 'desc' ? -comparison : comparison
  })
}

// ============================================================================
// 공개 서비스 함수
// ============================================================================

/**
 * 모든 학습 항목을 조회합니다.
 * 기본적으로 캐시를 활용하며, useCache=false 시 강제 갱신합니다.
 */
export async function getAllLearningItems(
  useCache = true
): Promise<LearningItem[]> {
  const cacheKey = 'all'

  if (useCache) {
    const cached = getFromCache(cacheKey)
    if (cached) return cached
  }

  try {
    const databaseId = getDatabaseId()
    const pages = await queryDatabaseAll(databaseId, {
      // 최근 수정 순으로 기본 정렬
      sorts: [{ timestamp: 'last_edited_time', direction: 'descending' }],
    })

    const items = mapNotionPagesToLearningItems(pages)
    setCache(cacheKey, items)
    return items
  } catch (error) {
    throw handleNotionError(error)
  }
}

/**
 * 상태별 학습 항목을 조회합니다.
 */
export async function getLearningItemsByStatus(
  status: Status | Status[]
): Promise<LearningItem[]> {
  const statuses = Array.isArray(status) ? status : [status]
  const cacheKey = `status:${statuses.sort().join(',')}`

  const cached = getFromCache(cacheKey)
  if (cached) return cached

  try {
    const databaseId = getDatabaseId()

    // 단일 상태이면 Notion API 레벨에서 필터링 (성능 최적화)
    if (statuses.length === 1) {
      const notionStatus = APP_TO_NOTION_STATUS[statuses[0]]
      const pages = await queryDatabaseAll(databaseId, {
        filter: {
          property: '상태',
          status: { equals: notionStatus },
        },
        sorts: [{ timestamp: 'last_edited_time', direction: 'descending' }],
      })
      const items = mapNotionPagesToLearningItems(pages)
      setCache(cacheKey, items)
      return items
    }

    // 복수 상태는 전체 조회 후 클라이언트 필터링
    const all = await getAllLearningItems()
    const filtered = all.filter(item => statuses.includes(item.status))
    setCache(cacheKey, filtered)
    return filtered
  } catch (error) {
    throw handleNotionError(error)
  }
}

/**
 * 카테고리별 학습 항목을 조회합니다.
 */
export async function getLearningItemsByCategory(
  category: Category | Category[]
): Promise<LearningItem[]> {
  const categories = Array.isArray(category) ? category : [category]
  const cacheKey = `category:${categories.sort().join(',')}`

  const cached = getFromCache(cacheKey)
  if (cached) return cached

  try {
    const databaseId = getDatabaseId()

    // 단일 카테고리이면 Notion API 레벨에서 필터링 (성능 최적화)
    if (categories.length === 1) {
      // 앱 카테고리 → Notion 표시 이름 역매핑
      const notionCategoryName = Object.entries(NOTION_TO_APP_CATEGORY).find(
        ([, appCat]) => appCat === categories[0]
      )?.[0]

      if (notionCategoryName) {
        const pages = await queryDatabaseAll(databaseId, {
          filter: {
            property: '카테고리',
            select: { equals: notionCategoryName },
          },
          sorts: [{ timestamp: 'last_edited_time', direction: 'descending' }],
        })
        const items = mapNotionPagesToLearningItems(pages)
        setCache(cacheKey, items)
        return items
      }
    }

    // 복수 카테고리 또는 'other'는 전체 조회 후 클라이언트 필터링
    const all = await getAllLearningItems()
    const filtered = all.filter(item => categories.includes(item.category))
    setCache(cacheKey, filtered)
    return filtered
  } catch (error) {
    throw handleNotionError(error)
  }
}

/**
 * ID로 단일 학습 항목을 조회합니다.
 */
export async function getLearningItemById(id: string): Promise<LearningItem> {
  // 전체 캐시에서 먼저 탐색
  const cached = getFromCache('all')
  if (cached) {
    const found = cached.find(item => item.id === id)
    if (found) return found
  }

  try {
    const page = await getPage(id)
    return mapNotionPageToLearningItem(page)
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error
    }
    throw handleNotionError(error)
  }
}

/**
 * 검색어로 학습 항목을 검색합니다.
 * 제목, 요약, 태그에서 대소문자 무관하게 검색합니다.
 */
export async function searchLearningItems(
  query: string
): Promise<LearningItem[]> {
  const trimmed = query.trim()

  if (trimmed.length < MIN_SEARCH_LENGTH) {
    throw new ValidationError(
      `검색어는 최소 ${MIN_SEARCH_LENGTH}자 이상이어야 합니다. (현재: ${trimmed.length}자)`
    )
  }

  const all = await getAllLearningItems()
  return applyFilter(all, { searchText: trimmed })
}

/**
 * 필터와 정렬 옵션을 조합하여 학습 항목을 조회합니다.
 */
export async function getFilteredAndSortedItems(
  filter?: FilterOptions,
  sort?: SortOptions
): Promise<LearningItem[]> {
  let items = await getAllLearningItems()

  if (filter) {
    items = applyFilter(items, filter)
  }

  if (sort) {
    items = applySort(items, sort)
  }

  return items
}

// ============================================================================
// 상세 페이지 전용 서비스 함수
// ============================================================================

/**
 * 같은 카테고리 내에서 현재 항목의 이전/다음 항목을 조회합니다.
 * 날짜 순서(오래된 순)로 정렬한 후 인접 항목을 반환합니다.
 */
export async function getAdjacentItems(
  currentId: string,
  category: Category
): Promise<{
  previous: LearningItem | null
  next: LearningItem | null
}> {
  try {
    // 같은 카테고리 항목을 날짜 오름차순으로 정렬
    const items = await getLearningItemsByCategory(category)
    const sorted = [...items].sort((a, b) => {
      const aTime = a.startDate?.getTime() ?? a.createdAt.getTime()
      const bTime = b.startDate?.getTime() ?? b.createdAt.getTime()
      return aTime - bTime
    })

    const currentIndex = sorted.findIndex(item => item.id === currentId)

    if (currentIndex === -1) {
      return { previous: null, next: null }
    }

    return {
      previous: currentIndex > 0 ? sorted[currentIndex - 1] : null,
      next: currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null,
    }
  } catch (error) {
    throw handleNotionError(error)
  }
}

/**
 * 같은 카테고리의 관련 항목을 최대 count개 반환합니다.
 * 현재 항목은 제외하고 최신 수정일 순으로 정렬합니다.
 */
export async function getRelatedItems(
  currentId: string,
  category: Category,
  count = 3
): Promise<LearningItem[]> {
  try {
    const items = await getLearningItemsByCategory(category)
    return items
      .filter(item => item.id !== currentId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, count)
  } catch (error) {
    throw handleNotionError(error)
  }
}

// ============================================================================
// 캐시 관리
// ============================================================================

/**
 * 모든 캐시를 무효화합니다.
 * 데이터 갱신이 필요할 때 호출합니다.
 */
export function invalidateCache(): void {
  cache.clear()
}

/**
 * 특정 캐시 키를 무효화합니다.
 */
export function invalidateCacheKey(key: string): void {
  cache.delete(key)
}

/**
 * 현재 캐시 상태를 반환합니다. (디버깅용)
 */
export function getCacheStatus(): {
  key: string
  age: number
  valid: boolean
}[] {
  return Array.from(cache.entries()).map(([key, entry]) => ({
    key,
    age: Math.floor((Date.now() - entry.timestamp) / 1000),
    valid: isCacheValid(entry),
  }))
}
