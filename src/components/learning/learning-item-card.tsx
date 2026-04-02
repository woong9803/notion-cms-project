// 학습 항목 요약 정보를 카드 형태로 표시하는 컴포넌트
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { StatusBadge } from '@/components/learning/status-badge'
import { CategoryBadge } from '@/components/learning/category-badge'
import { CalendarDays } from 'lucide-react'
import type { LearningItem } from '@/types'

/**
 * LearningItemCard 컴포넌트 Props
 */
interface LearningItemCardProps {
  /** 학습 항목 데이터 */
  item: LearningItem
  /** 카드 클릭 핸들러 */
  onClick?: () => void
  /** 카드 크기 변형 */
  variant?: 'default' | 'compact'
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 날짜를 한국어 형식으로 포맷
 * - Date 객체를 'YYYY.MM.DD' 형식의 문자열로 변환
 */
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

/**
 * 학습 항목 카드 컴포넌트
 * - 제목, 카테고리, 상태 배지, 요약 텍스트, 날짜 정보 표시
 * - default: 전체 정보 표시 / compact: 간략 표시
 * - 호버 효과 및 클릭 가능 상태 지원
 */
export function LearningItemCard({
  item,
  onClick,
  variant = 'default',
  className,
}: LearningItemCardProps) {
  const isCompact = variant === 'compact'

  return (
    <Card
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`학습 항목: ${item.title}`}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      className={cn(
        // 기본 스타일
        'transition-all duration-200',
        // 클릭 가능 상태 스타일
        onClick && [
          'cursor-pointer',
          'hover:border-border/80 hover:-translate-y-0.5 hover:shadow-md',
          'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        ],
        className
      )}
    >
      <CardHeader className={cn('pb-2', isCompact && 'pb-1')}>
        {/* 상단 영역: 카테고리 배지 + 상태 배지 */}
        <div className="flex items-center justify-between gap-2">
          <CategoryBadge category={item.category} />
          <StatusBadge status={item.status} size="small" />
        </div>

        {/* 학습 항목 제목 */}
        <h3
          className={cn(
            'text-foreground mt-1.5 leading-snug font-semibold',
            isCompact ? 'line-clamp-1 text-sm' : 'line-clamp-2 text-base'
          )}
        >
          {item.title}
        </h3>
      </CardHeader>

      {/* compact 모드에서는 CardContent 생략 가능 */}
      {!isCompact && (
        <CardContent className="space-y-2 pt-0">
          {/* 요약 텍스트 (최대 2줄) */}
          {item.summary && (
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {item.summary}
            </p>
          )}

          {/* 날짜 정보 */}
          <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {item.startDate ? (
              <span>
                {formatDate(item.startDate)}
                {item.endDate && ` ~ ${formatDate(item.endDate)}`}
              </span>
            ) : (
              <span>{formatDate(item.createdAt)}</span>
            )}
          </div>

          {/* 태그 목록 */}
          {item.tags.length > 0 && (
            <div
              className="flex flex-wrap items-center gap-1"
              aria-label="태그 목록"
            >
              {item.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="bg-muted text-muted-foreground rounded-sm px-1.5 py-0.5 text-xs"
                >
                  #{tag}
                </span>
              ))}
              {/* 태그가 3개 초과 시 나머지 개수 표시 */}
              {item.tags.length > 3 && (
                <span className="text-muted-foreground text-xs">
                  +{item.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </CardContent>
      )}

      {/* compact 모드에서는 날짜만 간략히 표시 */}
      {isCompact && item.startDate && (
        <CardContent className="pt-0 pb-3">
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <CalendarDays className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span>{formatDate(item.startDate)}</span>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
