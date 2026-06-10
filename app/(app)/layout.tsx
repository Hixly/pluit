import { Navbar } from '@/components/layout/navbar'
import { StorageSidebar } from '@/components/layout/storage-sidebar'
import { WaterPoolCanvas } from '@/components/rain/water-pool-canvas'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col md:flex-row gap-4 md:gap-6 p-3 md:p-6 max-w-7xl mx-auto w-full">
        <main className="flex-1 min-w-0">{children}</main>
        {/* Sidebar hidden on mobile — stats bar covers the same info */}
        <aside className="hidden md:block w-64 shrink-0">
          <StorageSidebar />
        </aside>
      </div>
      <WaterPoolCanvas />
    </div>
  )
}
