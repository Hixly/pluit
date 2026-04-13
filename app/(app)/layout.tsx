import { Navbar } from '@/components/layout/navbar'
import { StorageSidebar } from '@/components/layout/storage-sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 gap-6 p-6 max-w-7xl mx-auto w-full">
        <main className="flex-1 min-w-0">{children}</main>
        <aside className="w-64 shrink-0">
          <StorageSidebar />
        </aside>
      </div>
    </div>
  )
}
