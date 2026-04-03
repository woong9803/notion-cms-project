'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginAdmin } from '@/app/(admin)/admin/actions'
import { useToast } from '@/hooks/use-toast'

export default function AdminLoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await loginAdmin(password)

      if (result.success) {
        toast({
          title: '로그인 성공',
          description: '관리자 대시보드로 이동합니다.',
        })
        router.push('/admin')
        router.refresh()
      } else {
        toast({
          title: '로그인 실패',
          description: result.error || '패스워드를 다시 확인하세요.',
          variant: 'destructive',
        })
        setPassword('')
      }
    } catch {
      toast({
        title: '오류 발생',
        description: '로그인 중 오류가 발생했습니다.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>로그인</CardTitle>
        <CardDescription>관리자 패스워드를 입력하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">패스워드</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="패스워드를 입력하세요"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm"
                disabled={isLoading}
              >
                {showPassword ? '숨기기' : '표시'}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
