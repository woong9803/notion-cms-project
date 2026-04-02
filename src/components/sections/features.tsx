import { Container } from '@/components/layout/container'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Map, BarChart2, BookOpen, Filter } from 'lucide-react'

// DevPath 핵심 기능 목록 (PRD 2. 핵심 기능 기반)
const features = [
  {
    icon: Map,
    title: '학습 타임라인 시각화',
    description:
      'Notion 데이터베이스에서 학습 주제 데이터를 동기화하여 기술 스택별 로드맵을 타임라인으로 표시합니다.',
  },
  {
    icon: BarChart2,
    title: '진척도 트래킹 대시보드',
    description:
      'Notion Status 필드를 기반으로 진척도를 계산하고 기술 스택별 달성률을 프로그레스 바로 시각화합니다.',
  },
  {
    icon: BookOpen,
    title: '마크다운 데브로그 뷰어',
    description:
      'Notion에 작성된 Rich Text 콘텐츠를 마크다운으로 렌더링하여 코드 블록과 학습 노트를 깔끔하게 제공합니다.',
  },
  {
    icon: Filter,
    title: '상태별 필터링',
    description:
      'To Do, In Progress, Done 상태와 카테고리(React Native, TypeScript 등)를 조합하여 학습 항목을 맞춤 조회합니다.',
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-muted/50 py-20">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold">핵심 기능</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Notion CMS와 연동하여 학습 기록을 체계적으로 관리하고 진척도를
            한눈에 파악하세요.
          </p>
        </div>

        {/* 기능 카드 그리드 - 반응형 레이아웃 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map(feature => (
            <Card
              key={feature.title}
              className="bg-background border-0 shadow-none"
            >
              <CardHeader>
                <feature.icon className="text-primary mb-2 h-10 w-10" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}
