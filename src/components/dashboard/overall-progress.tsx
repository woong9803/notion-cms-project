// 전체 학습 진행률을 시각화하는 섹션 컴포넌트
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, BookOpen, CheckCircle2, Clock } from 'lucide-react'
import type { ProgressInfo } from '@/types'

/**
 * OverallProgress 컴포넌트 Props
 */
interface OverallProgressProps {
  /** 전체 진행률 정보 */
  progress: ProgressInfo
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 통계 아이템 Props
 */
interface StatItemProps {
  label: string
  value: number
  icon: React.ReactNode
  colorClass: string
}

/**
 * 개별 통계 아이템 컴포넌트
 * - 아이콘, 숫자값, 레이블을 수직 정렬로 표시
 */
function StatItem({ label, value, icon, colorClass }: StatItemProps) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* 아이콘 영역 */}
      <div className={cn('rounded-full p-2', colorClass)} aria-hidden="true">
        {icon}
      </div>
      {/* 숫자값 */}
      <span className="text-foreground text-2xl font-bold">{value}</span>
      {/* 레이블 */}
      <span className="text-muted-foreground text-xs">{label}</span>
    </div>
  )
}

/**
 * 전체 학습 진행률 섹션 컴포넌트
 * - 원형 퍼센트 표시 + 프로그레스 바 시각화
 * - 완료 / 진행 중 / 시작 전 통계 요약 카드
 * - 반응형 레이아웃: 모바일은 세로, 데스크톱은 가로
 */
export function OverallProgress({ progress, className }: OverallProgressProps) {
  const { total, completed, inProgress, todo, percentage } = progress

  return (
    <section aria-labelledby="overall-progress-title" className={cn(className)}>
      <h2
        id="overall-progress-title"
        className="text-foreground mb-4 text-xl font-semibold"
      >
        전체 진행률
      </h2>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* ====== 퍼센트 원형 표시 영역 ====== */}
            <div className="flex items-center gap-6">
              {/* 원형 퍼센트 시각화 */}
              <div
                className="relative flex h-24 w-24 shrink-0 items-center justify-center"
                role="img"
                aria-label={`전체 완료율 ${percentage}%`}
              >
                {/* SVG 원형 차트 */}
                <svg
                  className="absolute inset-0 -rotate-90"
                  width="96"
                  height="96"
                  viewBox="0 0 96 96"
                  aria-hidden="true"
                >
                  {/* 배경 원 */}
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    strokeWidth="8"
                    className="stroke-muted"
                  />
                  {/* 진행률 원 (circumference = 2 * PI * 40 ≈ 251.2) */}
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - percentage / 100)}
                    className="stroke-primary transition-all duration-700 ease-in-out"
                  />
                </svg>
                {/* 중앙 퍼센트 텍스트 */}
                <div className="relative flex flex-col items-center">
                  <span className="text-foreground text-xl leading-none font-bold">
                    {percentage}%
                  </span>
                  <span className="text-muted-foreground text-[10px]">
                    완료
                  </span>
                </div>
              </div>

              {/* 제목 및 설명 */}
              <div className="flex flex-col gap-1">
                <CardTitle className="text-lg">학습 현황</CardTitle>
                <p className="text-muted-foreground text-sm">
                  전체{' '}
                  <strong className="text-foreground font-semibold">
                    {total}개
                  </strong>{' '}
                  항목 중{' '}
                  <strong className="font-semibold text-green-600 dark:text-green-400">
                    {completed}개
                  </strong>{' '}
                  완료
                </p>
                {/* 선형 프로그레스 바 */}
                <div className="mt-1 w-48">
                  <Progress
                    value={percentage}
                    className="h-2"
                    aria-label={`전체 완료율 ${percentage}%`}
                  />
                </div>
              </div>
            </div>

            {/* ====== 통계 카드 영역 ====== */}
            <div
              className="flex items-center justify-around gap-4 rounded-lg border p-4 sm:justify-end sm:gap-8"
              role="list"
              aria-label="학습 상태 요약"
            >
              <div role="listitem">
                <StatItem
                  label="완료"
                  value={completed}
                  icon={
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  }
                  colorClass="bg-green-100 dark:bg-green-900/30"
                />
              </div>
              <div role="listitem">
                <StatItem
                  label="진행 중"
                  value={inProgress}
                  icon={
                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  }
                  colorClass="bg-blue-100 dark:bg-blue-900/30"
                />
              </div>
              <div role="listitem">
                <StatItem
                  label="시작 전"
                  value={todo}
                  icon={
                    <BookOpen className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  }
                  colorClass="bg-slate-100 dark:bg-slate-800"
                />
              </div>
              <div role="listitem">
                <StatItem
                  label="전체"
                  value={total}
                  icon={
                    <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  }
                  colorClass="bg-purple-100 dark:bg-purple-900/30"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        {/* 하단 프로그레스 바 (전체 상태 시각화) */}
        <CardContent className="pt-0">
          <div
            className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`전체 진행률 ${percentage}%`}
          >
            {/* 완료 구간 */}
            <div
              className="flex h-full transition-all duration-700 ease-in-out"
              aria-hidden="true"
            >
              <div
                className="bg-green-500 dark:bg-green-600"
                style={{
                  width: `${total > 0 ? (completed / total) * 100 : 0}%`,
                }}
              />
              <div
                className="bg-blue-400 dark:bg-blue-500"
                style={{
                  width: `${total > 0 ? (inProgress / total) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
          {/* 범례 */}
          <div
            className="mt-2 flex items-center gap-4 text-xs"
            aria-hidden="true"
          >
            <span className="text-muted-foreground flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
              완료 {total > 0 ? Math.round((completed / total) * 100) : 0}%
            </span>
            <span className="text-muted-foreground flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-400" />
              진행 중 {total > 0 ? Math.round((inProgress / total) * 100) : 0}%
            </span>
            <span className="text-muted-foreground flex items-center gap-1.5">
              <span className="bg-muted inline-block h-2.5 w-2.5 rounded-full" />
              시작 전 {total > 0 ? Math.round((todo / total) * 100) : 0}%
            </span>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
