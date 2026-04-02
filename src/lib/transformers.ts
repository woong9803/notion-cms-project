import {
  LearningItem,
  Status,
  Category,
  FilterOptions,
  SortOptions,
} from '@/types'
import {
  compareDateAsc,
  compareDateDesc,
  compareTitle,
  compareStatusPriority,
  compareCategory,
} from './comparators'

// ============================================================================
// 상태별 필터링
// ============================================================================

/**
 * 지정된 상태에 해당하는 항목만 반환합니다.
 *
 * @param items - 원본 학습 항목 배열
 * @param statuses - 필터링할 상태 배열
 * @returns 상태가 일치하는 항목 배열
 */
export function filterByStatus(
  items: LearningItem[],
  statuses: Status[]
): LearningItem[] {
  if (statuses.length === 0) return items
  const statusSet = new Set(statuses)
  return items.filter(item => statusSet.has(item.status))
}

// ============================================================================
// 카테고리별 필터링
// ============================================================================

/**
 * 지정된 카테고리에 해당하는 항목만 반환합니다.
 *
 * @param items - 원본 학습 항목 배열
 * @param categories - 필터링할 카테고리 배열
 * @returns 카테고리가 일치하는 항목 배열
 */
export function filterByCategory(
  items: LearningItem[],
  categories: Category[]
): LearningItem[] {
  if (categories.length === 0) return items
  const categorySet = new Set(categories)
  return items.filter(item => categorySet.has(item.category))
}

// ============================================================================
// 복합 필터링
// ============================================================================

/**
 * FilterOptions에 따라 복합 필터링을 적용합니다.
 * 모든 조건은 AND 연산으로 처리됩니다.
 *
 * @param items - 원본 학습 항목 배열
 * @param options - 필터링 옵션 (상태, 카테고리, 검색어, 날짜 범위)
 * @returns 모든 조건을 만족하는 항목 배열
 */
export function filterItems(
  items: LearningItem[],
  options: FilterOptions
): LearningItem[] {
  if (items.length === 0) return []

  return items.filter(item => {
    // 상태 필터링
    if (options.status !== undefined) {
      const statuses = Array.isArray(options.status)
        ? options.status
        : [options.status]
      if (statuses.length > 0 && !statuses.includes(item.status)) {
        return false
      }
    }

    // 카테고리 필터링
    if (options.category !== undefined) {
      const categories = Array.isArray(options.category)
        ? options.category
        : [options.category]
      if (categories.length > 0 && !categories.includes(item.category)) {
        return false
      }
    }

    // 검색어 필터링 (제목, 요약, 내용에서 검색)
    if (options.searchText && options.searchText.trim().length > 0) {
      const query = options.searchText.trim().toLowerCase()
      const inTitle = item.title.toLowerCase().includes(query)
      const inSummary = item.summary.toLowerCase().includes(query)
      const inContent = item.content.toLowerCase().includes(query)
      const inTags = item.tags.some(tag => tag.toLowerCase().includes(query))
      if (!inTitle && !inSummary && !inContent && !inTags) {
        return false
      }
    }

    // 시작 날짜 범위 필터링
    if (options.startDate && item.startDate) {
      if (item.startDate < options.startDate) return false
    }

    // 종료 날짜 범위 필터링
    if (options.endDate && item.startDate) {
      if (item.startDate > options.endDate) return false
    }

    return true
  })
}

// ============================================================================
// 정렬
// ============================================================================

/**
 * SortOptions에 따라 학습 항목을 정렬합니다.
 * 원본 배열을 변경하지 않고 새 배열을 반환합니다.
 *
 * @param items - 원본 학습 항목 배열
 * @param options - 정렬 옵션 (기준 필드, 방향)
 * @returns 정렬된 새 배열
 */
export function sortItems(
  items: LearningItem[],
  options: SortOptions
): LearningItem[] {
  if (items.length <= 1) return [...items]

  const sorted = [...items]
  const isDesc = options.order === 'desc'

  sorted.sort((a, b) => {
    let result = 0

    switch (options.by) {
      case 'title':
        result = compareTitle(a.title, b.title)
        break
      case 'date':
        // 날짜 기준 정렬: 기본은 오름차순(오래된 순)
        result = compareDateAsc(a.startDate, b.startDate)
        break
      case 'status':
        result = compareStatusPriority(a.status, b.status)
        break
      case 'category':
        result = compareCategory(a.category, b.category)
        break
    }

    return isDesc ? -result : result
  })

  return sorted
}

