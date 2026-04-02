import {
  Status,
  Category,
  LearningItem,
  ProgressInfo,
  CategoryProgress,
} from '@/types'
import { STATUS_LABELS, CATEGORY_LABELS } from './constants'

// ============================================================================
// 상태 포매팅
// ============================================================================

/**
 * Status 값을 한국어 레이블로 변환합니다.
 *
 * @param status - 변환할 상태 값
 * @returns 한국어 레이블 문자열
 */
export function formatStatus(status: Status): string {
  return STATUS_LABELS[status]
}

// ============================================================================
// 카테고리 포매팅
// ============================================================================

/**
 * Category 값을 표시용 레이블로 변환합니다.
 *
 * @param category - 변환할 카테고리 값
 * @returns 카테고리 레이블 문자열
 */
export function formatCategory(category: Category): string {
  return CATEGORY_LABELS[category]
}

// ============================================================================
// 날짜 포매팅
// ============================================================================

/**
 * Date 객체를 한국어 형식으로 포매팅합니다.
 * undefined이면 빈 문자열을 반환합니다.
 *
 * @param date - 포매팅할 날짜 (undefined 허용)
 * @param format - 'short': YYYY.MM.DD, 'long': YYYY년 MM월 DD일
 * @returns 포매팅된 날짜 문자열
 */
export function formatDate(
  date: Date | undefined,
  format: 'short' | 'long' = 'short'
): string {
  if (!date) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  if (format === 'long') {
    return `${year}년 ${month}월 ${day}일`
  }

  return `${year}.${month}.${day}`
}

/**
 * 시작일과 종료일로 날짜 범위 문자열을 생성합니다.
 * 시작일만 있으면 "시작일 ~", 둘 다 없으면 빈 문자열을 반환합니다.
 *
 * @param startDate - 시작 날짜
 * @param endDate - 종료 날짜
 * @returns 날짜 범위 문자열
 */
export function formatDateRange(startDate?: Date, endDate?: Date): string {
  const formattedStart = formatDate(startDate)
  const formattedEnd = formatDate(endDate)

  if (!formattedStart && !formattedEnd) return ''
  if (formattedStart && !formattedEnd) return `${formattedStart} ~`
  if (!formattedStart && formattedEnd) return `~ ${formattedEnd}`
  return `${formattedStart} ~ ${formattedEnd}`
}

// ============================================================================
// 진행률 포매팅
// ============================================================================

/**
 * ProgressInfo를 사람이 읽기 좋은 텍스트로 변환합니다.
 * 예: "전체 10개 | 완료 5개 (50%) | 진행 중 3개 | 시작 전 2개"
 *
 * @param progress - 변환할 진행률 정보
 * @returns 진행률 요약 텍스트
 */
export function formatProgress(progress: ProgressInfo): string {
  const { total, completed, inProgress, todo, percentage } = progress
  return `전체 ${total}개 | 완료 ${completed}개 (${percentage}%) | 진행 중 ${inProgress}개 | 시작 전 ${todo}개`
}

/**
 * 진행률 백분율을 표시용 문자열로 변환합니다.
 * 예: "75%"
 *
 * @param percentage - 0~100 사이의 숫자
 * @returns 백분율 문자열
 */
export function formatPercentage(percentage: number): string {
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)))
  return `${clamped}%`
}

// ============================================================================
// 학습 항목 요약 생성
// ============================================================================

/**
 * LearningItem의 핵심 정보를 한 줄 요약 텍스트로 생성합니다.
 * 예: "[React Native] 컴포넌트 기초 - 진행 중 (2024.01.01 ~)"
 *
 * @param item - 요약할 학습 항목
 * @returns 한 줄 요약 텍스트
 */
export function generateItemSummary(item: LearningItem): string {
  const category = formatCategory(item.category)
  const status = formatStatus(item.status)
  const dateRange = formatDateRange(item.startDate, item.endDate)

  const parts = [`[${category}] ${item.title} - ${status}`]
  if (dateRange) {
    parts.push(`(${dateRange})`)
  }

  return parts.join(' ')
}

// ============================================================================
// 카테고리별 통계 문자열 생성
// ============================================================================

/**
 * CategoryProgress를 표시용 통계 문자열로 변환합니다.
 * 예: "React Native: 8/10 (80%)"
 *
 * @param progress - 변환할 카테고리 진행률 정보
 * @returns 카테고리 통계 문자열
 */
export function generateCategoryStats(progress: CategoryProgress): string {
  const label = formatCategory(progress.category)
  return `${label}: ${progress.completed}/${progress.total} (${progress.percentage}%)`
}

// ============================================================================
// 숫자 포매팅
// ============================================================================

/**
 * 일수를 사람이 읽기 좋은 형태로 변환합니다.
 * 예: 1 → "1일", 30 → "30일", 365 → "1년"
 *
 * @param days - 변환할 일수
 * @returns 포매팅된 기간 문자열
 */
export function formatDuration(days: number): string {
  if (days < 0) return '0일'
  if (days < 30) return `${days}일`
  if (days < 365) {
    const months = Math.floor(days / 30)
    const remainDays = days % 30
    if (remainDays === 0) return `${months}개월`
    return `${months}개월 ${remainDays}일`
  }
  const years = Math.floor(days / 365)
  const remainMonths = Math.floor((days % 365) / 30)
  if (remainMonths === 0) return `${years}년`
  return `${years}년 ${remainMonths}개월`
}

/**
 * 숫자를 한국 단위로 포매팅합니다.
 * 예: 1000 → "1,000", 10000 → "1만"
 *
 * @param value - 포매팅할 숫자
 * @returns 포매팅된 숫자 문자열
 */
export function formatNumber(value: number): string {
  if (value >= 10000) {
    const man = Math.floor(value / 10000)
    const remainder = value % 10000
    if (remainder === 0) return `${man}만`
    return `${man}만 ${remainder.toLocaleString('ko-KR')}`
  }
  return value.toLocaleString('ko-KR')
}
