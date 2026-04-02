// 학습 상태를 시각적으로 표시하는 배지 컴포넌트
import { cn } from '@/lib/utils'
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/constants'
import type { Status } from '@/types'

/**
 * StatusBadge 컴포넌트 Props
 */
interface StatusBadgeProps {
  /** 학습 상태 값 */
  status: Status
  /** 배지 크기 */
  size?: 'small' | 'medium' | 'large'
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 크기별 Tailwind 클래스 매핑
 */
const sizeClasses = {
  small: 'px-1.5 py-0.5 text-xs',
  medium: 'px-2 py-0.5 text-xs',
  large: 'px-2.5 py-1 text-sm',
} as const

/**
 * 학습 상태 배지 컴포넌트
 * - 시작 전, 진행 중, 완료 상태를 색상으로 구분하여 표시
 * - small, medium, large 세 가지 크기 지원
 */
export function StatusBadge({
  status,
  size = 'medium',
  className,
}: StatusBadgeProps) {
  // 상태에 맞는 색상 클래스 가져오기
  const colors = STATUS_COLORS[status]
  const label = STATUS_LABELS[status]

  return (
    <span
      role="status"
      aria-label={`학습 상태: ${label}`}
      className={cn(
        // 기본 배지 스타일
        'inline-flex items-center justify-center rounded-md border font-medium whitespace-nowrap',
        // 크기별 클래스
        sizeClasses[size],
        // 상태별 색상 클래스
        colors.bg,
        colors.text,
        colors.border,
        className
      )}
    >
      {label}
    </span>
  )
}
