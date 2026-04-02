// ============================================================================
// 학습 타입 정의
// ============================================================================

/**
 * 학습 항목의 상태
 */
export type Status = 'todo' | 'in_progress' | 'done'

/**
 * 학습 카테고리
 */
export type Category =
  | 'react_native'
  | 'expo'
  | 'expo_router'
  | 'typescript'
  | 'zustand'
  | 'other'

/**
 * 학습 항목의 기본 데이터 구조
 */
export interface LearningItem {
  id: string
  title: string
  category: Category
  status: Status
  startDate?: Date
  endDate?: Date
  summary: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

/**
 * Notion API 응답 데이터를 위한 DTO (Data Transfer Object)
 */
export interface LearningItemDTO {
  id: string
  properties: {
    제목: { title: Array<{ plain_text: string }> }
    카테고리: { select: { name: string } | null }
    상태: { status: { name: string } | null }
    날짜: { date: { start: string; end: string | null } | null }
    요약: { rich_text: Array<{ plain_text: string }> }
    내용: { rich_text: Array<{ plain_text: string }> }
    태그: { multi_select: Array<{ name: string }> }
  }
}

/**
 * 진행률 정보
 */
export interface ProgressInfo {
  total: number
  completed: number
  inProgress: number
  todo: number
  percentage: number
}

/**
 * 카테고리별 진행률
 */
export interface CategoryProgress extends ProgressInfo {
  category: Category
}

// ============================================================================
// 에러 처리 타입
// ============================================================================

/**
 * API 에러 응답
 */
export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

/**
 * API 성공 응답
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
}

/**
 * 페이지네이션 정보
 */
export interface PaginationInfo {
  page: number
  pageSize: number
  total: number
  hasMore: boolean
}

/**
 * 페이지네이션이 적용된 응답
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo
}

// ============================================================================
// 필터링 관련 타입
// ============================================================================

/**
 * 필터링 옵션
 */
export interface FilterOptions {
  status?: Status | Status[]
  category?: Category | Category[]
  searchText?: string
  startDate?: Date
  endDate?: Date
}

/**
 * 정렬 옵션
 */
export type SortOrder = 'asc' | 'desc'
export type SortBy = 'title' | 'date' | 'status' | 'category'

export interface SortOptions {
  by: SortBy
  order: SortOrder
}

// ============================================================================
// UI 상태 타입
// ============================================================================

/**
 * 로딩 상태
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

/**
 * 모달/드롭다운 상태
 */
export interface UIState {
  isOpen: boolean
  activeTab?: string
  selectedId?: string
}
