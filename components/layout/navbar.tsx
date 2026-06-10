'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PixelButton } from '@/components/ui/pixel-button'
import { PixelCloudLogo } from '@/components/ui/pixel-cloud-logo'
import { cn } from '@/lib/utils'

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="border-b-2 border-pluit-blue bg-pluit-panel px-3 md:px-6 py-2 md:py-3 flex items-center justify-between relative z-10">
      <Link href="/dashboard" className="flex items-center gap-1.5 md:gap-2 hover:opacity-80 transition-opacity">
        <PixelCloudLogo size={28} className="md:hidden" animated={false} />
        <PixelCloudLogo size={48} className="hidden md:block" animated={false} />
        <span className="font-pixel text-pluit-blue text-[9px] md:text-sm">PLUIT.CLOUD</span>
      </Link>
      <div className="flex items-center gap-3 md:gap-6">
        <Link
          href="/dashboard"
          className={cn(
            'font-sans text-xs md:text-sm pixel-tab',
            pathname === '/dashboard' ? 'pixel-tab-active' : 'text-pluit-blue/70 hover:text-pluit-blue'
          )}
        >
          VAULT
        </Link>
        <Link
          href="/settings"
          className={cn(
            'font-sans text-xs md:text-sm pixel-tab',
            pathname === '/settings' ? 'pixel-tab-active' : 'text-pluit-blue/70 hover:text-pluit-blue'
          )}
        >
          SETTINGS
        </Link>
        <PixelButton variant="secondary" onClick={handleSignOut} className="text-[10px] md:text-xs px-2 md:px-3 py-1">
          LOGOUT
        </PixelButton>
      </div>
    </nav>
  )
}
