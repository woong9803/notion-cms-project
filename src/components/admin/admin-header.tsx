'use client'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'
import { logoutAdmin } from '@/app/(admin)/admin/actions'
import { useToast } from '@/hooks/use-toast'

export function AdminHeader() {
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await logoutAdmin()
    } catch {
      toast({
        title: '오류 발생',
        description: '로그아웃 중 오류가 발생했습니다.',
        variant: 'destructive',
      })
    }
  }

  return (
    <header
      className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur"
      suppressHydrationWarning
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold">DevPath Admin</h1>
            <nav className="hidden gap-6 md:flex">
              <a
                href="/admin"
                className="hover:text-primary text-sm font-medium transition-colors"
              >
                학습 관리
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              로그아웃
            </Button>
          </div>
        </div>
      </Container>
    </header>
  )
}
