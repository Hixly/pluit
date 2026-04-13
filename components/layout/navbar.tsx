'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PixelButton } from '@/components/ui/pixel-button'

export function Navbar() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="border-b-2 border-pluit-blue bg-pluit-panel px-6 py-3 flex items-center justify-between relative z-10">
      <Link href="/dashboard" className="font-pixel text-pluit-blue text-sm hover:text-pluit-cyan">
        PLUIT.CLOUD
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="font-pixel text-xs text-pluit-blue/70 hover:text-pluit-blue">
          VAULT
        </Link>
        <Link href="/settings" className="font-pixel text-xs text-pluit-blue/70 hover:text-pluit-blue">
          SETTINGS
        </Link>
        <PixelButton variant="secondary" onClick={handleSignOut} className="text-xs py-1">
          LOGOUT
        </PixelButton>
      </div>
    </nav>
  )
}
