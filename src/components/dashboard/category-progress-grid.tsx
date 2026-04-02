// 카테고리별 진행률 카드 그리드 섹션 컴포넌트
import { cn } from '@/lib/utils'
import { ProgressCard } from '@/components/learning/progress-card'
import { LoadingSkeleton } from '@/components/learning/loading-skeleton'
import type { CategoryProgress, Category } from '@/types'

/**
 * CategoryProgressGrid 컴포넌트 Props
 */
interface CategoryProgressGridProps {
  /** 카테고리별 진행률 데이터 목록 */
  categoryProgressList: CategoryProgress[]
  /** 현재 선택된 카테고리 (필터링 상태 표시용) */
  selectedCategory?: Category | null
  /** 카테고리 카드 클릭 핸들러 */
  onCategoryClick?: (category: Category) => void
  /** 로딩 중 여부 */
  isLoading?: boolean
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 카테고리별 진행률 카드 그리드 섹션
 * - 카테고리별 진행률을 카드 그리드로 표시
 * - 모바일: 1열, 태블릿: 2열, 데스크톱: 3열
 * - 로딩 스켈레톤 지원
 * - 카드 클릭 시 해당 카테고리로 필터링 트리거
 */
export function CategoryProgressGrid({
  categoryProgressList,
  selectedCategory,
  onCategoryClick,
  isLoading = false,
  className,
}: CategoryProgressGridProps) {
  // 로딩 스켈레톤 개수 (카테고리 수에 맞춤)
  const skeletonCount = 6

  return (
    <section
      aria-labelledby="category-progress-title"
      className={cn(className)}
    >
      {/* 섹션 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <h2
          id="category-progress-title"
          className="text-foreground text-xl font-semibold"
        >
          카테고리별 진행률
        </h2>
        {/* 선택된 카테고리 표시 */}
        {selectedCategory && (
          <button
            type="button"
            onClick={() => onCategoryClick?.(selectedCategory)}
            // TODO: 선택 해제 로직 구현 필요
            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
            aria-label="카테고리 필터 선택 해제"
          >
            <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-xs font-medium">
              필터 활성화
            </span>
            <span className="text-xs">해제</span>
          </button>
        )}
      </div>

      {/* ====== 카드 그리드 영역 ====== */}
      {isLoading ? (
        /* 로딩 스켈레톤 그리드 */
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-busy="true"
          aria-label="카테고리 진행률 로딩 중"
        >
          {Array.from({ length: skeletonCount }).map((_, idx) => (
            <LoadingSkeleton key={idx} variant="card" />
          ))}
        </div>
      ) : categoryProgressList.length === 0 ? (
        /* 데이터 없음 상태 */
        <div className="bg-muted/50 flex h-40 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground text-sm">
            카테고리 데이터가 없습니다.
          </p>
        </div>
      ) : (
        /* 카드 그리드 */
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
          aria-label="카테고리별 진행률 목록"
        >
          {categoryProgressList.map(categoryProgress => (
            <div key={categoryProgress.category} role="listitem">
              <ProgressCard
                category={categoryProgress.category}
                total={categoryProgress.total}
                completed={categoryProgress.completed}
                inProgress={categoryProgress.inProgress}
                isClickable={!!onCategoryClick}
                onClick={
                  onCategoryClick
                    ? () => {
                        // TODO: 카테고리 클릭 시 필터 적용 로직 연결 필요
                        onCategoryClick(categoryProgress.category)
                      }
                    : undefined
                }
                className={cn(
                  // 선택된 카테고리 강조 표시
                  selectedCategory === categoryProgress.category &&
                    'ring-primary ring-2 ring-offset-2'
                )}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
