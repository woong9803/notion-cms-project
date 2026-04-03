'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LearningItem } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  STATUS_LABELS,
  CATEGORY_LABELS,
  STATUS_BADGE_VARIANTS,
} from '@/lib/constants'
import { deleteItemAction } from '@/app/(admin)/admin/actions'
import { useToast } from '@/hooks/use-toast'

interface AdminItemsTableProps {
  items: LearningItem[]
}

export default function AdminItemsTable({ items }: AdminItemsTableProps) {
  const { toast } = useToast()
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteTargetId) return

    setIsDeleting(true)
    try {
      const result = await deleteItemAction(deleteTargetId)
      if (result.success) {
        toast({
          title: '삭제 완료',
          description: '학습 항목이 삭제되었습니다.',
        })
      } else {
        toast({
          title: '삭제 실패',
          description: result.error || '학습 항목 삭제 중 오류가 발생했습니다.',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: '오류 발생',
        description: '삭제 중 오류가 발생했습니다.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
      setDeleteTargetId(null)
    }
  }

  return (
    <>
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>날짜</TableHead>
              <TableHead className="w-24 text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-muted-foreground py-8 text-center"
                >
                  학습 항목이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              items.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-xs truncate font-medium">
                    {item.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {CATEGORY_LABELS[item.category]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_BADGE_VARIANTS[item.status]}>
                      {STATUS_LABELS[item.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {item.startDate?.toLocaleDateString('ko-KR')}
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/items/${item.id}/edit`}>수정</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTargetId(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      삭제
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 삭제 확인 Dialog */}
      <AlertDialog
        open={!!deleteTargetId}
        onOpenChange={open => !open && setDeleteTargetId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>항목 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 학습 항목을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수
              없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-4">
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
