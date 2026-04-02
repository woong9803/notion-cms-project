// 학습 항목 상세 페이지 네비게이션 컴포넌트
// 이전/다음 항목 버튼 및 목록으로 돌아가기 버튼
import Link from 'next/link'
import { ArrowLeft, ArrowRight, LayoutList } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CategoryBadge } from '@/components/learning/category-badge'
import type { LearningItem } from '@/types'

/**
 * 인접 항목 정보 (이전/다음)
 */
interface AdjacentItem {
  /** 항목 ID */
  id: string
  /** 항목 제목 */
  title: string
  /** 항목 카테고리 */
  category: LearningItem['category']
}

/**
 * LearningNavigation 컴포넌트 Props
 */
interface LearningNavigationProps {
  /** 이전 학습 항목 (없으면 undefined) */
  previousItem?: AdjacentItem
  /** 다음 학습 항목 (없으면 undefined) */
  nextItem?: AdjacentItem
  /** 목록 페이지 링크 (기본값: /roadmap) */
  listHref?: string
  /** 목록 페이지 레이블 */
  listLabel?: string
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 학습 항목 페이지 네비게이션
 * - 이전 항목 / 다음 항목 버튼 (같은 카테고리 내 순서)
 * - 목록으로 돌아가기 버튼
 * - 모바일: 세로 정렬, 데스크톱: 가로 정렬
 *
 * TODO: 이전/다음 항목 데이터 서비스 연결 필요
 * - LearningService.getAdjacentItems(currentId, category) 호출
 * - 같은 카테고리 내에서 날짜 순서 기준으로 인접 항목 조회
 */
export function LearningNavigation({
  previousItem,
  nextItem,
  listHref = '/roadmap',
  listLabel = '로드맵 목록',
  className,
}: LearningNavigationProps) {
  return (
    <nav
      aria-label="학습 항목 페이지 네비게이션"
      className={cn('flex flex-col gap-4', className)}
    >
      <Separator />

      {/* 이전 / 다음 항목 영역 */}
      <div
        className={cn(
          // 모바일: 세로 정렬
          'flex flex-col gap-3',
          // 데스크톱: 양쪽 정렬
          'sm:flex-row sm:items-stretch sm:justify-between'
        )}
      >
        {/* 이전 항목 버튼 */}
        <div className="flex flex-1">
          {previousItem ? (
            <Link
              href={`/learning/${previousItem.id}`}
              // TODO: 이전 항목 라우팅 연결 필요
              className={cn(
                'group flex flex-1 items-start gap-3 rounded-lg border p-4',
                'hover:bg-accent transition-colors duration-150',
                'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
              )}
              aria-label={`이전 항목: ${previousItem.title}`}
            >
              {/* 방향 아이콘 */}
              <ArrowLeft
                className="text-muted-foreground group-hover:text-foreground mt-0.5 h-5 w-5 shrink-0 transition-colors"
                aria-hidden="true"
              />
              {/* 항목 정보 */}
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-muted-foreground text-xs">이전 항목</span>
                <span className="text-foreground line-clamp-2 text-sm leading-snug font-medium">
                  {previousItem.title}
                </span>
                {/* 카테고리 배지 */}
                <CategoryBadge
                  category={previousItem.category}
                  className="mt-0.5"
                />
              </div>
            </Link>
          ) : (
            // 이전 항목이 없을 때 빈 공간 유지 (레이아웃 일관성)
            <div className="flex-1" aria-hidden="true" />
          )}
        </div>

        {/* 목록으로 돌아가기 버튼 (중앙) */}
        <div className="flex items-center justify-center sm:flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-1.5 text-xs"
          >
            <Link href={listHref} aria-label={`${listLabel}으로 돌아가기`}>
              {/* TODO: 목록 페이지 링크 연결 필요 */}
              <LayoutList className="h-3.5 w-3.5" aria-hidden="true" />
              {listLabel}
            </Link>
          </Button>
        </div>

        {/* 다음 항목 버튼 */}
        <div className="flex flex-1 justify-end">
          {nextItem ? (
            <Link
              href={`/learning/${nextItem.id}`}
              // TODO: 다음 항목 라우팅 연결 필요
              className={cn(
                'group flex flex-1 items-start justify-end gap-3 rounded-lg border p-4',
                'hover:bg-accent transition-colors duration-150',
                'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                'text-right'
              )}
              aria-label={`다음 항목: ${nextItem.title}`}
            >
              {/* 항목 정보 */}
              <div className="flex min-w-0 flex-col items-end gap-1">
                <span className="text-muted-foreground text-xs">다음 항목</span>
                <span className="text-foreground line-clamp-2 text-sm leading-snug font-medium">
                  {nextItem.title}
                </span>
                {/* 카테고리 배지 */}
                <CategoryBadge
                  category={nextItem.category}
                  className="mt-0.5"
                />
              </div>
              {/* 방향 아이콘 */}
              <ArrowRight
                className="text-muted-foreground group-hover:text-foreground mt-0.5 h-5 w-5 shrink-0 transition-colors"
                aria-hidden="true"
              />
            </Link>
          ) : (
            // 다음 항목이 없을 때 빈 공간 유지 (레이아웃 일관성)
            <div className="flex-1" aria-hidden="true" />
          )}
        </div>
      </div>
    </nav>
  )
}
