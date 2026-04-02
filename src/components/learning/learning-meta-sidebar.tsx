'use client'

// 학습 상세 페이지 사이드바 컴포넌트
// 목차(TOC), 태그 목록, 읽기 시간 표시
import { BookOpen, Hash, List } from 'lucide-react'
import { useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { TocItem } from '@/lib/markdown'

/**
 * LearningMetaSidebar 컴포넌트 Props
 */
interface LearningMetaSidebarProps {
  /** 목차 항목 목록 */
  tocItems?: TocItem[]
  /** 태그 목록 */
  tags?: string[]
  /** 읽기 예상 시간 (분 단위) */
  readingTime?: number
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 헤딩 레벨별 들여쓰기 클래스
 */
const tocLevelClasses: Record<1 | 2 | 3, string> = {
  1: 'pl-0 font-medium',
  2: 'pl-4',
  3: 'pl-8 text-xs',
}

/**
 * 학습 상세 페이지 메타 사이드바
 * - 목차(Table of Contents): 마크다운 헤딩 기반 항목 표시
 * - 태그 목록: 관련 태그를 배지 형태로 표시
 * - 읽기 시간: 예상 읽기 소요 시간 표시
 *
 * 데스크톱에서는 우측 사이드바로 배치
 * 모바일에서는 콘텐츠 하단에 배치
 */
export function LearningMetaSidebar({
  tocItems = [],
  tags = [],
  readingTime,
  className,
}: LearningMetaSidebarProps) {
  // Task 305: 목차 클릭 시 해당 섹션으로 부드럽게 스크롤
  const handleTocClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault()
      const targetElement = document.getElementById(id)
      if (targetElement) {
        // 스티키 헤더 높이를 고려한 오프셋 적용 (80px)
        const offsetTop =
          targetElement.getBoundingClientRect().top + window.scrollY - 80

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        })

        // URL 해시 업데이트 (브라우저 히스토리)
        window.history.pushState(null, '', `#${id}`)
      }
    },
    []
  )

  return (
    <aside
      aria-label="페이지 메타 정보"
      className={cn('flex flex-col gap-6', className)}
    >
      {/* ====== 목차 (Table of Contents) ====== */}
      <div
        className="bg-card rounded-lg border p-4"
        aria-labelledby="toc-heading"
      >
        {/* 목차 헤더 */}
        <div className="mb-3 flex items-center gap-2">
          <List
            className="text-muted-foreground h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          <h2
            id="toc-heading"
            className="text-foreground text-sm font-semibold"
          >
            목차
          </h2>
        </div>

        {/* 목차 항목 목록 */}
        {tocItems.length > 0 ? (
          <nav aria-label="문서 목차">
            <ul className="space-y-1.5" role="list">
              {tocItems.map(item => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={e => handleTocClick(e, item.id)}
                    className={cn(
                      // 기본 링크 스타일
                      'text-muted-foreground hover:text-foreground block rounded text-sm transition-colors duration-150',
                      'focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none',
                      // 레벨별 들여쓰기
                      tocLevelClasses[item.level]
                    )}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : (
          // 목차 항목이 없을 때 안내 메시지
          <div className="text-muted-foreground py-2 text-center text-xs">
            목차가 없습니다
          </div>
        )}
      </div>

      {/* ====== 태그 목록 ====== */}
      {tags.length > 0 && (
        <div
          className="bg-card rounded-lg border p-4"
          aria-labelledby="tags-heading"
        >
          {/* 태그 헤더 */}
          <div className="mb-3 flex items-center gap-2">
            <Hash
              className="text-muted-foreground h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            <h2
              id="tags-heading"
              className="text-foreground text-sm font-semibold"
            >
              태그
            </h2>
          </div>

          {/* 태그 배지 목록 */}
          <div
            className="flex flex-wrap gap-1.5"
            role="list"
            aria-label="관련 태그"
          >
            {tags.map(tag => (
              <Badge
                key={tag}
                variant="secondary"
                role="listitem"
                className="cursor-default text-xs"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* ====== 읽기 시간 ====== */}
      {readingTime && readingTime > 0 && (
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <BookOpen
              className="text-muted-foreground h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            <div>
              <p className="text-muted-foreground text-xs">예상 읽기 시간</p>
              <p className="text-foreground text-sm font-semibold">
                약 {readingTime}분
              </p>
            </div>
          </div>
        </div>
      )}

      <Separator className="md:hidden" />
    </aside>
  )
}
