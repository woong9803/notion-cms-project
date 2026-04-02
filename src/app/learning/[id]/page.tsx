// 학습 항목 상세 페이지
// 경로: /learning/[id]
// Notion 블록 콘텐츠를 마크다운으로 렌더링하는 상세 뷰어 페이지

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/layout/container'
import {
  LearningDetailHeader,
  LearningDetailContent,
  LearningMetaSidebar,
  LearningRelatedItems,
  LearningNavigation,
  LoadingSkeleton,
} from '@/components/learning'
import { Separator } from '@/components/ui/separator'
import {
  extractToc,
  calculateReadingTime,
  extractPlainText,
} from '@/lib/markdown'
import {
  getLearningItemById,
  getAdjacentItems,
  getRelatedItems,
  getAllLearningItems,
} from '@/services/learning-service'
import { getPageBlocks } from '@/services/notion-service'
import { blocksToMarkdown } from '@/lib/notion-to-markdown'

// ============================================================================
// ISR 캐싱 설정 (5분마다 재검증)
// ============================================================================

/** Notion 데이터 변경 주기에 맞춘 5분 재검증 */
export const revalidate = 300

// 빌드 시간에 API 호출을 하지 않도록 설정 (ISR 사용)
// 첫 요청 시 동적으로 생성 후 캐싱
export const dynamicParams = true

// ============================================================================
// 정적 경로 생성 (SSG + ISR) - 빌드 시간에는 API 호출 안함
// ============================================================================

/**
 * 빌드 시 정적 경로를 생성하지 않습니다 (dynamicParams = true)
 * 대신 첫 요청 시 동적으로 페이지를 생성하고 ISR로 캐싱합니다.
 * Vercel 환경에서 API 키가 설정되면 온디맨드 재검증이 작동합니다.
 */
export async function generateStaticParams(): Promise<{ id: string }[]> {
  // 빌드 시간에는 API를 호출하지 않음
  // dynamicParams = true이므로 이 함수는 빈 배열만 반환합니다.
  return []
}

// ============================================================================
// 동적 메타데이터 생성
// ============================================================================

/**
 * 각 학습 항목별 SEO 메타데이터를 동적으로 생성합니다.
 * - 제목: "[항목 제목] | DevPath"
 * - 설명: summary 필드 우선, 없으면 content 앞부분 160자
 * - OpenGraph: 아티클 타입, 발행일/수정일 포함
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params

  try {
    const item = await getLearningItemById(id)
    const description = item.summary || extractPlainText(item.content, 160)

    return {
      title: `${item.title} | DevPath`,
      description,
      keywords: item.tags.join(', '),
      openGraph: {
        title: item.title,
        description,
        type: 'article',
        tags: item.tags,
        publishedTime: item.createdAt.toISOString(),
        modifiedTime: item.updatedAt.toISOString(),
      },
      twitter: {
        card: 'summary',
        title: item.title,
        description,
      },
    }
  } catch {
    // 항목을 찾을 수 없는 경우 기본 메타데이터 반환
    return {
      title: '학습 항목 | DevPath',
      description: 'DevPath 학습 항목 상세 페이지',
    }
  }
}

// ============================================================================
// 페이지 Props 타입
// ============================================================================

interface LearningDetailPageProps {
  params: Promise<{ id: string }>
}

// ============================================================================
// 페이지 컴포넌트
// ============================================================================

/**
 * 학습 항목 상세 페이지 (서버 컴포넌트)
 *
 * 레이아웃 구조:
 * - 모바일: 단일 컬럼 (헤더 → 콘텐츠 → 사이드바 → 관련항목 → 네비게이션)
 * - 데스크톱: 좌측 콘텐츠(flex-1) + 우측 사이드바(w-72 sticky)
 *
 * 데이터 흐름:
 * 1. getLearningItemById(id): 메타 정보 조회
 * 2. getPageBlocks(id): Notion 블록 콘텐츠 조회
 * 3. blocksToMarkdown(): 블록 → 마크다운 변환
 * 4. getAdjacentItems() + getRelatedItems(): 네비게이션/추천 병렬 조회
 */
