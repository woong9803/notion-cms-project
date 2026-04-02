// 학습 카테고리를 시각적으로 표시하는 배지 컴포넌트
import { cn } from '@/lib/utils'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/constants'
import type { Category } from '@/types'

/**
 * CategoryBadge 컴포넌트 Props
 */
interface CategoryBadgeProps {
  /** 학습 카테고리 값 */
  category: Category
  /** 클릭 가능 여부 (필터 버튼으로 사용할 경우 true) */
  isClickable?: boolean
  /** 선택된 상태 여부 (클릭 가능 모드에서만 사용) */
  isSelected?: boolean
  /** 클릭 핸들러 */
  onClick?: () => void
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 카테고리 배지 컴포넌트
 * - React Native, Expo, TypeScript 등 카테고리를 색상으로 구분하여 표시
 * - isClickable prop으로 필터 버튼 모드 활성화 가능
 * - 선택/비선택 상태에 따른 스타일 변화 지원
 */
export function CategoryBadge({
  category,
  isClickable = false,
  isSelected = false,
  onClick,
  className,
}: CategoryBadgeProps) {
  // 카테고리에 맞는 색상 클래스 가져오기
  const colors = CATEGORY_COLORS[category]
  const label = CATEGORY_LABELS[category]

  // 클릭 가능한 배지는 버튼 엘리먼트로 렌더링
  if (isClickable) {
    return (
      <button
        type="button"
        onClick={onClick}
        // TODO: 외부에서 onClick 핸들러 전달 필요
        aria-pressed={isSelected}
        aria-label={`카테고리 필터: ${label}`}
        className={cn(
          // 기본 배지 스타일
          'inline-flex cursor-pointer items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all duration-150',
          // 카테고리 색상
          colors.bg,
          colors.text,
          // 선택 상태 스타일
          isSelected
            ? 'opacity-100 ring-2 ring-current ring-offset-1'
            : 'opacity-70 hover:opacity-100',
          // 호버/포커스 효과
          'hover:ring-1 hover:ring-current focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-1 focus-visible:outline-none',
          className
        )}
      >
        {label}
      </button>
    )
  }

  // 기본 배지 (클릭 불가)
  return (
    <span
      aria-label={`카테고리: ${label}`}
      className={cn(
        // 기본 배지 스타일
        'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        // 카테고리 색상
        colors.bg,
        colors.text,
        className
      )}
    >
      {label}
    </span>
  )
}
