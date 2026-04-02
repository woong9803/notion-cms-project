// 학습 항목 상세 페이지 로딩 상태
// Suspense 기반 스트리밍 - 데이터 로드 중 스켈레톤 표시
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/layout/container'
import { Skeleton } from '@/components/ui/skeleton'
import { LoadingSkeleton } from '@/components/learning'

export default function LearningDetailLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <Container size="lg">
          <div className="py-6 sm:py-8 lg:py-10">
            {/* 헤더 스켈레톤 */}
            <div className="mb-8 flex flex-col gap-4">
              {/* 뒤로가기 버튼 */}
              <Skeleton className="h-8 w-36 rounded-md" />
              {/* 배지 영역 */}
              <div className="flex gap-2">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              {/* 제목 */}
              <Skeleton className="h-9 w-3/4 rounded-md" />
              <Skeleton className="h-6 w-1/2 rounded-md" />
              {/* 메타 정보 */}
              <div className="flex gap-4">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
              {/* 요약 */}
              <Skeleton className="h-4 w-full max-w-2xl rounded" />
              <Skeleton className="h-4 w-4/5 max-w-xl rounded" />
              {/* 구분선 */}
              <Skeleton className="h-px w-full" />
            </div>

            {/* 콘텐츠 + 사이드바 레이아웃 */}
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
              {/* 콘텐츠 스켈레톤 */}
              <div className="min-w-0 flex-1">
                <LoadingSkeleton variant="text" count={8} />
              </div>

              {/* 사이드바 스켈레톤 (데스크톱 전용) */}
              <div className="hidden lg:block lg:w-72 lg:shrink-0">
                <div className="rounded-lg border p-4">
                  <Skeleton className="mb-3 h-5 w-20" />
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
