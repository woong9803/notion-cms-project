// XML 사이트맵 자동 생성
// 검색 엔진이 사이트 구조를 파악할 수 있도록 모든 공개 URL을 나열합니다.
// Next.js가 /sitemap.xml 경로로 자동 노출합니다.

import type { MetadataRoute } from 'next'

// Notion API 연동 시 사용할 서비스 (빌드 시 Notion API 장애 대비 try/catch)
// import { getAllLearningItems } from '@/services/learning-service'

/** 사이트 기본 URL - 환경 변수 우선, 없으면 Vercel 배포 URL, 없으면 로컬 기본값 */
const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://devpath.vercel.app')

/**
 * XML 사이트맵 생성 함수
 *
 * 포함 경로:
 * - 홈 페이지 (/)
 * - 로드맵 페이지 (/roadmap)
 * - 개별 학습 항목 (/learning/[id])
 *
 * changeFrequency 전략:
 * - 홈/로드맵: weekly (데이터가 자주 변경됨)
 * - 학습 항목: monthly (상세 내용은 비교적 안정적)
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 정적 경로: 항상 포함되는 핵심 페이지
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/roadmap`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // 동적 경로: 학습 항목 상세 페이지
  // Notion API 연동 시 실제 항목 목록으로 교체 필요
  let dynamicRoutes: MetadataRoute.Sitemap = []

  try {
    // TODO: 실제 Notion API 데이터로 교체 필요
    // const items = await getAllLearningItems()
    // dynamicRoutes = items.map(item => ({
    //   url: `${BASE_URL}/learning/${item.id}`,
    //   lastModified: item.updatedAt,
    //   changeFrequency: 'monthly' as const,
    //   priority: 0.7,
    // }))

    // 현재는 빈 배열 (Notion API 연동 후 위 코드로 교체)
    dynamicRoutes = []
  } catch {
    // 빌드 시 Notion API 오류가 있어도 sitemap 생성 실패 방지
    // 정적 경로만 포함된 사이트맵 반환
    dynamicRoutes = []
  }

  return [...staticRoutes, ...dynamicRoutes]
}
