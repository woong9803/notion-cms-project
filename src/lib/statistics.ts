import { LearningItem, Category } from '@/types'
import { CATEGORIES } from './constants'
import { compareDateDesc } from './comparators'

// ============================================================================
// 학습 기간 계산
// ============================================================================

/**
 * 단일 항목의 학습 기간(일수)을 계산합니다.
 * startDate와 endDate가 모두 있어야 계산이 가능합니다.
 *
 * @param item - 계산할 학습 항목
 * @returns 학습 기간(일수), 날짜 정보가 없으면 null
 */
function getLearningDurationDays(item: LearningItem): number | null {
  if (!item.startDate || !item.endDate) return null
  const diff = item.endDate.getTime() - item.startDate.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

/**
 * 완료된 항목들의 평균 학습 기간(일수)을 계산합니다.
 * 시작일과 종료일이 모두 있는 완료 항목만 대상으로 합니다.
 *
 * @param items - 집계할 학습 항목 배열
 * @returns 평균 학습 기간(일수), 대상 항목이 없으면 0
 */
export function calculateAverageLearningDuration(
  items: LearningItem[]
): number {
  const completedWithDates = items.filter(
    item => item.status === 'done' && item.startDate && item.endDate
  )

  if (completedWithDates.length === 0) return 0

  const totalDays = completedWithDates.reduce<number>((sum, item) => {
    const days = getLearningDurationDays(item)
    return sum + (days ?? 0)
  }, 0)

  return Math.round(totalDays / completedWithDates.length)
}

/**
 * 모든 완료 항목의 총 학습 일수를 계산합니다.
 * 시작일과 종료일이 모두 있는 완료 항목만 집계합니다.
 *
 * @param items - 집계할 학습 항목 배열
 * @returns 총 학습 일수
 */
export function calculateTotalLearningDays(items: LearningItem[]): number {
  return items.reduce<number>((total, item) => {
    if (item.status !== 'done') return total
    const days = getLearningDurationDays(item)
    return total + (days ?? 0)
  }, 0)
}

// ============================================================================
// 월별 통계
// ============================================================================

/**
 * 월별로 시작된 학습 항목 수를 집계합니다.
 * 키 형식: "YYYY-MM" (예: "2024-01")
 *
 * @param items - 집계할 학습 항목 배열
 * @returns "YYYY-MM" → 항목 수 Map (최신 월부터 정렬)
 */
export function getMonthlyStats(items: LearningItem[]): Map<string, number> {
  const map = new Map<string, number>()

  for (const item of items) {
    if (!item.startDate) continue

    const year = item.startDate.getFullYear()
    const month = String(item.startDate.getMonth() + 1).padStart(2, '0')
    const key = `${year}-${month}`

    map.set(key, (map.get(key) ?? 0) + 1)
  }

  // 키를 날짜 내림차순으로 정렬하여 새 Map 반환
  const sorted = new Map(
    Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a))
  )

  return sorted
}

// ============================================================================
// 카테고리별 통계
// ============================================================================

/**
 * 카테고리별 전체/완료/진행 중 항목 수를 집계합니다.
 *
 * @param items - 집계할 학습 항목 배열
 * @returns 카테고리 → { total, completed, inProgress } Record
 */
export function getCategoryStats(
  items: LearningItem[]
): Record<Category, { total: number; completed: number; inProgress: number }> {
  // 초기값: 모든 카테고리에 대해 0으로 초기화
  const stats = Object.fromEntries(
    CATEGORIES.map(cat => [cat, { total: 0, completed: 0, inProgress: 0 }])
  ) as Record<
    Category,
    { total: number; completed: number; inProgress: number }
  >

  for (const item of items) {
    const entry = stats[item.category]
    entry.total += 1
    if (item.status === 'done') {
      entry.completed += 1
    } else if (item.status === 'in_progress') {
      entry.inProgress += 1
    }
  }

  return stats
}

