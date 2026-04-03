'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Status, Category } from '@/types'
import { STATUS_LABELS, CATEGORY_LABELS } from '@/lib/constants'

const statuses: Status[] = ['todo', 'in_progress', 'done']
const categories: Category[] = [
  'react_native',
  'expo',
  'expo_router',
  'typescript',
  'zustand',
  'other',
]

export default function AdminItemsSearch() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Input placeholder="제목 검색..." />
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="상태 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모두</SelectItem>
            {statuses.map(status => (
              <SelectItem key={status} value={status}>
                {STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="카테고리 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모두</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {CATEGORY_LABELS[category]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
