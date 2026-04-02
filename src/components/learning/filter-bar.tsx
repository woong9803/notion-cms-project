// 학습 상태 및 카테고리 필터를 관리하는 필터 바 컴포넌트
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { CategoryBadge } from '@/components/learning/category-badge'
import { STATUS_LABELS, ALL_STATUSES, CATEGORIES } from '@/lib/constants'
import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import type { Status, Category } from '@/types'

/**
 * FilterBar 컴포넌트 Props
 */
interface FilterBarProps {
  /** 현재 선택된 상태 목록 */
  statuses?: Status[]
  /** 현재 선택된 카테고리 목록 */
  categories?: Category[]
  /** 상태 필터 변경 핸들러 */
  onStatusChange?: (statuses: Status[]) => void
  /** 카테고리 필터 변경 핸들러 */
  onCategoryChange?: (categories: Category[]) => void
  /** 필터 초기화 핸들러 */
  onReset?: () => void
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 상태 필터 버튼 배경색 매핑
 */
const statusFilterColors: Record<
  Status,
  { selected: string; default: string }
> = {
  todo: {
    selected: 'bg-slate-200 text-slate-800 border-slate-400',
    default: 'bg-transparent text-slate-600 border-slate-300 hover:bg-slate-50',
  },
  in_progress: {
    selected: 'bg-blue-100 text-blue-800 border-blue-400',
    default: 'bg-transparent text-slate-600 border-slate-300 hover:bg-blue-50',
  },
  done: {
    selected: 'bg-green-100 text-green-800 border-green-400',
    default: 'bg-transparent text-slate-600 border-slate-300 hover:bg-green-50',
  },
} as const

/**
 * 상태 및 카테고리 필터 바 컴포넌트
 * - 상태별(시작 전, 진행 중, 완료) 필터 버튼
 * - 카테고리별 필터 버튼
 * - 전체 필터 초기화 버튼
 * - 모바일/데스크톱 반응형 레이아웃
 */
export function FilterBar({
  statuses = [],
  categories = [],
  onStatusChange,
  onCategoryChange,
  onReset,
  className,
}: FilterBarProps) {
  // 활성화된 필터 수 계산 (초기화 버튼 표시 여부 판단용)
  const activeFilterCount = statuses.length + categories.length

  return (
    <div
      role="search"
      aria-label="학습 항목 필터"
      className={cn(
        // 기본 레이아웃
        'bg-card flex flex-col gap-3 rounded-lg border p-4',
        // 데스크톱: 가로 정렬
        'md:flex-row md:items-center md:gap-4',
        className
      )}
    >
      {/* 필터 아이콘 + 레이블 */}
      <div className="text-muted-foreground flex shrink-0 items-center gap-1.5 text-sm font-medium">
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        <span>필터</span>
      </div>

      {/* 구분선 (데스크톱) */}
      <div className="bg-border hidden h-5 w-px md:block" aria-hidden="true" />

      {/* ====== 상태 필터 영역 ====== */}
      <div className="flex flex-col gap-1.5">
        <span
          className="text-muted-foreground text-xs font-medium"
          id="status-filter-label"
        >
          상태
        </span>
        <div
          role="group"
          aria-labelledby="status-filter-label"
          className="flex flex-wrap items-center gap-1.5"
        >
          {ALL_STATUSES.map(status => {
            const isSelected = statuses.includes(status)
            const colors = statusFilterColors[status]

            return (
              <button
                key={status}
                type="button"
                aria-pressed={isSelected}
                aria-label={`${STATUS_LABELS[status]} 상태 필터 ${isSelected ? '(선택됨)' : ''}`}
                onClick={
                  onStatusChange
                    ? () => {
                        // TODO: 상태 필터 토글 로직 구현 - onStatusChange 호출
                      }
                    : undefined
                }
                className={cn(
                  'rounded-md border px-2.5 py-1 text-xs font-medium transition-all duration-150',
                  'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none',
                  isSelected ? colors.selected : colors.default
                )}
              >
                {STATUS_LABELS[status]}
              </button>
            )
          })}
        </div>
      </div>

      {/* 구분선 (데스크톱) */}
      <div className="bg-border hidden h-5 w-px md:block" aria-hidden="true" />

      {/* ====== 카테고리 필터 영역 ====== */}
      <div className="flex flex-col gap-1.5">
        <span
          className="text-muted-foreground text-xs font-medium"
          id="category-filter-label"
        >
          카테고리
        </span>
        <div
          role="group"
          aria-labelledby="category-filter-label"
          className="flex flex-wrap items-center gap-1.5"
        >
          {CATEGORIES.map(category => (
            <CategoryBadge
              key={category}
              category={category}
              isClickable
              isSelected={categories.includes(category)}
              onClick={
                onCategoryChange
                  ? () => {
                      // TODO: 카테고리 필터 토글 로직 구현 - onCategoryChange 호출
                    }
                  : undefined
              }
            />
          ))}
        </div>
      </div>

      {/* 초기화 버튼 (활성화된 필터가 있을 때만 표시) */}
      {activeFilterCount > 0 && (
        <>
          {/* 구분선 (데스크톱) */}
          <div
            className="bg-border hidden h-5 w-px md:block"
            aria-hidden="true"
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            // TODO: 외부에서 onReset 핸들러 전달 필요
            aria-label={`필터 초기화 (현재 ${activeFilterCount}개 필터 활성화됨)`}
            className="text-muted-foreground hover:text-foreground shrink-0 gap-1.5 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            초기화
            {/* 활성화된 필터 수 배지 */}
            <span className="bg-primary text-primary-foreground flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold">
              {activeFilterCount}
            </span>
          </Button>
        </>
      )}
    </div>
  )
}
