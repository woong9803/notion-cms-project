import { z } from 'zod'

// ============================================================================
// 환경 변수 스키마 정의
// ============================================================================

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  // Vercel 자동 주입 URL (배포 시 자동 설정)
  VERCEL_URL: z.string().optional(),
  // 명시적 앱 URL (로컬 또는 프로덕션 커스텀 도메인)
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  // Notion API 환경 변수 (런타임 필수, 빌드 시 선택)
  NOTION_API_KEY: z
    .string()
    .min(1, 'NOTION_API_KEY가 비어있습니다.')
    .describe('Notion API 인증 키')
    .optional(),
  NOTION_DATABASE_ID: z
    .string()
    .min(1, 'NOTION_DATABASE_ID가 비어있습니다.')
    .describe('Notion 학습 데이터베이스 ID')
    .optional(),
})

// ============================================================================
// 환경 변수 파싱 및 내보내기
// ============================================================================

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NOTION_API_KEY: process.env.NOTION_API_KEY,
  NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
})

export type Env = z.infer<typeof envSchema>

// ============================================================================
// 앱 URL 헬퍼
// ============================================================================

/**
 * 현재 환경의 앱 기본 URL을 반환합니다.
 * 우선순위: NEXT_PUBLIC_APP_URL → VERCEL_URL → 로컬 기본값
 */
export function getAppUrl(): string {
  if (env.NEXT_PUBLIC_APP_URL) return env.NEXT_PUBLIC_APP_URL
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`
  return 'http://localhost:3000'
}

/**
 * 프로덕션 환경 여부를 반환합니다.
 */
export function isProduction(): boolean {
  return env.NODE_ENV === 'production'
}
