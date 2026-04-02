// 로드맵 타임라인 상태별 범례 컴포넌트
import { cn } from '@/lib/utils'
import { CheckCircle2, Circle, Clock } from 'lucide-react'

/**
 * RoadmapLegend 컴포넌트 Props
 */
interface RoadmapLegendProps {
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 범례 아이템 데이터 타입
 */
interface LegendItem {
  icon: React.ReactNode
  label: string
  colorClass: string
  dotClass: string
}

/**
 * 상태별 범례 아이템 목록
 */
const legendItems: LegendItem[] = [
  {
    icon: <CheckCircle2 className="h-4 w-4" aria-hidden="true" />,
    label: '완료',
    colorClass: 'text-green-600 dark:text-green-400',
    dotClass: 'bg-green-500',
  },
  {
    icon: <Clock className="h-4 w-4" aria-hidden="true" />,
    label: '진행 중',
    colorClass: 'text-blue-600 dark:text-blue-400',
    dotClass: 'bg-blue-400',
  },
  {
    icon: <Circle className="h-4 w-4" aria-hidden="true" />,
    label: '시작 전',
    colorClass: 'text-slate-500 dark:text-slate-400',
    dotClass: 'bg-slate-300 dark:bg-slate-600',
  },
]

/**
 * 타임라인 상태별 색상 범례 컴포넌트
 * - 완료 / 진행 중 / 시작 전 상태의 아이콘 + 색상 안내
 * - 가로 배치로 컴팩트하게 표시
 */
export function RoadmapLegend({ className }: RoadmapLegendProps) {
  return (
    <div
      role="list"
      aria-label="타임라인 상태 범례"
      className={cn(
        'bg-card flex flex-wrap items-center gap-4 rounded-lg border px-4 py-3',
        className
      )}
    >
      <span className="text-muted-foreground shrink-0 text-xs font-medium">
        범례:
      </span>
      {legendItems.map(item => (
        <div
          key={item.label}
          role="listitem"
          className={cn('flex items-center gap-1.5', item.colorClass)}
        >
          {item.icon}
          <span className="text-xs font-medium">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
