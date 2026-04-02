import { Status, Category } from '@/types'
import { CATEGORIES, ALL_STATUSES } from './constants'

// ============================================================================
// 날짜 비교 함수
// ============================================================================

/**
 * 두 날짜를 최신순(내림차순)으로 비교합니다.
 * undefined인 날짜는 가장 뒤로 정렬됩니다.
 *
 * @param a - 첫 번째 날짜
 * @param b - 두 번째 날짜
 * @returns 양수: a가 뒤, 음수: a가 앞, 0: 같음
 */
export function compareDateDesc(
  a: Date | undefined,
  b: Date | undefined
): number {
  // 둘 다 없으면 동등
  if (!a && !b) return 0
  // a만 없으면 a를 뒤로
  if (!a) return 1
  // b만 없으면 b를 뒤로
  if (!b) return -1
  // 최신순 = 큰 타임스탬프가 앞
  return b.getTime() - a.getTime()
}

/**
 * 두 날짜를 오래된순(오름차순)으로 비교합니다.
 * undefined인 날짜는 가장 뒤로 정렬됩니다.
 *
 * @param a - 첫 번째 날짜
 * @param b - 두 번째 날짜
 * @returns 양수: a가 뒤, 음수: a가 앞, 0: 같음
 */
export function compareDateAsc(
  a: Date | undefined,
  b: Date | undefined
): number {
  // 둘 다 없으면 동등
  if (!a && !b) return 0
  // a만 없으면 a를 뒤로
  if (!a) return 1
  // b만 없으면 b를 뒤로
  if (!b) return -1
  // 오래된순 = 작은 타임스탬프가 앞
  return a.getTime() - b.getTime()
}

// ============================================================================
// 제목 비교 함수
// ============================================================================

/**
 * 두 제목을 한국어 로케일 기준 알파벳순으로 비교합니다.
 *
 * @param a - 첫 번째 제목
 * @param b - 두 번째 제목
 * @returns Array.sort 호환 비교 결과
 */
export function compareTitle(a: string, b: string): number {
  return a.localeCompare(b, 'ko', { sensitivity: 'base' })
}

// ============================================================================
// 상태 비교 함수
// ============================================================================

/**
 * 상태 우선순위 매핑 (진행 중 > 시작 전 > 완료)
 * 작업 목록에서 현재 해야 할 것이 위로 오도록 설계되었습니다.
 */
const STATUS_PRIORITY: Record<Status, number> = {
  in_progress: 0, // 진행 중: 최상위
  todo: 1, // 시작 전: 중간
  done: 2, // 완료: 최하위
} as const

/**
 * 두 상태를 우선순위 기준으로 비교합니다.
 * 진행 중 > 시작 전 > 완료 순서로 정렬됩니다.
 *
 * @param a - 첫 번째 상태
 * @param b - 두 번째 상태
 * @returns Array.sort 호환 비교 결과
 */
export function compareStatusPriority(a: Status, b: Status): number {
  return STATUS_PRIORITY[a] - STATUS_PRIORITY[b]
}

/**
 * 상태의 우선순위 값을 반환합니다.
 *
 * @param status - 조회할 상태
 * @returns 우선순위 숫자 (낮을수록 높은 우선순위)
 */
export function getStatusPriority(status: Status): number {
  return STATUS_PRIORITY[status]
}

// ============================================================================
// 카테고리 비교 함수
// ============================================================================

/**
 * 카테고리 인덱스 기반 순서 매핑
 * CATEGORIES 배열에 정의된 순서를 따릅니다.
 */
const CATEGORY_ORDER: Record<Category, number> = Object.fromEntries(
  CATEGORIES.map((cat, idx) => [cat, idx])
) as Record<Category, number>

/**
 * 두 카테고리를 정의된 순서 기준으로 비교합니다.
 * constants.ts의 CATEGORIES 배열 순서를 따릅니다.
 *
 * @param a - 첫 번째 카테고리
 * @param b - 두 번째 카테고리
 * @returns Array.sort 호환 비교 결과
 */
export function compareCategory(a: Category, b: Category): number {
  return CATEGORY_ORDER[a] - CATEGORY_ORDER[b]
}

// ============================================================================
// 범용 비교 유틸리티
// ============================================================================

/**
 * 정렬 방향을 반전시킵니다.
 * desc 정렬이 필요한 경우 comparator 결과에 이 함수를 적용합니다.
 *
 * @param compareResult - 원본 비교 결과
 * @returns 반전된 비교 결과
 */
export function reverseOrder(compareResult: number): number {
  return -compareResult
}

/**
 * 여러 비교 함수를 체인으로 연결합니다.
 * 앞의 비교 함수가 0을 반환하면 다음 비교 함수를 사용합니다.
 *
 * @param comparators - 순서대로 적용할 비교 함수 배열
 * @returns 체인된 비교 함수
 */
export function chainComparators<T>(
  ...comparators: ((a: T, b: T) => number)[]
): (a: T, b: T) => number {
  return (a: T, b: T): number => {
    for (const comparator of comparators) {
      const result = comparator(a, b)
      if (result !== 0) return result
    }
    return 0
  }
}

/**
 * 유효한 상태 값인지 확인합니다.
 *
 * @param value - 확인할 값
 * @returns 유효한 Status 타입이면 true
 */
export function isValidStatusValue(value: string): value is Status {
  return (ALL_STATUSES as readonly string[]).includes(value)
}
