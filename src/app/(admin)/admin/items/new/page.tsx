import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Container } from '@/components/layout/container'
import { getAdminSession, isValidAdminSession } from '@/lib/auth'
import AdminItemForm from '@/components/admin/admin-item-form'

export const metadata: Metadata = {
  title: '새 항목 추가',
  description: '새 학습 항목 생성',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminNewItemPage() {
  // 세션 검증
  const sessionToken = await getAdminSession()
  if (!sessionToken || !isValidAdminSession(sessionToken)) {
    redirect('/admin/login')
  }

  return (
    <Container size="md">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">새 학습 항목</h1>
          <p className="text-muted-foreground">새로운 학습 항목을 추가합니다</p>
        </div>

        <AdminItemForm />
      </div>
    </Container>
  )
}
