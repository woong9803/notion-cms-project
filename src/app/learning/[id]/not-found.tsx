// 학습 항목 상세 페이지 404 처리
// ID에 해당하는 Notion 페이지가 없을 때 표시
import Link from 'next/link'
import { FileQuestion, ArrowLeft, LayoutList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/layout/container'

export default function LearningDetailNotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 items-center">
        <Container size="sm">
          <div className="flex flex-col items-center gap-6 py-16 text-center">
            {/* 404 아이콘 */}
            <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
              <FileQuestion
                className="text-muted-foreground h-10 w-10"
                aria-hidden="true"
              />
            </div>

            {/* 404 메시지 */}
            <div className="flex flex-col gap-2">
              <h1 className="text-foreground text-2xl font-bold">
                학습 항목을 찾을 수 없습니다
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                요청하신 학습 항목이 존재하지 않거나 삭제되었습니다.
              </p>
            </div>

            {/* 네비게이션 버튼 */}
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Button asChild className="gap-2">
                <Link href="/roadmap">
                  <LayoutList className="h-4 w-4" aria-hidden="true" />
                  로드맵 목록 보기
                </Link>
              </Button>
              <Button variant="outline" asChild className="gap-2">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  홈으로 돌아가기
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
