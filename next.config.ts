import type { NextConfig } from 'next'
import bundleAnalyzer from '@next/bundle-analyzer'

// 번들 분석기 래퍼 (ANALYZE=true 환경 변수 설정 시 활성화)
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  // 서버 식별 헤더 제거 (보안)
  poweredByHeader: false,
  // gzip 압축 활성화
  compress: true,

  // ============================================================================
  // 이미지 최적화 설정 (Task 402)
  // ============================================================================
  images: {
    // WebP, AVIF 포맷 자동 변환
    formats: ['image/avif', 'image/webp'],
    // 이미지 캐시 TTL: 1년
    minimumCacheTTL: 31536000,
    // 허용할 외부 이미지 도메인
    remotePatterns: [
      {
        // Notion 이미지 CDN (AWS S3)
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        // Notion 파일 호스팅
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
      },
      {
        // Notion 이미지 프록시
        protocol: 'https',
        hostname: 'www.notion.so',
      },
      {
        // Notion 이미지 CDN (새 엔드포인트)
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // ============================================================================
  // 패키지 번들 최적화 (Task 404)
  // ============================================================================
  experimental: {
    // lucide-react 트리쉐이킹 최적화
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // ============================================================================
  // HTTP 보안 및 캐싱 헤더 설정 (Task 401, 404)
  // ============================================================================
  async headers() {
    return [
      // 전체 페이지 보안 헤더
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      // 정적 에셋 장기 캐시 (이미지, 폰트, CSS, JS)
      {
        source:
          '/(.*)\\.(ico|png|jpg|jpeg|gif|svg|webp|avif|woff|woff2|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Next.js 정적 청크 파일 장기 캐시
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // ISR 페이지 캐시 제어 (stale-while-revalidate 패턴)
      {
        source: '/(roadmap|learning)(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=600',
          },
        ],
      },
    ]
  },

  // ============================================================================
  // 리다이렉트 설정
  // ============================================================================
  async redirects() {
    return [
      // 트레일링 슬래시 정규화
      {
        source: '/roadmap/',
        destination: '/roadmap',
        permanent: true,
      },
    ]
  },
}

export default withBundleAnalyzer(nextConfig)
