// 카테고리별 학습 진행률을 카드 형태로 표시하는 컴포넌트
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/constants'
import type { Category } from '@/types'

/**
 * ProgressCard 컴포넌트 Props
 */
interface ProgressCardProps {
  /** 카테고리 */
  category: Category
  /** 전체 학습 항목 수 */
  total: number
  /** 완료한 학습 항목 수 */
  completed: number
  /** 진행 중인 학습 항목 수 */
  inProgress: number
  /** 카드 클릭 가능 여부 */
  isClickable?: boolean
  /** 클릭 핸들러 */
  onClick?: () => void
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 카테고리별 진행률 카드 컴포넌트
 * - 카테고리명, 프로그레스 바, 진행률 텍스트 표시
 * - isClickable prop으로 클릭 가능 카드 모드 활성화
 * - 반응형 레이아웃 지원
 */
export function ProgressCard({
  category,
  total,
  completed,
  inProgress,
  isClickable = false,
  onClick,
  className,
}: ProgressCardProps) {
  // 완료 비율 계산 (전체가 0이면 0%로 처리)
  const completionPercentage =
    total > 0 ? Math.round((completed / total) * 100) : 0

  // 카테고리 레이블 및 색상
  const categoryLabel = CATEGORY_LABELS[category]
  const categoryColors = CATEGORY_COLORS[category]

  // 진행 중 및 시작 전 항목 수
  const todoCount = total - completed - inProgress

  return (
    <Card
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={
        isClickable
          ? `${categoryLabel} 카테고리 - 진행률 ${completionPercentage}%, 상세 보기`
          : `${categoryLabel} 카테고리 진행률: ${completionPercentage}%`
      }
      onClick={isClickable ? onClick : undefined}
      // TODO: 외부에서 onClick 핸들러 전달 필요
      onKeyDown={isClickable ? () => {} : undefined}
      // TODO: Enter/Space 키 이벤트 핸들러 연결 필요
      className={cn(
        // 기본 카드 스타일
        'transition-all duration-200',
        // 클릭 가능 상태 스타일
        isClickable && [
          'cursor-pointer',
          'hover:-translate-y-0.5 hover:shadow-md',
          'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        ],
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          {/* 카테고리 레이블 */}
          <CardTitle className="text-base font-semibold">
            {categoryLabel}
          </CardTitle>
          {/* 완료 비율 */}
          <span
            className={cn(
              'rounded-md px-2 py-0.5 text-xs font-bold',
              categoryColors.bg,
              categoryColors.text
            )}
            aria-hidden="true"
          >
            {completionPercentage}%
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* 프로그레스 바 */}
        <Progress
          value={completionPercentage}
          aria-label={`${categoryLabel} 완료율 ${completionPercentage}%`}
          className="h-2"
        />

        {/* 항목 수 요약 */}
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span>전체 {total}개</span>
          <div className="flex items-center gap-3">
            {/* 완료 */}
            <span className="flex items-center gap-1">
              <span
                className="inline-block h-2 w-2 rounded-full bg-green-500"
                aria-hidden="true"
              />
              완료 {completed}
            </span>
            {/* 진행 중 */}
            <span className="flex items-center gap-1">
              <span
                className="inline-block h-2 w-2 rounded-full bg-blue-500"
                aria-hidden="true"
              />
              진행 중 {inProgress}
            </span>
            {/* 시작 전 */}
            <span className="flex items-center gap-1">
              <span
                className="inline-block h-2 w-2 rounded-full bg-slate-400"
                aria-hidden="true"
              />
              시작 전 {todoCount}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
