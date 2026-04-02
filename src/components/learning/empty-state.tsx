// 데이터가 없을 때 표시하는 빈 상태 컴포넌트
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Inbox } from 'lucide-react'

/**
 * EmptyState 컴포넌트 Props
 */
interface EmptyStateProps {
  /** 빈 상태 제목 */
  title: string
  /** 빈 상태 설명 텍스트 */
  description?: string
  /** 커스텀 아이콘 (미제공 시 기본 Inbox 아이콘 사용) */
  icon?: React.ReactNode
  /** 액션 버튼 설정 */
  action?: {
    /** 버튼 레이블 */
    label: string
    /** 버튼 클릭 핸들러 */
    onClick: () => void
  }
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 빈 상태 컴포넌트
 * - 데이터가 없거나 검색 결과가 없을 때 중앙에 표시
 * - 커스텀 아이콘, 제목, 설명, 액션 버튼 지원
 * - 일관된 레이아웃과 스타일 제공
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-label={title}
      className={cn(
        // 중앙 정렬 컨테이너
        'flex flex-col items-center justify-center',
        'bg-muted/30 rounded-lg border border-dashed',
        'px-6 py-12 text-center',
        // 반응형 패딩
        'sm:py-16 md:py-20',
        className
      )}
    >
      {/* 아이콘 영역 */}
      <div
        className="bg-muted text-muted-foreground mb-4 flex h-16 w-16 items-center justify-center rounded-full"
        aria-hidden="true"
      >
        {icon ?? <Inbox className="h-8 w-8" />}
      </div>

      {/* 제목 */}
      <h3 className="text-foreground mb-2 text-base font-semibold">{title}</h3>

      {/* 설명 텍스트 */}
      {description && (
        <p className="text-muted-foreground mb-6 max-w-sm text-sm">
          {description}
        </p>
      )}

      {/* 액션 버튼 */}
      {action && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {}}
          // TODO: action.onClick 핸들러 연결 필요
          aria-label={action.label}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
