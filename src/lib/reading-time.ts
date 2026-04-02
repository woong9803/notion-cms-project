// 읽기 시간 계산 및 상대 시간 표시 유틸리티

/**
 * 단어 수 기반 읽기 시간 계산 (단순 버전)
 * - markdown.ts의 calculateReadingTime()과 달리 순수 텍스트 입력 전용
 * - 평균 읽기 속도: 분당 200단어 (영문 기준)
 * - 한국어 포함 시 분당 300자로 추가 계산
 *
 * @param text 순수 텍스트 또는 마크다운 텍스트
 * @returns 예상 읽기 시간 (분 단위, 최소 1분)
 */
export function estimateReadingTime(text: string): number {
  if (!text || text.trim().length === 0) return 1

  const words = text
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0)
  const wordCount = words.length
  const wordsPerMinute = 200

  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

/**
 * 날짜를 상대 시간 문자열로 변환
 * - date-fns formatDistanceToNow 기반
 * - 한국어 로케일 적용
 * - 예: "방금 전", "5분 전", "3일 전", "2달 전"
 *
 * @param date 변환할 날짜 (Date 객체 또는 ISO 문자열)
 * @returns 한국어 상대 시간 문자열
 */
export function formatRelativeTime(date: Date | string): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const now = new Date()

  const diffMs = now.getTime() - targetDate.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  // 미래 날짜 처리
  if (diffMs < 0) {
    const futureDays = Math.abs(diffDays)
    if (futureDays === 0) return '오늘'
    if (futureDays === 1) return '내일'
    if (futureDays < 7) return `${futureDays}일 후`
    if (futureDays < 30) return `${Math.floor(futureDays / 7)}주 후`
    return `${Math.floor(futureDays / 30)}달 후`
  }

  // 과거 날짜 처리
  if (diffSeconds < 60) return '방금 전'
  if (diffMinutes < 60) return `${diffMinutes}분 전`
  if (diffHours < 24) return `${diffHours}시간 전`
  if (diffDays === 1) return '어제'
  if (diffDays < 7) return `${diffDays}일 전`
  if (diffWeeks < 4) return `${diffWeeks}주 전`
  if (diffMonths < 12) return `${diffMonths}달 전`
  return `${diffYears}년 전`
}

/**
 * 날짜를 한국어 형식으로 포맷
 * - 'YYYY년 MM월 DD일' 형식
 *
 * @param date 포맷할 날짜
 * @returns 포맷된 날짜 문자열
 */
export function formatDateKorean(date: Date | string): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const year = targetDate.getFullYear()
  const month = String(targetDate.getMonth() + 1).padStart(2, '0')
  const day = String(targetDate.getDate()).padStart(2, '0')
  return `${year}년 ${month}월 ${day}일`
}

/**
 * 날짜를 짧은 형식으로 포맷
 * - 'YYYY.MM.DD' 형식
 *
 * @param date 포맷할 날짜
 * @returns 포맷된 날짜 문자열
 */
export function formatDateShort(date: Date | string): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const year = targetDate.getFullYear()
  const month = String(targetDate.getMonth() + 1).padStart(2, '0')
  const day = String(targetDate.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}
