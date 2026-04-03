import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import type { LearningItem } from '@/types'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { getAdminSession, isValidAdminSession } from '@/lib/auth'
import AdminItemsTable from '@/components/admin/admin-items-table'
import AdminItemsSearch from '@/components/admin/admin-items-search'
import { getAllLearningItems } from '@/services/learning-service'

export const metadata: Metadata = {
  title: '학습 항목 관리',
  description: 'DevPath 학습 항목 관리 대시보드',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminDashboardPage() {
  // 세션 검증
  const sessionToken = await getAdminSession()
  if (!sessionToken || !isValidAdminSession(sessionToken)) {
    redirect('/admin/login')
  }

  // 학습 항목 조회
  let items: LearningItem[] = []
  let error: string | null = null

  try {
    items = await getAllLearningItems()
  } catch (err) {
    console.error('[AdminDashboard] Failed to load items:', err)
    error = err instanceof Error ? err.message : 'Failed to load learning items'
  }

  return (
    <Container>
      <div className="space-y-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">학습 항목 관리</h1>
            <p className="text-muted-foreground">
              총 {items.length}개의 학습 항목
            </p>
          </div>
          <Button asChild>
            <a href="/admin/items/new">새 항목 추가</a>
          </Button>
        </div>

        {/* 에러 표시 */}
        {error && (
          <div className="border-destructive bg-destructive/10 rounded-lg border p-4">
            <p className="text-destructive text-sm font-medium">
              오류: {error}
            </p>
            <p className="text-muted-foreground mt-2 text-xs">
              Notion Integration이 데이터베이스에 공유되었는지 확인하세요.
            </p>
          </div>
        )}

        {/* 검색 및 필터 */}
        {!error && <AdminItemsSearch />}

        {/* 항목 테이블 */}
        <AdminItemsTable items={items} />
      </div>
    </Container>
  )
}