// ============================================================================
// 검색
// ============================================================================

/**
 * 지정된 필드에서 검색어가 포함된 항목을 반환합니다.
 * 대소문자를 구분하지 않습니다.
 *
 * @param items - 검색 대상 학습 항목 배열
 * @param query - 검색어
 * @param fields - 검색할 필드 (기본값: title, summary, content)
 * @returns 검색어가 포함된 항목 배열
 */
export function searchItems(
  items: LearningItem[],
  query: string,
  fields: (keyof LearningItem)[] = ['title', 'summary', 'content']
): LearningItem[] {
  const trimmed = query.trim()
  if (trimmed.length === 0) return items

  const lowerQuery = trimmed.toLowerCase()

  return items.filter(item => {
    return fields.some(field => {
      const value = item[field]
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerQuery)
      }
      // 배열 필드(tags 등) 지원
      if (Array.isArray(value)) {
        return value.some(
          v => typeof v === 'string' && v.toLowerCase().includes(lowerQuery)
        )
      }
      return false
    })
  })
}

// ============================================================================
// 페이지네이션
// ============================================================================

/**
 * 배열을 페이지 단위로 분할합니다.
 *
 * @param items - 페이지네이션을 적용할 배열
 * @param page - 현재 페이지 번호 (1부터 시작)
 * @param pageSize - 한 페이지당 항목 수
 * @returns 현재 페이지 항목, 전체 수, 다음 페이지 여부
 */
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): { items: T[]; total: number; hasMore: boolean } {
  // 유효하지 않은 입력 보정
  const safePage = Math.max(1, Math.floor(page))
  const safePageSize = Math.max(1, Math.floor(pageSize))
  const total = items.length

  const startIndex = (safePage - 1) * safePageSize
  const endIndex = startIndex + safePageSize
  const sliced = items.slice(startIndex, endIndex)

  return {
    items: sliced,
    total,
    hasMore: endIndex < total,
  }
}

// ============================================================================
// 그룹화
// ============================================================================

/**
 * 학습 항목을 카테고리별로 그룹화합니다.
 *
 * @param items - 그룹화할 학습 항목 배열
 * @returns 카테고리 → 항목 배열 Map
 */
export function groupByCategory(
  items: LearningItem[]
): Map<Category, LearningItem[]> {
  const map = new Map<Category, LearningItem[]>()

  for (const item of items) {
    const existing = map.get(item.category)
    if (existing) {
      existing.push(item)
    } else {
      map.set(item.category, [item])
    }
  }

  return map
}

/**
 * 학습 항목을 상태별로 그룹화합니다.
 *
 * @param items - 그룹화할 학습 항목 배열
 * @returns 상태 → 항목 배열 Map
 */
export function groupByStatus(
  items: LearningItem[]
): Map<Status, LearningItem[]> {
  const map = new Map<Status, LearningItem[]>()

  for (const item of items) {
    const existing = map.get(item.status)
    if (existing) {
      existing.push(item)
    } else {
      map.set(item.status, [item])
    }
  }

  return map
}

// ============================================================================
// 최신순 정렬 편의 함수
// ============================================================================

/**
 * 학습 항목을 최신 시작 날짜 기준으로 정렬합니다.
 * 날짜가 없는 항목은 뒤로 정렬됩니다.
 *
 * @param items - 원본 학습 항목 배열
 * @returns 최신순 정렬된 새 배열
 */
export function sortByDateDesc(items: LearningItem[]): LearningItem[] {
  return [...items].sort((a, b) => compareDateDesc(a.startDate, b.startDate))
}

/**
 * 학습 항목을 오래된 시작 날짜 기준으로 정렬합니다.
 * 날짜가 없는 항목은 뒤로 정렬됩니다.
 *
 * @param items - 원본 학습 항목 배열
 * @returns 오래된순 정렬된 새 배열
 */
export function sortByDateAsc(items: LearningItem[]): LearningItem[] {
  return [...items].sort((a, b) => compareDateAsc(a.startDate, b.startDate))
}
