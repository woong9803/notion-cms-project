// robots.txt 자동 생성
// 검색 엔진 크롤러의 접근 허용/차단 규칙을 정의합니다.
// Next.js가 /robots.txt 경로로 자동 노출합니다.

import type { MetadataRoute } from 'next'

/** 사이트 기본 URL */
const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://devpath.vercel.app')

/**
 * robots.txt 생성 함수
 *
 * 크롤링 정책:
 * - 모든 크롤러: 공개 페이지 허용, 내부 관리 경로 차단
 * - 사이트맵 위치 명시로 검색 엔진 인덱싱 효율화
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // 모든 검색 엔진 크롤러 허용
        userAgent: '*',
        allow: '/',
        disallow: [
          // 인증 관련 경로 (검색 결과에 노출 불필요)
          '/login',
          '/signup',
          // Next.js 내부 경로
          '/_next/',
          // API 라우트
          '/api/',
        ],
      },
    ],
    // 사이트맵 위치 명시 (검색 엔진 인덱싱 효율화)
    sitemap: `${BASE_URL}/sitemap.xml`,
    // 크롤링 부하 제어 (선택사항)
    host: BASE_URL,
  }
}
