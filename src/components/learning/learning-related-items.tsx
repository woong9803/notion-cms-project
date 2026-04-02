// 관련 학습 항목 추천 섹션 컴포넌트
// 같은 카테고리의 다른 항목을 카드 그리드 형태로 표시
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LearningItemCard } from '@/components/learning/learning-item-card'
import type { LearningItem } from '@/types'

/**
 * LearningRelatedItems 컴포넌트 Props
 */
interface LearningRelatedItemsProps {
  /** 관련 학습 항목 목록 (최대 5개 권장) */
  items: LearningItem[]
  /** 섹션 제목 */
  title?: string
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 관련 학습 항목 추천 섹션
 * - 같은 카테고리의 다른 학습 항목 3~5개를 카드 그리드로 표시
 * - 각 카드 클릭 시 해당 항목 상세 페이지로 이동
 * - 관련 항목이 없을 때는 섹션 자체를 숨김
 *
 * TODO: 클릭 시 상세 페이지 라우팅 연결 필요
 */
export function LearningRelatedItems({
  items,
  title = '관련 학습 항목',
  className,
}: LearningRelatedItemsProps) {
  // 관련 항목이 없을 때 렌더링 생략
  if (items.length === 0) {
    return null
  }

  return (
    <section
      aria-labelledby="related-items-heading"
      className={cn('flex flex-col gap-4', className)}
    >
      {/* 섹션 헤더 */}
      <div className="flex items-center gap-2">
        <Sparkles
          className="text-muted-foreground h-4 w-4 shrink-0"
          aria-hidden="true"
        />
        <h2
          id="related-items-heading"
          className="text-foreground text-base font-semibold sm:text-lg"
        >
          {title}
        </h2>
        {/* 관련 항목 개수 배지 */}
        <span
          className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium"
          aria-label={`총 ${items.length}개`}
        >
          {items.length}
        </span>
      </div>

      {/* 관련 항목 카드 그리드 */}
      <div
        className={cn(
          // 모바일: 1컬럼
          'grid grid-cols-1 gap-4',
          // 태블릿: 2컬럼
          'sm:grid-cols-2',
          // 데스크톱: 3컬럼 (최대 5개이므로 3컬럼이 적절)
          'lg:grid-cols-3'
        )}
        role="list"
        aria-label="관련 학습 항목 목록"
      >
        {items.map(item => (
          <div key={item.id} role="listitem">
            <Link
              href={`/learning/${item.id}`}
              // TODO: 실제 라우팅 연결 필요 (/learning/[id])
              className={cn(
                'block rounded-lg',
                'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
              )}
              aria-label={`${item.title} 상세 보기`}
            >
              <LearningItemCard
                item={item}
                variant="default"
                className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              />
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
