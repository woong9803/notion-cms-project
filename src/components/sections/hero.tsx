import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          {/* 프로젝트 소개 뱃지 */}
          <Badge variant="secondary" className="mb-6">
            Notion CMS 기반 학습 대시보드
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            나의 개발 학습을
            <span className="text-primary mt-2 block">시각화하세요</span>
          </h1>

          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg">
            Notion에 기록한 React Native, Expo 등 기술 스택 학습 내용을
            타임라인과 진척도 대시보드로 한눈에 확인하세요.
          </p>

          {/* CTA 버튼 */}
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/roadmap">
              <Button size="lg" className="px-8 text-base">
                로드맵 보기
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="px-8 text-base">
                학습 현황 확인
              </Button>
            </Link>
          </div>

          {/* 기술 스택 진행률 미리보기 */}
          <div className="bg-muted/50 mt-16 rounded-xl p-6">
            <p className="text-muted-foreground mb-6 text-sm font-medium">
              학습 진행 현황 미리보기
            </p>
            <div className="space-y-4 text-left">
              {/* React Native 진행률 */}
              <div className="flex items-center gap-4">
                <span className="w-32 shrink-0 text-sm font-medium">
                  React Native
                </span>
                <Progress value={65} className="flex-1" />
                <Badge variant="secondary" className="shrink-0">
                  진행 중
                </Badge>
              </div>
              {/* Expo 진행률 */}
              <div className="flex items-center gap-4">
                <span className="w-32 shrink-0 text-sm font-medium">Expo</span>
                <Progress value={40} className="flex-1" />
                <Badge variant="secondary" className="shrink-0">
                  진행 중
                </Badge>
              </div>
              {/* TypeScript 진행률 */}
              <div className="flex items-center gap-4">
                <span className="w-32 shrink-0 text-sm font-medium">
                  TypeScript
                </span>
                <Progress value={80} className="flex-1" />
                <Badge variant="outline" className="shrink-0">
                  완료
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
