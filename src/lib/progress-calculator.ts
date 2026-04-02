import {
  LearningItem,
  Status,
  Category,
  ProgressInfo,
  CategoryProgress,
} from '@/types'
import { CATEGORIES } from './constants'

// ============================================================================
// 백분율 계산
// ============================================================================

/**
 * 완료 수와 전체 수를 받아 백분율을 반환합니다.
 * 전체가 0이면 0을 반환합니다.
 *
 * @param completed - 완료된 항목 수
 * @param total - 전체 항목 수
 * @returns 0~100 사이의 정수 백분율
 */
export function calculatePercentage(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

// ============================================================================
// 전체 진행률 계산
// ============================================================================

/**
 * 학습 항목 전체의 진행률 정보를 계산합니다.
 *
 * @param items - 집계할 학습 항목 배열
 * @returns 전체 진행률 정보 (total, completed, inProgress, todo, percentage)
 */
export function calculateTotalProgress(items: LearningItem[]): ProgressInfo {
  const total = items.length
  const completed = items.filter(item => item.status === 'done').length
  const inProgress = items.filter(item => item.status === 'in_progress').length
  const todo = items.filter(item => item.status === 'todo').length

  return {
    total,
    completed,
    inProgress,
    todo,
    percentage: calculatePercentage(completed, total),
  }
}

// ============================================================================
// 카테고리별 진행률 계산
// ============================================================================

/**
 * 특정 카테고리의 진행률 정보를 계산합니다.
 *
 * @param items - 전체 학습 항목 배열
 * @param category - 계산할 카테고리
 * @returns 해당 카테고리의 진행률 정보
 */
export function calculateCategoryProgress(
  items: LearningItem[],
  category: Category
): CategoryProgress {
  const categoryItems = items.filter(item => item.category === category)
  const progress = calculateTotalProgress(categoryItems)

  return {
    ...progress,
    category,
  }
}

/**
 * 모든 카테고리의 진행률 정보를 한꺼번에 계산합니다.
 * CATEGORIES 상수에 정의된 순서를 따릅니다.
 *
 * @param items - 전체 학습 항목 배열
 * @returns 카테고리별 진행률 정보 배열
 */
export function calculateAllCategoryProgress(
  items: LearningItem[]
): CategoryProgress[] {
  return CATEGORIES.map(category => calculateCategoryProgress(items, category))
}

// ============================================================================
// 상태별 항목 조회
// ============================================================================

/**
 * 진행 중(in_progress) 상태인 항목만 반환합니다.
 *
 * @param items - 전체 학습 항목 배열
 * @returns 진행 중인 항목 배열
 */
export function getInProgressItems(items: LearningItem[]): LearningItem[] {
  return items.filter(item => item.status === 'in_progress')
}

/**
 * 완료(done) 상태인 항목만 반환합니다.
 *
 * @param items - 전체 학습 항목 배열
 * @returns 완료된 항목 배열
 */
export function getCompletedItems(items: LearningItem[]): LearningItem[] {
  return items.filter(item => item.status === 'done')
}

/**
 * 시작 전(todo) 상태인 항목만 반환합니다.
 *
 * @param items - 전체 학습 항목 배열
 * @returns 시작 전 항목 배열
 */
export function getTodoItems(items: LearningItem[]): LearningItem[] {
  return items.filter(item => item.status === 'todo')
}

/**
 * 주어진 상태에 해당하는 항목만 반환합니다.
 *
 * @param items - 전체 학습 항목 배열
 * @param status - 필터링할 상태
 * @returns 해당 상태의 항목 배열
 */
export function getItemsByStatus(
  items: LearningItem[],
  status: Status
): LearningItem[] {
  return items.filter(item => item.status === status)
}

// ============================================================================
// 진행률 관련 헬퍼
// ============================================================================

/**
 * 진행률 정보에서 미완료 항목 수를 반환합니다.
 *
 * @param progress - 진행률 정보
 * @returns 미완료 항목 수 (inProgress + todo)
 */
export function getRemainingCount(progress: ProgressInfo): number {
  return progress.inProgress + progress.todo
}

/**
 * 학습 완료 여부를 반환합니다.
 * 전체 항목이 0이면 false를 반환합니다.
 *
 * @param progress - 진행률 정보
 * @returns 모든 항목이 완료되었으면 true
 */
export function isAllCompleted(progress: ProgressInfo): boolean {
  if (progress.total === 0) return false
  return progress.completed === progress.total
}

/**
 * 진행이 시작되었는지 여부를 반환합니다.
 *
 * @param progress - 진행률 정보
 * @returns 하나라도 완료 또는 진행 중이면 true
 */
export function hasStarted(progress: ProgressInfo): boolean {
  return progress.completed > 0 || progress.inProgress > 0
}
