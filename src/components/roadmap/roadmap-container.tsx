'use client'

// 로드맵 페이지 상호작용 컨테이너 컴포넌트 (클라이언트 컴포넌트)
// - 카테고리 탭 전환, 상태 필터링 등 인터랙션 상태 관리
import { cn } from '@/lib/utils'
import { RoadmapCategoryTabs } from '@/components/roadmap/roadmap-category-tabs'
import { RoadmapLegend } from '@/components/roadmap/roadmap-legend'
import { Timeline } from '@/components/roadmap/timeline'
import { FilterBar } from '@/components/learning/filter-bar'
import type { LearningItem, Status, Category } from '@/types'

/**
 * RoadmapContainer 컴포넌트 Props
 */
interface RoadmapContainerProps {
  /** 전체 학습 항목 목록 */
  items: LearningItem[]
  /** 현재 활성화된 카테고리 탭 */
  activeCategory?: 'all' | Category
  /** 현재 선택된 상태 필터 목록 */
  selectedStatuses?: Status[]
  /** 카테고리별 항목 수 (탭 배지용) */
  categoryCounts?: Partial<Record<'all' | Category, number>>
  /** 로딩 중 여부 */
  isLoading?: boolean
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 로드맵 페이지 상호작용 컨테이너 (Task 205, 206, 207)
 * - 카테고리 탭 전환 UI
 * - 상태 필터링 UI
 * - 필터링된 타임라인 렌더링
 * - 범례 표시
 * - 반응형 레이아웃
 *
 * 상태 관리는 props로만 받고 TODO 주석으로 실제 연결 지점 표시
 */
export function RoadmapContainer({
  items,
  activeCategory = 'all',
  selectedStatuses = [],
  categoryCounts = {},
  isLoading = false,
  className,
}: RoadmapContainerProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* ====== 카테고리 탭 영역 ====== */}
      <div className="flex flex-col gap-4">
        <RoadmapCategoryTabs
          activeCategory={activeCategory}
          categoryCounts={categoryCounts}
          onCategoryChange={() => {}}
          // TODO: 카테고리 탭 변경 시 상태 업데이트 또는 URL params 연결 필요
        />

        {/* 상태 필터 바 */}
        <FilterBar
          statuses={selectedStatuses}
          onStatusChange={() => {}}
          // TODO: 상태 필터 변경 시 상태 업데이트 연결 필요
          onReset={() => {}}
          // TODO: 필터 초기화 연결 필요
        />
      </div>

      {/* ====== 범례 ====== */}
      <RoadmapLegend />

      {/* ====== 타임라인 뷰 ====== */}
      <div className="relative">
        {/* 필터링된 항목 수 표시 */}
        {!isLoading && (
          <p className="text-muted-foreground mb-4 text-sm">
            {/* TODO: 실제 필터링된 항목 수로 교체 필요 */}총{' '}
            <strong className="text-foreground font-semibold">
              {items.length}개
            </strong>{' '}
            항목
            {selectedStatuses.length > 0 && (
              <span className="ml-1">
                (필터 적용됨: {selectedStatuses.length}개)
              </span>
            )}
          </p>
        )}

        {/* 타임라인 컴포넌트 */}
        <Timeline
          items={items}
          isLoading={isLoading}
          onItemClick={() => {}}
          // TODO: 항목 클릭 시 상세 페이지 라우팅 연결 필요 (useRouter)
        />
      </div>
    </div>
  )
}
