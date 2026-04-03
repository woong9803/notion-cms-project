import { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import AdminLoginForm from '@/components/admin/admin-login-form'

export const metadata: Metadata = {
  title: '관리자 로그인',
  description: 'DevPath 관리자 로그인',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLoginPage() {
  return (
    <div className="bg-muted/50 flex min-h-screen items-center justify-center">
      <Container size="sm">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">DevPath 관리자</h1>
            <p className="text-muted-foreground">
              관리자 권한으로 로그인하세요
            </p>
          </div>
          <AdminLoginForm />
        </div>
      </Container>
    </div>
  )
}
