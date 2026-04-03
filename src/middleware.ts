import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ============================================================================
// 관리자 라우트 보호 미들웨어
// ============================================================================

/**
 * /admin/* 경로에 대한 접근을 제어합니다.
 * - /admin/login 은 항상 접근 가능
 * - 다른 /admin/* 경로는 admin-session 쿠키 필수
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 로그인 페이지는 항상 접근 가능
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // 관리자 경로 확인
  if (pathname.startsWith('/admin/')) {
    const sessionToken = request.cookies.get('admin-session')?.value

    if (!sessionToken) {
      // 세션이 없으면 로그인 페이지로 리다이렉트
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // 주의: 미들웨어에서는 서버의 activeSessions Set에 접근할 수 없으므로,
    // 쿠키 존재 여부로만 검증합니다.
    // 실제 유효성 검증은 Server Components에서 수행됩니다.
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
