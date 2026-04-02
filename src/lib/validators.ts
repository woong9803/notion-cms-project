import { Status, Category, LearningItem, LearningItemDTO } from '@/types'
import {
  ALL_STATUSES,
  CATEGORIES,
  NOTION_TO_APP_STATUS,
  NOTION_TO_APP_CATEGORY,
} from './constants'
import { ValidationError } from './errors'

/**
 * 상태가 유효한지 확인
 */
export function isValidStatus(value: unknown): value is Status {
  return ALL_STATUSES.includes(value as Status)
}

/**
 * 카테고리가 유효한지 확인
 */
export function isValidCategory(value: unknown): value is Category {
  return CATEGORIES.includes(value as Category)
}

/**
 * 문자열이 유효한 상태인지 확인 (Notion 상태명)
 */
export function isValidNotionStatus(value: string): boolean {
  return value in NOTION_TO_APP_STATUS
}

/**
 * 문자열이 유효한 카테고리인지 확인 (Notion 카테고리명)
 */
export function isValidNotionCategory(value: string): boolean {
  return value in NOTION_TO_APP_CATEGORY
}

// ============================================================================
// 타입 검증 함수
// ============================================================================

/**
 * LearningItem이 유효한지 확인
 */
export function isValidLearningItem(item: unknown): item is LearningItem {
  if (!item || typeof item !== 'object') {
    return false
  }

  const obj = item as Record<string, unknown>

  return (
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    isValidCategory(obj.category) &&
    isValidStatus(obj.status) &&
    typeof obj.summary === 'string' &&
    typeof obj.content === 'string' &&
    Array.isArray(obj.tags) &&
    obj.tags.every(tag => typeof tag === 'string') &&
    obj.createdAt instanceof Date &&
    obj.updatedAt instanceof Date
  )
}

/**
 * Notion API 응답이 유효한지 확인
 */
export function isValidLearningItemDTO(item: unknown): item is LearningItemDTO {
  if (!item || typeof item !== 'object') {
    return false
  }

  const obj = item as Record<string, unknown>

  // 기본 필드 확인
  if (
    typeof obj.id !== 'string' ||
    !obj.properties ||
    typeof obj.properties !== 'object'
  ) {
    return false
  }

  const props = obj.properties as Record<string, unknown>

  // 필수 필드 확인
  return (
    props['제목'] !== undefined &&
    props['카테고리'] !== undefined &&
    props['상태'] !== undefined &&
    props['날짜'] !== undefined &&
    props['요약'] !== undefined &&
    props['내용'] !== undefined &&
    props['태그'] !== undefined
  )
}

// ============================================================================
// 타입 변환 함수
// ============================================================================

/**
 * Notion Status를 앱 Status로 변환
 */
export function convertNotionStatusToApp(
  notionStatus: string | null | undefined
): Status {
  if (!notionStatus) {
    return 'todo'
  }

  const mapped = NOTION_TO_APP_STATUS[notionStatus]
  if (!mapped) {
    throw new ValidationError(`유효하지 않은 상태: ${notionStatus}`)
  }

  return mapped
}

/**
 * Notion Category를 앱 Category로 변환
 */
export function convertNotionCategoryToApp(
  notionCategory: string | null | undefined
): Category {
  if (!notionCategory) {
    return 'other'
  }

  const mapped = NOTION_TO_APP_CATEGORY[notionCategory]
  if (!mapped) {
    // 유효하지 않은 카테고리는 'other'로 처리
    return 'other'
  }

  return mapped
}

/**
 * Notion DTO를 LearningItem으로 변환
 */
export function convertDTOToLearningItem(dto: LearningItemDTO): LearningItem {
  if (!isValidLearningItemDTO(dto)) {
    throw new ValidationError('유효하지 않은 Notion 데이터 구조', { dto })
  }

  const props = dto.properties

  // 제목 추출
  const title = props['제목']?.title?.[0]?.plain_text || '제목 없음'

  // 카테고리 추출
  const category = convertNotionCategoryToApp(props['카테고리']?.select?.name)

  // 상태 추출
  const status = convertNotionStatusToApp(props['상태']?.status?.name)

  // 날짜 추출
  const dateData = props['날짜']?.date
  let startDate: Date | undefined
  let endDate: Date | undefined

  if (dateData?.start) {
    startDate = new Date(dateData.start)
  }

  if (dateData?.end) {
    endDate = new Date(dateData.end)
  }

  // 요약 추출
  const summary =
    props['요약']?.rich_text?.map(t => t.plain_text).join('') || ''

  // 내용 추출
  const content =
    props['내용']?.rich_text?.map(t => t.plain_text).join('') || ''

  // 태그 추출
  const tags = props['태그']?.multi_select?.map(t => t.name) || []

  return {
    id: dto.id,
    title,
    category,
    status,
    startDate,
    endDate,
    summary,
    content,
    tags,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

/**
 * LearningItem 배열을 변환
 */
export function convertDTOsToLearningItems(
  dtos: LearningItemDTO[]
): LearningItem[] {
  return dtos.map(dto => convertDTOToLearningItem(dto))
}

// ============================================================================
// 데이터 검증 함수
// ============================================================================

/**
 * 제목 검증
 */
export function validateTitle(title: unknown): string {
  if (typeof title !== 'string') {
    throw new ValidationError('제목은 문자열이어야 합니다')
  }

  if (title.trim().length === 0) {
    throw new ValidationError('제목이 비어있습니다')
  }

  if (title.length > 200) {
    throw new ValidationError('제목은 200자 이하여야 합니다')
  }

  return title.trim()
}

/**
 * 요약 검증
 */
export function validateSummary(summary: unknown): string {
  if (typeof summary !== 'string') {
    throw new ValidationError('요약은 문자열이어야 합니다')
  }

  if (summary.length > 500) {
    throw new ValidationError('요약은 500자 이하여야 합니다')
  }

  return summary.trim()
}

/**
 * 태그 검증
 */
export function validateTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) {
    throw new ValidationError('태그는 배열이어야 합니다')
  }

  return tags.filter(tag => typeof tag === 'string' && tag.trim().length > 0)
}

/**
 * 날짜 범위 검증
 */
export function validateDateRange(
  startDate: unknown,
  endDate: unknown
): { start?: Date; end?: Date } {
  const result: { start?: Date; end?: Date } = {}

  if (startDate !== undefined && startDate !== null) {
    if (!(startDate instanceof Date)) {
      throw new ValidationError('시작 날짜는 Date 객체여야 합니다')
    }
    result.start = startDate
  }

  if (endDate !== undefined && endDate !== null) {
    if (!(endDate instanceof Date)) {
      throw new ValidationError('종료 날짜는 Date 객체여야 합니다')
    }
    result.end = endDate
  }

  if (result.start && result.end && result.start > result.end) {
    throw new ValidationError('시작 날짜가 종료 날짜보다 클 수 없습니다')
  }

  return result
}
