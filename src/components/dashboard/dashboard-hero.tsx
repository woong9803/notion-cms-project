// 대시보드 홈 페이지 상단 히어로/인사말 섹션 컴포넌트
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { MapPin, Sparkles } from 'lucide-react'

/**
 * DashboardHero 컴포넌트 Props
 */
interface DashboardHeroProps {
  /** 마지막 업데이트 날짜 텍스트 (예: "2026.04.02") */
  lastUpdated?: string
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 대시보드 상단 히어로 섹션 컴포넌트
 * - 페이지 제목, 부제목, 업데이트 날짜 표시
 * - 심플하고 클린한 인사말 레이아웃
 * - 모바일/데스크톱 반응형 지원
 */
export function DashboardHero({ lastUpdated, className }: DashboardHeroProps) {
  return (
    <section
      aria-label="대시보드 소개"
      className={cn(
        // 배경 그라디언트
        'from-background to-muted/30 rounded-xl border bg-gradient-to-br',
        'px-6 py-8 sm:px-8 sm:py-10',
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* ====== 텍스트 영역 ====== */}
        <div className="flex flex-col gap-3">
          {/* 상단 배지 */}
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="flex w-fit items-center gap-1.5 text-xs"
            >
              <MapPin className="h-3 w-3" aria-hidden="true" />
              학습 로드맵
            </Badge>
            <Badge
              variant="outline"
              className="flex w-fit items-center gap-1.5 text-xs"
            >
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              DevPath
            </Badge>
          </div>

          {/* 메인 타이틀 */}
          <h1 className="text-foreground text-2xl leading-tight font-bold sm:text-3xl">
            안녕하세요, DevPath입니다
          </h1>

          {/* 부제목 */}
          <p className="text-muted-foreground max-w-lg text-sm leading-relaxed sm:text-base">
            React Native, Expo, TypeScript 등 새로운 기술 스택 학습 여정을
            <br className="hidden sm:block" />
            기록하고 진행 상황을 시각화하여 공유합니다.
          </p>
        </div>

        {/* ====== 업데이트 날짜 영역 ====== */}
        {lastUpdated && (
          <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
            <span className="text-muted-foreground text-xs">
              마지막 업데이트
            </span>
            <time
              dateTime={lastUpdated}
              className="text-foreground text-sm font-medium"
            >
              {lastUpdated}
            </time>
          </div>
        )}
      </div>

      {/* ====== 구분선 + 태그 영역 ====== */}
      <div className="mt-6 flex flex-wrap items-center gap-2 border-t pt-4">
        <span className="text-muted-foreground text-xs">기술 스택:</span>
        {['React Native', 'Expo', 'Expo Router', 'TypeScript', 'Zustand'].map(
          tech => (
            <span
              key={tech}
              className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-xs font-medium"
            >
              {tech}
            </span>
          )
        )}
      </div>
    </section>
  )
}
