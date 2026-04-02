// 로드맵 타임라인에서 개별 학습 항목을 노드로 표시하는 컴포넌트
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/learning/status-badge'
import { CategoryBadge } from '@/components/learning/category-badge'
import { CalendarDays, CheckCircle2, Circle, Clock } from 'lucide-react'
import type { LearningItem } from '@/types'

/**
 * TimelineNode 컴포넌트 Props
 */
interface TimelineNodeProps {
  /** 학습 항목 데이터 */
  item: LearningItem
  /** 타임라인에서의 배치 위치 */
  position: 'left' | 'right' | 'center'
  /** 다음 노드와의 연결선 표시 여부 */
  isConnected?: boolean
  /** 노드 클릭 핸들러 */
  onClick?: () => void
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 상태별 노드 아이콘 매핑
 */
const statusIcons = {
  done: CheckCircle2,
  in_progress: Clock,
  todo: Circle,
} as const

/**
 * 날짜를 한국어 형식으로 포맷
 */
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

/**
 * 로드맵 타임라인 노드 컴포넌트
 * - 학습 항목을 타임라인의 좌/우/중앙 위치에 표시
 * - 상태별로 노드 아이콘과 색상 구분
 * - isConnected prop으로 다음 노드와의 연결선 표시
 * - 반응형: 모바일에서는 중앙 정렬로 변환
 */
export function TimelineNode({
  item,
  position,
  isConnected = false,
  onClick,
  className,
}: TimelineNodeProps) {
  const StatusIcon = statusIcons[item.status]

  // 상태별 노드 포인트 색상 클래스
  const nodeColorClass = {
    done: 'text-green-600 dark:text-green-400',
    in_progress: 'text-blue-600 dark:text-blue-400',
    todo: 'text-slate-400 dark:text-slate-500',
  }[item.status]

  // 연결선 색상 클래스
  const lineColorClass = {
    done: 'bg-green-200 dark:bg-green-800',
    in_progress: 'bg-blue-200 dark:bg-blue-800',
    todo: 'bg-slate-200 dark:bg-slate-700',
  }[item.status]

  return (
    <div
      className={cn(
        // 기본 레이아웃: 타임라인 행
        'relative flex items-start',
        // 위치별 레이아웃 조정
        position === 'left' && 'flex-row-reverse md:flex-row',
        position === 'right' && 'flex-row',
        position === 'center' && 'flex-col items-center',
        className
      )}
      aria-label={`타임라인 항목: ${item.title}`}
    >
      {/* ====== 중앙 노드 포인트 영역 ====== */}
      <div
        className={cn(
          'relative z-10 flex shrink-0 items-center justify-center',
          position === 'center' ? 'mb-2' : 'mx-4'
        )}
      >
        {/* 노드 아이콘 */}
        <StatusIcon
          className={cn('h-6 w-6', nodeColorClass)}
          aria-hidden="true"
        />

        {/* 다음 노드와 연결하는 세로선 */}
        {isConnected && (
          <div
            className={cn(
              'absolute top-6 left-1/2 w-0.5 -translate-x-1/2',
              'h-full min-h-[2rem]',
              lineColorClass
            )}
            aria-hidden="true"
          />
        )}
      </div>

      {/* ====== 컨텐츠 카드 영역 ====== */}
      <article
        role={onClick ? 'button' : 'article'}
        tabIndex={onClick ? 0 : undefined}
        onClick={() => {}}
        // TODO: onClick 핸들러 연결 필요
        onKeyDown={() => {}}
        // TODO: Enter/Space 키 이벤트 핸들러 연결 필요
        className={cn(
          // 기본 카드 스타일
          'bg-card rounded-lg border p-4 shadow-sm',
          // 반응형 너비
          position === 'center' ? 'w-full max-w-md' : 'flex-1',
          // 클릭 가능 상태 스타일
          onClick && [
            'cursor-pointer',
            'transition-all duration-200',
            'hover:-translate-y-0.5 hover:shadow-md',
            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          ]
        )}
      >
        {/* 카드 상단: 카테고리 + 상태 */}
        <div className="mb-2 flex items-center justify-between gap-2">
          <CategoryBadge category={item.category} />
          <StatusBadge status={item.status} size="small" />
        </div>

        {/* 학습 항목 제목 */}
        <h3 className="text-foreground mb-1 line-clamp-2 text-sm leading-snug font-semibold">
          {item.title}
        </h3>

        {/* 요약 텍스트 */}
        {item.summary && (
          <p className="text-muted-foreground mb-2 line-clamp-2 text-xs">
            {item.summary}
          </p>
        )}

        {/* 날짜 정보 */}
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <CalendarDays className="h-3 w-3 shrink-0" aria-hidden="true" />
          {item.startDate ? (
            <span>
              {formatDate(item.startDate)}
              {item.endDate &&
                item.status === 'done' &&
                ` ~ ${formatDate(item.endDate)}`}
            </span>
          ) : (
            <span>{formatDate(item.createdAt)}</span>
          )}
        </div>
      </article>
    </div>
  )
}
