'use client'

// 학습 항목 상세 페이지 에러 바운더리
// 데이터 로드 실패, Notion API 오류 등 처리
import Link from 'next/link'
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/layout/container'

interface LearningDetailErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function LearningDetailError({
  error,
  reset,
}: LearningDetailErrorProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 items-center">
        <Container size="sm">
          <div className="flex flex-col items-center gap-6 py-16 text-center">
            {/* 에러 아이콘 */}
            <div className="bg-destructive/10 flex h-16 w-16 items-center justify-center rounded-full">
              <AlertCircle
                className="text-destructive h-8 w-8"
                aria-hidden="true"
              />
            </div>

            {/* 에러 메시지 */}
            <div className="flex flex-col gap-2">
              <h1 className="text-foreground text-xl font-bold">
                콘텐츠를 불러올 수 없습니다
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                학습 항목 데이터를 가져오는 중 오류가 발생했습니다.
                <br />
                잠시 후 다시 시도해주세요.
              </p>
              {/* 개발 환경에서 에러 상세 표시 */}
              {process.env.NODE_ENV === 'development' && (
                <p className="bg-muted mt-2 rounded p-2 text-left font-mono text-xs">
                  {error.message}
                </p>
              )}
            </div>

            {/* 액션 버튼 */}
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Button onClick={reset} className="gap-2">
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                다시 시도
              </Button>
              <Button variant="outline" asChild className="gap-2">
                <Link href="/roadmap">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  로드맵으로 돌아가기
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
