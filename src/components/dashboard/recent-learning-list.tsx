// 최근 학습 항목 리스트 및 필터링 섹션 컴포넌트
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LearningItemCard } from '@/components/learning/learning-item-card'
import { FilterBar } from '@/components/learning/filter-bar'
import { EmptyState } from '@/components/learning/empty-state'
import { LoadingSkeleton } from '@/components/learning/loading-skeleton'
import { ArrowRight } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import type { LearningItem, Status, Category } from '@/types'

/**
 * RecentLearningList 컴포넌트 Props
 */
interface RecentLearningListProps {
  /** 표시할 학습 항목 목록 (최대 10개, 최신순 정렬) */
  items: LearningItem[]
  /** 현재 선택된 상태 필터 목록 */
  selectedStatuses?: Status[]
  /** 현재 선택된 카테고리 필터 목록 */
  selectedCategories?: Category[]
  /** 상태 필터 변경 핸들러 */
  onStatusChange?: (statuses: Status[]) => void
  /** 카테고리 필터 변경 핸들러 */
  onCategoryChange?: (categories: Category[]) => void
  /** 필터 초기화 핸들러 */
  onFilterReset?: () => void
  /** 학습 항목 클릭 핸들러 */
  onItemClick?: (item: LearningItem) => void
  /** 로딩 중 여부 */
  isLoading?: boolean
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 최근 학습 리스트 섹션 컴포넌트
 * - 최근 학습 항목 최대 10개 표시 (날짜 최신순)
 * - 상태별 / 카테고리별 필터링 UI
 * - 빈 상태 처리 (EmptyState 컴포넌트)
 * - 로딩 스켈레톤 지원
 * - 로드맵 전체 보기 링크 제공
 */
export function RecentLearningList({
  items,
  selectedStatuses = [],
  selectedCategories = [],
  onStatusChange,
  onCategoryChange,
  onFilterReset,
  onItemClick,
  isLoading = false,
  className,
}: RecentLearningListProps) {
  // 활성화된 필터 여부 확인
  const hasActiveFilters =
    selectedStatuses.length > 0 || selectedCategories.length > 0

  return (
    <section
      aria-labelledby="recent-learning-title"
      className={cn('flex flex-col gap-4', className)}
    >
      {/* ====== 섹션 헤더 ====== */}
      <div className="flex items-center justify-between">
        <h2
          id="recent-learning-title"
          className="text-foreground text-xl font-semibold"
        >
          최근 학습
          {/* 항목 수 표시 배지 */}
          {!isLoading && items.length > 0 && (
            <span
              className="text-muted-foreground ml-2 text-sm font-normal"
              aria-label={`총 ${items.length}개 항목`}
            >
              ({items.length}개)
            </span>
          )}
        </h2>

        {/* 로드맵 전체 보기 링크 */}
        <Link
          href={ROUTES.roadmap}
          className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-medium transition-colors"
          aria-label="로드맵 전체 보기로 이동"
        >
          전체 보기
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {/* ====== 필터 바 ====== */}
      <FilterBar
        statuses={selectedStatuses}
        categories={selectedCategories}
        onStatusChange={onStatusChange}
        onCategoryChange={onCategoryChange}
        onReset={onFilterReset}
        aria-label="학습 항목 필터"
      />

      {/* ====== 학습 항목 목록 ====== */}
      {isLoading ? (
        /* 로딩 스켈레톤 */
        <div
          className="flex flex-col gap-3"
          aria-busy="true"
          aria-label="학습 항목 로딩 중"
        >
          {Array.from({ length: 4 }).map((_, idx) => (
            <LoadingSkeleton key={idx} variant="card" />
          ))}
        </div>
      ) : items.length === 0 ? (
        /* 빈 상태 */
        <EmptyState
          title={
            hasActiveFilters ? '검색 결과가 없습니다' : '학습 항목이 없습니다'
          }
          description={
            hasActiveFilters
              ? '선택한 필터 조건에 해당하는 항목이 없습니다. 필터를 변경해 보세요.'
              : 'Notion에서 학습 항목을 추가하면 여기에 표시됩니다.'
          }
          action={
            hasActiveFilters && onFilterReset
              ? {
                  label: '필터 초기화',
                  onClick: onFilterReset,
                }
              : undefined
          }
        />
      ) : (
        /* 학습 항목 카드 목록 */
        <ul
          className="flex flex-col gap-3"
          role="list"
          aria-label="최근 학습 항목 목록"
        >
          {items.map(item => (
            <li key={item.id} role="listitem">
              <LearningItemCard
                item={item}
                variant="default"
                onClick={
                  onItemClick
                    ? () => {
                        // TODO: 항목 클릭 시 상세 페이지 이동 로직 연결 필요
                        onItemClick(item)
                      }
                    : undefined
                }
              />
            </li>
          ))}
        </ul>
      )}

      {/* ====== 더 많은 항목 안내 ====== */}
      {!isLoading && items.length >= 10 && (
        <div className="flex justify-center pt-2">
          <Link href={ROUTES.roadmap}>
            <Button
              variant="outline"
              size="sm"
              aria-label="로드맵에서 모든 학습 항목 보기"
            >
              로드맵에서 전체 보기
              <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      )}
    </section>
  )
}
