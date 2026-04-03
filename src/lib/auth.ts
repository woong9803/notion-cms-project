import { cookies } from 'next/headers'
import { ValidationError } from '@/lib/errors'

// ============================================================================
// 인메모리 세션 저장소
// ============================================================================

/**
 * 유효한 관리자 세션 토큰을 저장하는 Set
 * 서버 재시작 시 초기화됩니다.
 */
const activeSessions = new Set<string>()

// ============================================================================
// 세션 생성/검증 함수
// ============================================================================

/**
 * 관리자 패스워드를 검증합니다.
 */
export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    throw new ValidationError('ADMIN_PASSWORD 환경 변수가 설정되지 않았습니다.')
  }
  return password === adminPassword
}

/**
 * 새 관리자 세션을 생성하고 httpOnly 쿠키에 저장합니다.
 */
export async function createAdminSession(): Promise<string> {
  const sessionToken = crypto.randomUUID()
  activeSessions.add(sessionToken)

  const cookieStore = await cookies()
  cookieStore.set('admin-session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24시간
    path: '/',
  })

  return sessionToken
}

/**
 * 쿠키에서 관리자 세션 토큰을 조회합니다.
 */
export async function getAdminSession(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-session')?.value
  return token ?? null
}

/**
 * 세션 토큰이 유효한지 검증합니다.
 */
export function isValidAdminSession(token: string | null): boolean {
  if (!token) return false
  return activeSessions.has(token)
}

/**
 * 관리자 세션을 삭제합니다.
 */
export async function clearAdminSession(): Promise<void> {
  const token = await getAdminSession()
  if (token) {
    activeSessions.delete(token)
  }

  const cookieStore = await cookies()
  cookieStore.delete('admin-session')
}
