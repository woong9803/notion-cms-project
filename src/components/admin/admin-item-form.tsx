'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LearningItem, Status, Category, LearningItemInput } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { STATUS_LABELS, CATEGORY_LABELS } from '@/lib/constants'
import { createItemAction, updateItemAction } from '@/app/(admin)/admin/actions'
import { useToast } from '@/hooks/use-toast'

const statuses: Status[] = ['todo', 'in_progress', 'done']
const categories: Category[] = [
  'react_native',
  'expo',
  'expo_router',
  'typescript',
  'zustand',
  'other',
]

interface AdminItemFormProps {
  item?: LearningItem
}

export default function AdminItemForm({ item }: AdminItemFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isEditMode = !!item
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState<LearningItemInput>({
    title: item?.title ?? '',
    category: item?.category ?? 'react_native',
    status: item?.status ?? 'todo',
    startDate: item?.startDate
      ? item.startDate.toISOString().split('T')[0]
      : '',
    endDate: item?.endDate ? item.endDate.toISOString().split('T')[0] : '',
    summary: item?.summary ?? '',
    content: item?.content ?? '',
    tags: item?.tags ?? [],
  })

  const [tagInput, setTagInput] = useState('')

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = isEditMode
        ? await updateItemAction(item!.id, formData)
        : await createItemAction(formData)

      if (result.success) {
        toast({
          title: isEditMode ? '수정 완료' : '생성 완료',
          description: isEditMode
            ? '학습 항목이 수정되었습니다.'
            : '새 학습 항목이 생성되었습니다.',
        })
        router.push('/admin')
        router.refresh()
      } else {
        toast({
          title: isEditMode ? '수정 실패' : '생성 실패',
          description: result.error,
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: '오류 발생',
        description: isEditMode
          ? '항목 수정 중 오류가 발생했습니다.'
          : '항목 생성 중 오류가 발생했습니다.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e =>
                setFormData(prev => ({ ...prev, title: e.target.value }))
              }
              disabled={isLoading}
              placeholder="학습 항목 제목"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="category">카테고리 *</Label>
              <Select
                value={formData.category}
                onValueChange={value =>
                  setFormData(prev => ({
                    ...prev,
                    category: value as Category,
                  }))
                }
              >
                <SelectTrigger id="category" disabled={isLoading}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">상태 *</Label>
              <Select
                value={formData.status}
                onValueChange={value =>
                  setFormData(prev => ({ ...prev, status: value as Status }))
                }
              >
                <SelectTrigger id="status" disabled={isLoading}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(st => (
                    <SelectItem key={st} value={st}>
                      {STATUS_LABELS[st]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="startDate">시작 날짜</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={e =>
                  setFormData(prev => ({ ...prev, startDate: e.target.value }))
                }
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="endDate">종료 날짜</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={e =>
                  setFormData(prev => ({ ...prev, endDate: e.target.value }))
                }
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 내용 */}
      <Card>
        <CardHeader>
          <CardTitle>내용</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="summary">요약 *</Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={e =>
                setFormData(prev => ({ ...prev, summary: e.target.value }))
              }
              disabled={isLoading}
              placeholder="짧은 요약"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="content">상세 내용 *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={e =>
                setFormData(prev => ({ ...prev, content: e.target.value }))
              }
              disabled={isLoading}
              placeholder="마크다운 형식의 상세 내용"
              rows={10}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* 태그 */}
      <Card>
        <CardHeader>
          <CardTitle>태그</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyPress={e =>
                e.key === 'Enter' && (e.preventDefault(), handleAddTag())
              }
              disabled={isLoading}
              placeholder="태그를 입력하고 Enter를 누르세요"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddTag}
              disabled={isLoading || !tagInput.trim()}
            >
              추가
            </Button>
          </div>

          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <div
                  key={tag}
                  className="bg-secondary flex items-center gap-2 rounded-full px-3 py-1 text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    disabled={isLoading}
                    className="hover:text-destructive"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 버튼 */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          취소
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? isEditMode
              ? '수정 중...'
              : '생성 중...'
            : isEditMode
              ? '수정 완료'
              : '생성 완료'}
        </Button>
      </div>
    </form>
  )
}