export default async function LearningDetailPage({
  params,
}: LearningDetailPageProps) {
  const { id } = await params

  // 학습 항목 메타 정보 조회 (없으면 404)
  let item
  try {
    item = await getLearningItemById(id)
  } catch {
    notFound()
  }

  // Notion 블록 콘텐츠 조회 및 마크다운 변환
  // blocks children API를 통해 실제 페이지 본문을 가져옵니다.
  // 오류 시 기존 rich_text 기반 content 필드로 폴백합니다.
  let markdownContent = item.content
  try {
    const blocks = await getPageBlocks(id)
    if (blocks.length > 0) {
      const converted = blocksToMarkdown(blocks)
      if (converted.trim().length > 0) {
        markdownContent = converted
      }
    }
  } catch {
    // 블록 조회 실패 → rich_text content로 폴백 (이미 item.content에 있음)
  }

  // 마크다운 기반 목차 추출 및 읽기 시간 계산
  const tocItems = extractToc(markdownContent)
  const readingTime = calculateReadingTime(markdownContent)

  // 이전/다음 항목 및 관련 항목 병렬 조회 (지연 최소화)
  const [adjacentItems, relatedItems] = await Promise.all([
    getAdjacentItems(id, item.category).catch(() => ({
      previous: null,
      next: null,
    })),
    getRelatedItems(id, item.category, 3).catch(() => []),
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <Container size="lg">
          <div className="py-6 sm:py-8 lg:py-10">
            {/* 상단 메타정보 헤더: 제목, 카테고리, 상태, 날짜, 읽기 시간 */}
            <LearningDetailHeader
              item={item}
              readingTime={readingTime}
              className="mb-8"
            />

            {/* 메인 콘텐츠 + 우측 사이드바 레이아웃 */}
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
              {/* 좌측: 마크다운 콘텐츠 영역 */}
              <div className="min-w-0 flex-1">
                {/* Task 302/303: react-markdown + highlight.js 기반 렌더링 */}
                <Suspense
                  fallback={<LoadingSkeleton variant="text" count={5} />}
                >
                  <LearningDetailContent content={markdownContent} />
                </Suspense>

                {/* 모바일: 사이드바를 콘텐츠 하단에 배치 */}
                <div className="mt-8 lg:hidden">
                  <LearningMetaSidebar
                    tocItems={tocItems}
                    tags={item.tags}
                    readingTime={readingTime}
                  />
                </div>
              </div>

              {/* 우측 사이드바: 목차, 태그, 읽기 시간 (데스크톱 전용, sticky) */}
              <aside className="hidden lg:sticky lg:top-8 lg:block lg:w-72 lg:shrink-0 lg:self-start">
                <LearningMetaSidebar
                  tocItems={tocItems}
                  tags={item.tags}
                  readingTime={readingTime}
                />
              </aside>
            </div>

            {/* 하단 섹션: 관련 항목 추천 + 이전/다음 네비게이션 */}
            <div className="mt-12 flex flex-col gap-10">
              <Separator />

              {/* Task 304: 같은 카테고리 관련 항목 추천 (최대 3개) */}
              {relatedItems.length > 0 && (
                <LearningRelatedItems
                  items={relatedItems}
                  title="같은 카테고리 학습 항목"
                />
              )}

              {/* Task 304: 이전/다음 항목 네비게이션 */}
              <LearningNavigation
                previousItem={
                  adjacentItems.previous
                    ? {
                        id: adjacentItems.previous.id,
                        title: adjacentItems.previous.title,
                        category: adjacentItems.previous.category,
                      }
                    : undefined
                }
                nextItem={
                  adjacentItems.next
                    ? {
                        id: adjacentItems.next.id,
                        title: adjacentItems.next.title,
                        category: adjacentItems.next.category,
                      }
                    : undefined
                }
                listHref="/roadmap"
                listLabel="로드맵 목록"
              />
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
