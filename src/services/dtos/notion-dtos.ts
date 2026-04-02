// ============================================================================
// Notion API 응답 원본 타입 정의 (DTO)
// ============================================================================
// @notionhq/client의 PageObjectResponse를 기반으로
// 애플리케이션에서 사용하는 필드만 추출한 타입입니다.

// ============================================================================
// 속성(Property) 타입별 DTO
// ============================================================================

/**
 * Notion title 속성 DTO
 */
export interface TitlePropertyDTO {
  type: 'title'
  title: Array<{
    type: string
    plain_text: string
    annotations?: Record<string, unknown>
  }>
}

/**
 * Notion select 속성 DTO
 */
export interface SelectPropertyDTO {
  type: 'select'
  select: {
    id: string
    name: string
    color: string
  } | null
}

/**
 * Notion status 속성 DTO
 */
export interface StatusPropertyDTO {
  type: 'status'
  status: {
    id: string
    name: string
    color: string
  } | null
}

/**
 * Notion date 속성 DTO
 */
export interface DatePropertyDTO {
  type: 'date'
  date: {
    start: string
    end: string | null
    time_zone: string | null
  } | null
}

/**
 * Notion rich_text 속성 DTO
 */
export interface RichTextPropertyDTO {
  type: 'rich_text'
  rich_text: Array<{
    type: string
    plain_text: string
    annotations?: Record<string, unknown>
    href?: string | null
  }>
}

/**
 * Notion multi_select 속성 DTO
 */
export interface MultiSelectPropertyDTO {
  type: 'multi_select'
  multi_select: Array<{
    id: string
    name: string
    color: string
  }>
}

// ============================================================================
// 페이지 속성 DTO
// ============================================================================

/**
 * 학습 항목 Notion 페이지의 properties 구조
 * Notion 데이터베이스 컬럼명과 1:1 대응합니다.
 */
export interface LearningPagePropertiesDTO {
  제목: TitlePropertyDTO
  카테고리: SelectPropertyDTO
  상태: StatusPropertyDTO
  날짜: DatePropertyDTO
  요약: RichTextPropertyDTO
  내용: RichTextPropertyDTO
  태그: MultiSelectPropertyDTO
}

/**
 * Notion 학습 페이지 전체 DTO
 * PageObjectResponse에서 필요한 필드만 추출합니다.
 */
export interface NotionLearningPageDTO {
  /** Notion 페이지 고유 ID */
  id: string
  /** 페이지 생성 시각 (ISO 8601) */
  created_time: string
  /** 페이지 마지막 수정 시각 (ISO 8601) */
  last_edited_time: string
  /** 페이지 속성 */
  properties: LearningPagePropertiesDTO
}

// ============================================================================
// 데이터베이스 쿼리 응답 DTO
// ============================================================================

/**
 * Notion 데이터베이스 쿼리 결과 DTO
 */
export interface NotionDatabaseQueryResultDTO {
  /** 조회된 페이지 목록 */
  pages: NotionLearningPageDTO[]
  /** 다음 페이지 커서 (페이지네이션) */
  nextCursor: string | null
  /** 추가 페이지 존재 여부 */
  hasMore: boolean
}
