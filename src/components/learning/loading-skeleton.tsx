// 데이터 로딩 중 플레이스홀더를 표시하는 스켈레톤 컴포넌트
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * LoadingSkeleton 컴포넌트 Props
 */
interface LoadingSkeletonProps {
  /** 스켈레톤 유형 */
  variant: 'card' | 'timeline' | 'text' | 'progress'
  /** 반복 렌더링 개수 */
  count?: number
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 카드 스켈레톤 - LearningItemCard 로딩 상태
 */
function CardSkeleton() {
  return (
    <div className="bg-card space-y-3 rounded-lg border p-4" aria-hidden="true">
      {/* 카테고리 + 상태 배지 영역 */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-20 rounded-md" />
        <Skeleton className="h-5 w-14 rounded-md" />
      </div>
      {/* 제목 영역 */}
      <Skeleton className="h-5 w-3/4 rounded-md" />
      <Skeleton className="h-4 w-1/2 rounded-md" />
      {/* 요약 텍스트 영역 */}
      <div className="space-y-1.5">
        <Skeleton className="h-3.5 w-full rounded" />
        <Skeleton className="h-3.5 w-4/5 rounded" />
      </div>
      {/* 날짜 영역 */}
      <Skeleton className="h-3.5 w-28 rounded" />
    </div>
  )
}

/**
 * 타임라인 스켈레톤 - TimelineNode 로딩 상태
 */
function TimelineSkeleton() {
  return (
    <div className="flex items-start gap-4" aria-hidden="true">
      {/* 노드 포인트 */}
      <div className="flex shrink-0 flex-col items-center">
        <Skeleton className="h-6 w-6 rounded-full" />
        {/* 연결선 */}
        <div className="bg-muted mt-1 h-16 w-0.5" />
      </div>
      {/* 컨텐츠 카드 */}
      <div className="bg-card flex-1 space-y-2 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-5 w-14 rounded-md" />
        </div>
        <Skeleton className="h-4 w-3/4 rounded" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-2/3 rounded" />
        </div>
        <Skeleton className="h-3 w-24 rounded" />
      </div>
    </div>
  )
}

/**
 * 텍스트 스켈레톤 - 일반 텍스트 로딩 상태
 */
function TextSkeleton() {
  return (
    <div className="space-y-2" aria-hidden="true">
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-5/6 rounded" />
      <Skeleton className="h-4 w-4/5 rounded" />
    </div>
  )
}

/**
 * 프로그레스 스켈레톤 - ProgressCard 로딩 상태
 */
function ProgressSkeleton() {
  return (
    <div className="bg-card space-y-3 rounded-lg border p-4" aria-hidden="true">
      {/* 헤더 영역: 제목 + 퍼센트 */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-28 rounded-md" />
        <Skeleton className="h-5 w-12 rounded-md" />
      </div>
      {/* 프로그레스 바 */}
      <Skeleton className="h-2 w-full rounded-full" />
      {/* 항목 수 요약 */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-16 rounded" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-3.5 w-14 rounded" />
          <Skeleton className="h-3.5 w-16 rounded" />
          <Skeleton className="h-3.5 w-14 rounded" />
        </div>
      </div>
    </div>
  )
}

/**
 * 로딩 스켈레톤 컴포넌트
 * - card: 학습 항목 카드 로딩 플레이스홀더
 * - timeline: 타임라인 노드 로딩 플레이스홀더
 * - text: 일반 텍스트 로딩 플레이스홀더
 * - progress: 진행률 카드 로딩 플레이스홀더
 * - animate-pulse 애니메이션 포함 (Skeleton 컴포넌트 내장)
 */
export function LoadingSkeleton({
  variant,
  count = 1,
  className,
}: LoadingSkeletonProps) {
  // 유형별 스켈레톤 컴포넌트 매핑
  const skeletonMap = {
    card: CardSkeleton,
    timeline: TimelineSkeleton,
    text: TextSkeleton,
    progress: ProgressSkeleton,
  } as const

  const SkeletonComponent = skeletonMap[variant]

  return (
    <div
      role="status"
      aria-label="데이터 로딩 중"
      aria-busy="true"
      className={cn(
        // 기본 레이아웃
        'w-full',
        // 카드/프로그레스는 그리드, 나머지는 단일 컬럼
        (variant === 'card' || variant === 'progress') && count > 1
          ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
          : 'space-y-4',
        className
      )}
    >
      {/* count만큼 스켈레톤 반복 렌더링 */}
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonComponent key={index} />
      ))}
      {/* 스크린 리더용 로딩 텍스트 */}
      <span className="sr-only">데이터를 불러오는 중입니다...</span>
    </div>
  )
}
