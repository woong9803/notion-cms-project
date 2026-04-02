// 학습 항목 상세 페이지 헤더 컴포넌트
// 제목, 카테고리 배지, 상태 배지, 날짜, 읽기 시간 표시
import { CalendarDays, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/learning/status-badge'
import { CategoryBadge } from '@/components/learning/category-badge'
import type { LearningItem } from '@/types'

/**
 * LearningDetailHeader 컴포넌트 Props
 */
interface LearningDetailHeaderProps {
  /** 학습 항목 데이터 */
  item: LearningItem
  /** 읽기 예상 시간 (분 단위) */
  readingTime?: number
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 날짜를 한국어 형식으로 포맷
 * - Date 객체를 'YYYY년 MM월 DD일' 형식으로 변환
 */
function formatDateKo(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}년 ${month}월 ${day}일`
}

/**
 * 학습 항목 상세 페이지 헤더
 * - 뒤로가기 버튼 (목록으로)
 * - 카테고리 배지 + 상태 배지
 * - 제목 (h1)
 * - 날짜 정보 (생성일 / 수정일)
 * - 읽기 시간 (선택사항)
 */
export function LearningDetailHeader({
  item,
  readingTime,
  className,
}: LearningDetailHeaderProps) {
  // 날짜 변경 여부 판단 (생성일과 수정일이 다른 경우 수정일 표시)
  const isUpdated = item.updatedAt.getTime() !== item.createdAt.getTime()

  return (
    <header className={cn('flex flex-col gap-4', className)}>
      {/* 뒤로가기 버튼 */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-muted-foreground hover:text-foreground -ml-2 gap-1.5"
        >
          <Link href="/roadmap" aria-label="로드맵 목록으로 돌아가기">
            {/* TODO: 이전 페이지(로드맵) 링크 연결 필요 */}
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            로드맵으로 돌아가기
          </Link>
        </Button>
      </div>

      {/* 배지 영역: 카테고리 + 상태 */}
      <div className="flex flex-wrap items-center gap-2">
        <CategoryBadge category={item.category} />
        <StatusBadge status={item.status} size="medium" />
      </div>

      {/* 제목 (h1) */}
      <h1 className="text-foreground text-2xl leading-tight font-bold sm:text-3xl lg:text-4xl">
        {item.title}
      </h1>

      {/* 메타 정보 영역: 날짜, 읽기 시간 */}
      <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
        {/* 날짜 정보 */}
        <div className="flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {isUpdated ? (
              <>
                <span className="sr-only">마지막 수정일:</span>
                {formatDateKo(item.updatedAt)} 수정
              </>
            ) : (
              <>
                <span className="sr-only">작성일:</span>
                {formatDateKo(item.createdAt)}
              </>
            )}
          </span>
        </div>

        {/* 읽기 시간 (선택사항) */}
        {readingTime && readingTime > 0 && (
          <>
            {/* 구분자 */}
            <span aria-hidden="true" className="text-border">
              •
            </span>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                <span className="sr-only">예상 읽기 시간:</span>약 {readingTime}
                분
              </span>
            </div>
          </>
        )}

        {/* 학습 기간 (startDate가 있는 경우) */}
        {item.startDate && (
          <>
            <span aria-hidden="true" className="text-border">
              •
            </span>
            <div className="flex items-center gap-1.5">
              <span>
                {item.startDate && formatDateKo(item.startDate)}
                {item.endDate && ` ~ ${formatDateKo(item.endDate)}`}
              </span>
            </div>
          </>
        )}
      </div>

      {/* 요약 설명 */}
      {item.summary && (
        <p className="text-muted-foreground max-w-3xl text-base leading-relaxed">
          {item.summary}
        </p>
      )}

      {/* 구분선 */}
      <Separator className="mt-2" />
    </header>
  )
}
