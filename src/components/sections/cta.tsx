import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

export function CTASection() {
  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold">
            학습을 체계적으로 관리하세요
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Notion에 기록한 학습 내용이 자동으로 대시보드에 반영됩니다. 상태와
            카테고리로 필터링하여 진척도를 한눈에 확인하세요.
          </p>

          {/* 탭 UI 데모 - Tabs 컴포넌트 활용 */}
          <Tabs defaultValue="todo" className="mb-10">
            <TabsList className="mx-auto mb-6">
              <TabsTrigger value="todo">
                시작 전
                <Badge variant="secondary" className="ml-2">
                  5
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="inprogress">
                진행 중
                <Badge variant="secondary" className="ml-2">
                  3
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="done">
                완료
                <Badge variant="secondary" className="ml-2">
                  12
                </Badge>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="todo">
              <p className="text-muted-foreground text-sm">
                아직 시작하지 않은 학습 주제들이 표시됩니다.
              </p>
            </TabsContent>
            <TabsContent value="inprogress">
              <p className="text-muted-foreground text-sm">
                현재 진행 중인 학습 주제들이 표시됩니다.
              </p>
            </TabsContent>
            <TabsContent value="done">
              <p className="text-muted-foreground text-sm">
                완료된 학습 주제들이 표시됩니다.
              </p>
            </TabsContent>
          </Tabs>

          {/* 대시보드 이동 버튼 */}
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/">
              <Button size="lg" className="px-8 text-base">
                대시보드 보기
              </Button>
            </Link>
            <Link href="/roadmap">
              <Button size="lg" variant="outline" className="px-8 text-base">
                로드맵 탐색
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
