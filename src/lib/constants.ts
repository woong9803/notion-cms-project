import { Status, Category } from '@/types'

// ============================================================================
// 상태(Status) 관련 상수
// ============================================================================

/**
 * 상태 레이블 매핑
 */
export const STATUS_LABELS: Record<Status, string> = {
  todo: '시작 전',
  in_progress: '진행 중',
  done: '완료',
} as const

/**
 * 상태 색상 매핑 (Tailwind CSS 클래스)
 */
export const STATUS_COLORS: Record<
  Status,
  { bg: string; text: string; border: string }
> = {
  todo: {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
  },
  in_progress: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-300',
  },
  done: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-300',
  },
} as const

/**
 * 상태 배지 색상 (Badge 컴포넌트용)
 */
export const STATUS_BADGE_VARIANTS: Record<
  Status,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  todo: 'secondary',
  in_progress: 'default',
  done: 'outline',
} as const

// ============================================================================
// 카테고리 관련 상수
// ============================================================================

/**
 * 카테고리 레이블 매핑
 */
export const CATEGORY_LABELS: Record<Category, string> = {
  react_native: 'React Native',
  expo: 'Expo',
  expo_router: 'Expo Router',
  typescript: 'TypeScript',
  zustand: 'Zustand',
  other: '기타',
} as const

/**
 * 카테고리 색상 매핑
 */
export const CATEGORY_COLORS: Record<Category, { bg: string; text: string }> = {
  react_native: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
  },
  expo: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
  },
  expo_router: {
    bg: 'bg-cyan-100',
    text: 'text-cyan-700',
  },
  typescript: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
  },
  zustand: {
    bg: 'bg-green-100',
    text: 'text-green-700',
  },
  other: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
  },
} as const

/**
 * 카테고리 목록
 */
export const CATEGORIES: Category[] = [
  'react_native',
  'expo',
  'expo_router',
  'typescript',
  'zustand',
  'other',
] as const

/**
 * Notion 카테고리명 → 애플리케이션 카테고리 매핑
 */
export const NOTION_TO_APP_CATEGORY: Record<string, Category> = {
  'React Native': 'react_native',
  Expo: 'expo',
  'Expo Router': 'expo_router',
  TypeScript: 'typescript',
  Zustand: 'zustand',
} as const

// ============================================================================
// 상태별 쿼리 상수
// ============================================================================

/**
 * 모든 상태 목록
 */
export const ALL_STATUSES: Status[] = ['todo', 'in_progress', 'done'] as const

/**
 * Notion Status 값 → 애플리케이션 Status 매핑
 */
export const NOTION_TO_APP_STATUS: Record<string, Status> = {
  '시작 전': 'todo',
  '진행 중': 'in_progress',
  완료: 'done',
} as const

/**
 * 애플리케이션 Status → Notion Status 매핑
 */
export const APP_TO_NOTION_STATUS: Record<Status, string> = {
  todo: '시작 전',
  in_progress: '진행 중',
  done: '완료',
} as const

// ============================================================================
// 페이지 및 라우트 상수
// ============================================================================

/**
 * 라우트 경로
 */
export const ROUTES = {
  home: '/',
  roadmap: '/roadmap',
  detail: (id: string) => `/detail/${id}`,
} as const

/**
 * 페이지 제목
 */
export const PAGE_TITLES: Record<string, string> = {
  '/': 'DevPath - 학습 로드맵',
  '/roadmap': 'DevPath - 로드맵',
} as const

/**
 * 페이지 설명
 */
export const PAGE_DESCRIPTIONS: Record<string, string> = {
  '/': 'React Native, Expo 등 새로운 기술 스택 학습 기록과 진척도를 시각화하고 공유합니다.',
  '/roadmap': '기술 스택별 학습 타임라인과 진행 상황을 확인하세요.',
} as const

// ============================================================================
// 페이지 크기 및 제한값
// ============================================================================

/**
 * 홈 페이지 최근 학습 리스트 개수
 */
export const HOME_PAGE_RECENT_LIMIT = 10

/**
 * 로드맵 페이지 기본 페이지 크기
 */
export const ROADMAP_PAGE_SIZE = 20

/**
 * 검색 최소 길이
 */
export const MIN_SEARCH_LENGTH = 2

/**
 * 검색 최대 길이
 */
export const MAX_SEARCH_LENGTH = 100

// ============================================================================
// 시간 관련 상수
// ============================================================================

/**
 * Notion API 캐시 기간 (초 단위)
 */
export const NOTION_CACHE_TTL = 300 // 5분

/**
 * ISR 재검증 기간 (초 단위)
 */
export const ISR_REVALIDATE = 3600 // 1시간

// ============================================================================
// 에러 메시지
// ============================================================================

/**
 * 에러 메시지
 */
export const ERROR_MESSAGES = {
  notFound: '페이지를 찾을 수 없습니다.',
  serverError: '서버 오류가 발생했습니다.',
  networkError: '네트워크 오류가 발생했습니다.',
  unauthorized: '인증이 필요합니다.',
  forbidden: '접근 권한이 없습니다.',
  validationError: '입력값이 유효하지 않습니다.',
  notionError: 'Notion API 오류가 발생했습니다.',
  noData: '데이터를 찾을 수 없습니다.',
} as const

/**
 * 성공 메시지
 */
export const SUCCESS_MESSAGES = {
  loadSuccess: '데이터를 불러왔습니다.',
  filterApplied: '필터가 적용되었습니다.',
} as const

// ============================================================================
// UI 텍스트
// ============================================================================

/**
 * 버튼 텍스트
 */
export const BUTTON_TEXTS = {
  home: '홈',
  roadmap: '로드맵',
  detail: '상세 보기',
  back: '돌아가기',
  search: '검색',
  filter: '필터',
  reset: '초기화',
  more: '더보기',
} as const

/**
 * 필터 텍스트
 */
export const FILTER_TEXTS = {
  all: '모두',
  byStatus: '상태별',
  byCategory: '카테고리별',
  recent: '최근순',
} as const
