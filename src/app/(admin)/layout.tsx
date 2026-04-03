import { PropsWithChildren } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <main className="bg-muted/30 flex-1 py-8">{children}</main>
    </div>
  )
}
