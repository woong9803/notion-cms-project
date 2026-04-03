import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Container } from '@/components/layout/container'
import { getAdminSession, isValidAdminSession } from '@/lib/auth'
import { getLearningItemById } from '@/services/learning-service'
import AdminItemForm from '@/components/admin/admin-item-form'
import { NotFoundError } from '@/lib/errors'

export const metadata: Metadata = {
  title: '항목 수정',
  description: '학습 항목 수정',
  robots: {
    index: false,
    follow: false,
  },
}

interface AdminEditItemPageProps {
  params: {
    id: string
  }
}

export default async function AdminEditItemPage({
  params,
}: AdminEditItemPageProps) {
  // 세션 검증
  const sessionToken = await getAdminSession()
  if (!sessionToken || !isValidAdminSession(sessionToken)) {
    redirect('/admin/login')
  }

  // 항목 조회
  let item
  try {
    item = await getLearningItemById(params.id)
  } catch (error) {
    if (error instanceof NotFoundError) {
      redirect('/admin')
    }
    throw error
  }

  return (
    <Container size="md">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">항목 수정</h1>
          <p className="text-muted-foreground">{item.title}</p>
        </div>

        <AdminItemForm item={item} />
      </div>
    </Container>
  )
}
