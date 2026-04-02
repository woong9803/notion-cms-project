'use client'

// 홈 페이지 클라이언트 인터랙션 영역 컴포넌트
// - 카테고리 클릭, 필터 상태 관리 등 상호작용 처리
import { CategoryProgressGrid } from '@/components/dashboard/category-progress-grid'
import { RecentLearningList } from '@/components/dashboard/recent-learning-list'
import type { CategoryProgress, LearningItem } from '@/types'

/**
 * HomeClient 컴포넌트 Props
 */
interface HomeClientProps {
  /** 카테고리별 진행률 목록 */
  categoryProgressList: CategoryProgress[]
  /** 최근 학습 항목 목록 */
  recentItems: LearningItem[]
}

/**
 * 홈 페이지 클라이언트 인터랙션 영역 (Client Component)
 * - 카테고리 카드 클릭 이벤트 처리
 * - 학습 항목 클릭 이벤트 처리
 * - 필터 상태 관리
 *
 * TODO: 실제 상태 관리 구현 필요
 * - useState로 selectedCategory, selectedStatuses, selectedCategories 관리
 * - 필터 변경 시 URL params 업데이트 (useRouter, useSearchParams)
 */
export function HomeClient({
  categoryProgressList,
  recentItems,
}: HomeClientProps) {
  return (
    <>
      {/* ====== Task 203: 카테고리별 진행률 그리드 ====== */}
      <CategoryProgressGrid
        categoryProgressList={categoryProgressList}
        onCategoryClick={() => {}}
        // TODO: 카테고리 클릭 시 selectedCategory 상태 업데이트 연결 필요
      />

      {/* ====== Task 204: 최근 학습 리스트 ====== */}
      <RecentLearningList
        items={recentItems}
        onStatusChange={() => {}}
        // TODO: 상태 필터 변경 시 selectedStatuses 상태 업데이트 연결 필요
        onCategoryChange={() => {}}
        // TODO: 카테고리 필터 변경 시 selectedCategories 상태 업데이트 연결 필요
        onFilterReset={() => {}}
        // TODO: 필터 초기화 시 모든 필터 상태 초기화 연결 필요
        onItemClick={() => {}}
        // TODO: 항목 클릭 시 상세 페이지 이동 로직 연결 필요 (useRouter)
      />
    </>
  )
}