/**
 * 가장 많이 학습한 카테고리를 반환합니다.
 * 완료된 항목 수 기준으로 판단합니다.
 * 항목이 없거나 모든 카테고리의 완료 수가 0이면 null을 반환합니다.
 *
 * @param items - 집계할 학습 항목 배열
 * @returns 가장 많이 학습된 카테고리, 없으면 null
 */
export function getMostStudiedCategory(items: LearningItem[]): Category | null {
  if (items.length === 0) return null

  const stats = getCategoryStats(items)
  let maxCategory: Category | null = null
  let maxCompleted = 0

  for (const category of CATEGORIES) {
    const completed = stats[category].completed
    if (completed > maxCompleted) {
      maxCompleted = completed
      maxCategory = category
    }
  }

  return maxCategory
}

// ============================================================================
// 최근/예정 항목 조회
// ============================================================================

/**
 * 시작 날짜 기준 최근 N개 항목을 반환합니다.
 * 날짜가 없는 항목은 updatedAt 기준으로 대체됩니다.
 *
 * @param items - 전체 학습 항목 배열
 * @param limit - 반환할 최대 항목 수 (기본값: 10)
 * @returns 최근 N개 항목 배열
 */
export function getRecentItems(
  items: LearningItem[],
  limit: number = 10
): LearningItem[] {
  if (items.length === 0) return []

  const safeLimit = Math.max(1, limit)

  return [...items]
    .sort((a, b) => {
      // startDate 우선, 없으면 updatedAt 사용
      const dateA = a.startDate ?? a.updatedAt
      const dateB = b.startDate ?? b.updatedAt
      return compareDateDesc(dateA, dateB)
    })
    .slice(0, safeLimit)
}

/**
 * todo 상태이며 시작 날짜가 있는 예정된 항목을 반환합니다.
 * 가장 빨리 시작 예정인 항목부터 반환합니다.
 *
 * @param items - 전체 학습 항목 배열
 * @param limit - 반환할 최대 항목 수 (기본값: 5)
 * @returns 예정된 항목 배열
 */
export function getUpcomingItems(
  items: LearningItem[],
  limit: number = 5
): LearningItem[] {
  if (items.length === 0) return []

  const safeLimit = Math.max(1, limit)
  const now = new Date()

  return items
    .filter(
      item => item.status === 'todo' && item.startDate && item.startDate >= now
    )
    .sort((a, b) => {
      // 오름차순: 가장 빠른 시작일이 앞에
      const aTime = a.startDate?.getTime() ?? Infinity
      const bTime = b.startDate?.getTime() ?? Infinity
      return aTime - bTime
    })
    .slice(0, safeLimit)
}

// ============================================================================
// 태그 통계
// ============================================================================

/**
 * 전체 항목에서 태그 사용 빈도를 집계합니다.
 * 빈도 내림차순으로 정렬됩니다.
 *
 * @param items - 집계할 학습 항목 배열
 * @returns 태그 → 사용 횟수 Map (빈도 내림차순)
 */
export function getTagFrequency(items: LearningItem[]): Map<string, number> {
  const map = new Map<string, number>()

  for (const item of items) {
    for (const tag of item.tags) {
      if (tag.trim().length > 0) {
        map.set(tag, (map.get(tag) ?? 0) + 1)
      }
    }
  }

  // 빈도 내림차순 정렬
  return new Map(Array.from(map.entries()).sort(([, a], [, b]) => b - a))
}

/**
 * 가장 자주 사용된 태그 N개를 반환합니다.
 *
 * @param items - 집계할 학습 항목 배열
 * @param limit - 반환할 최대 태그 수 (기본값: 10)
 * @returns [태그, 빈도] 쌍 배열
 */
export function getTopTags(
  items: LearningItem[],
  limit: number = 10
): [string, number][] {
  const frequency = getTagFrequency(items)
  return Array.from(frequency.entries()).slice(0, Math.max(1, limit))
}
