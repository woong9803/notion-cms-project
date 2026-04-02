'use client'

// 로드맵 카테고리 탭 전환 컴포넌트 (클라이언트 컴포넌트)
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CATEGORY_LABELS, CATEGORIES } from '@/lib/constants'
import type { Category } from '@/types'

/**
 * RoadmapCategoryTabs 컴포넌트 Props
 */
interface RoadmapCategoryTabsProps {
  /** 현재 선택된 카테고리 탭 값 ('all' | Category) */
  activeCategory: 'all' | Category
  /** 각 카테고리별 항목 수 (탭 배지 표시용) */
  categoryCounts?: Partial<Record<'all' | Category, number>>
  /** 탭 변경 핸들러 */
  onCategoryChange: (category: 'all' | Category) => void
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 전체 탭 포함 카테고리 목록
 */
const allTabCategories: Array<{ value: 'all' | Category; label: string }> = [
  { value: 'all', label: '전체' },
  ...CATEGORIES.map(cat => ({
    value: cat as Category,
    label: CATEGORY_LABELS[cat],
  })),
]

/**
 * 로드맵 카테고리 탭 컴포넌트 (Task 205, 207)
 * - 전체 / 카테고리별 탭 전환
 * - 각 탭에 항목 수 배지 표시
 * - 모바일: 가로 스크롤 / 데스크톱: 전체 표시
 * - 탭 변경 시 onCategoryChange 핸들러 호출
 */
export function RoadmapCategoryTabs({
  activeCategory,
  categoryCounts = {},
  onCategoryChange,
  className,
}: RoadmapCategoryTabsProps) {
  return (
    <div
      className={cn(className)}
      role="navigation"
      aria-label="카테고리 탭 네비게이션"
    >
      <Tabs
        value={activeCategory}
        onValueChange={value => {
          // TODO: 카테고리 탭 변경 시 URL params 업데이트 또는 상태 관리 연결 필요
          onCategoryChange(value as 'all' | Category)
        }}
      >
        {/* 탭 목록 - 모바일에서 가로 스크롤 */}
        <TabsList
          className={cn(
            // 기본 레이아웃
            'flex h-auto flex-wrap gap-1 p-1',
            // 모바일: 가로 스크롤
            'overflow-x-auto',
            // 스크롤바 숨기기
            'scrollbar-none'
          )}
          aria-label="카테고리 선택"
        >
          {allTabCategories.map(({ value, label }) => {
            const count = categoryCounts[value]

            return (
              <TabsTrigger
                key={value}
                value={value}
                className={cn(
                  // 기본 스타일
                  'flex shrink-0 items-center gap-1.5 text-sm',
                  // 선택 상태 스타일 (shadcn 기본 + 오버라이드)
                  'data-[state=active]:shadow-sm'
                )}
                aria-label={`${label} 카테고리${count !== undefined ? ` (${count}개)` : ''}`}
              >
                {/* 탭 레이블 */}
                <span>{label}</span>

                {/* 항목 수 배지 */}
                {count !== undefined && (
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-[10px] leading-none font-bold',
                      // 선택된 탭: 강조 색상 / 미선택: 뮤트 색상
                      activeCategory === value
                        ? 'bg-primary/15 text-primary'
                        : 'bg-muted text-muted-foreground'
                    )}
                    aria-hidden="true"
                  >
                    {count}
                  </span>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>
    </div>
  )
}
