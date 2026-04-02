// 수직 타임라인 컴포넌트 - 학습 항목을 시간순으로 시각화
import { cn } from '@/lib/utils'
import { TimelineNode } from '@/components/learning/timeline-node'
import { EmptyState } from '@/components/learning/empty-state'
import { LoadingSkeleton } from '@/components/learning/loading-skeleton'
import type { LearningItem } from '@/types'

/**
 * Timeline 컴포넌트 Props
 */
interface TimelineProps {
  /** 시간순 정렬된 학습 항목 목록 */
  items: LearningItem[]
  /** 타임라인 항목 클릭 핸들러 */
  onItemClick?: (item: LearningItem) => void
  /** 로딩 중 여부 */
  isLoading?: boolean
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 수직 타임라인 컴포넌트 (Task 206)
 * - 학습 항목을 오래된 순 → 최신순으로 수직 배치
 * - 각 노드는 TimelineNode 컴포넌트로 표시
 * - 노드 간 연결선으로 시간 흐름 시각화
 * - 모바일: 단일 중앙 컬럼 / 데스크톱: 좌우 교차 배치
 * - 로딩 스켈레톤 및 빈 상태 처리
 */
export function Timeline({
  items,
  onItemClick,
  isLoading = false,
  className,
}: TimelineProps) {
  // 로딩 중 스켈레톤 개수
  const skeletonCount = 5

  if (isLoading) {
    return (
      <div
        className={cn('relative flex flex-col gap-0', className)}
        aria-busy="true"
        aria-label="타임라인 로딩 중"
      >
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <div key={idx} className="flex gap-4 py-3">
            {/* 노드 포인트 스켈레톤 */}
            <div className="flex flex-col items-center">
              <LoadingSkeleton variant="timeline" />
              {idx < skeletonCount - 1 && (
                <div className="bg-muted mt-1 w-0.5 flex-1" />
              )}
            </div>
            {/* 카드 스켈레톤 */}
            <div className="flex-1 pb-3">
              <LoadingSkeleton variant="card" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <EmptyState
        className={className}
        title="타임라인 항목이 없습니다"
        description="선택한 카테고리에 해당하는 학습 항목이 없습니다."
      />
    )
  }

  return (
    <div
      className={cn('relative', className)}
      role="list"
      aria-label="학습 타임라인"
    >
      {/* ====== 타임라인 중앙 세로선 (데스크톱) ====== */}
      <div
        className="bg-border absolute top-0 bottom-0 left-[11px] w-0.5 md:left-1/2 md:-translate-x-1/2"
        aria-hidden="true"
      />

      {/* ====== 타임라인 노드 목록 ====== */}
      <div className="flex flex-col gap-0">
        {items.map((item, idx) => {
          // 데스크톱에서 홀수/짝수 인덱스로 좌우 교차 배치
          const position = idx % 2 === 0 ? 'left' : 'right'
          const isLastItem = idx === items.length - 1

          return (
            <div
              key={item.id}
              role="listitem"
              className={cn(
                // 각 타임라인 행의 레이아웃
                'group relative',
                // 모바일: 좌측 패딩으로 세로선 공간 확보
                'pl-8 md:pl-0',
                // 노드 간 세로 간격
                !isLastItem && 'pb-6 md:pb-8'
              )}
            >
              {/* 모바일 전용 노드 포인트 (세로선 위 고정) */}
              <div
                className="absolute top-0 left-0 z-10 md:hidden"
                aria-hidden="true"
              >
                <div
                  className={cn(
                    'bg-background flex h-6 w-6 items-center justify-center rounded-full border-2',
                    item.status === 'done' &&
                      'border-green-500 bg-green-50 dark:bg-green-950',
                    item.status === 'in_progress' &&
                      'border-blue-500 bg-blue-50 dark:bg-blue-950',
                    item.status === 'todo' &&
                      'border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-900'
                  )}
                >
                  <div
                    className={cn(
                      'h-2.5 w-2.5 rounded-full',
                      item.status === 'done' && 'bg-green-500',
                      item.status === 'in_progress' && 'bg-blue-400',
                      item.status === 'todo' && 'bg-slate-300 dark:bg-slate-600'
                    )}
                  />
                </div>
              </div>

              {/* 데스크톱 타임라인 노드 */}
              <div className="hidden md:block">
                <TimelineNode
                  item={item}
                  position={position}
                  isConnected={!isLastItem}
                  onClick={
                    onItemClick
                      ? () => {
                          // TODO: 항목 클릭 시 상세 페이지 이동 로직 연결 필요
                          onItemClick(item)
                        }
                      : undefined
                  }
                />
              </div>

              {/* 모바일 학습 항목 카드 (TimelineNode 대신 단순 카드 형태) */}
              <div className="md:hidden">
                <article
                  role={onItemClick ? 'button' : 'article'}
                  tabIndex={onItemClick ? 0 : undefined}
                  onClick={
                    onItemClick
                      ? () => {
                          // TODO: 모바일 항목 클릭 시 상세 페이지 이동 로직 연결 필요
                          onItemClick(item)
                        }
                      : undefined
                  }
                  onKeyDown={() => {}}
                  // TODO: Enter/Space 키 이벤트 핸들러 연결 필요
                  aria-label={`타임라인 항목: ${item.title}`}
                  className={cn(
                    'bg-card rounded-lg border p-4 shadow-sm',
                    onItemClick && [
                      'cursor-pointer',
                      'transition-all duration-200',
                      'hover:-translate-y-0.5 hover:shadow-md',
                      'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                    ]
                  )}
                >
                  {/* 카드 헤더: 카테고리 배지 + 상태 표시 */}
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={cn(
                        'rounded-md px-2 py-0.5 text-xs font-medium',
                        item.status === 'done' &&
                          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                        item.status === 'in_progress' &&
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                        item.status === 'todo' &&
                          'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      )}
                    >
                      {item.status === 'done'
                        ? '완료'
                        : item.status === 'in_progress'
                          ? '진행 중'
                          : '시작 전'}
                    </span>
                  </div>
                  {/* 제목 */}
                  <h3 className="text-foreground mb-1 text-sm leading-snug font-semibold">
                    {item.title}
                  </h3>
                  {/* 요약 */}
                  {item.summary && (
                    <p className="text-muted-foreground line-clamp-2 text-xs">
                      {item.summary}
                    </p>
                  )}
                </article>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
