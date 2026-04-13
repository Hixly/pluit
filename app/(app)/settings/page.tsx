'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useStorage } from '@/hooks/use-storage'
import { PixelCard } from '@/components/ui/pixel-card'
import { PixelButton } from '@/components/ui/pixel-button'
import { PixelProgress } from '@/components/ui/pixel-progress'
import { useState } from 'react'

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const { used, limit, tier } = useStorage()
  const [deleting, setDeleting] = useState(false)

  const handleDeleteAccount = async () => {
    if (!confirm('Delete your account and ALL files permanently? This cannot be undone.')) return
    if (!confirm('Are you absolutely sure?')) return
    setDeleting(true)
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="font-pixel text-pluit-blue text-sm">SETTINGS</h1>
      <PixelCard className="p-6 space-y-4">
        <h2 className="font-pixel text-xs text-pluit-blue">STORAGE</h2>
        <PixelProgress used={used} limit={limit} />
        <div className="font-pixel text-xs text-pluit-gold uppercase">Current plan: {tier}</div>
      </PixelCard>
      <PixelCard className="p-6 space-y-4">
        <h2 className="font-pixel text-xs text-pluit-blue">PLAN</h2>
        <div className="space-y-2 text-xs text-pluit-blue/70">
          {[['Free','5GB','$0/mo'],['Personal','50GB','$5/mo'],['Pro','200GB','$12/mo'],['Business','1TB','$30/mo']].map(([name,storage,price]) => (
            <div key={name} className="flex justify-between">
              <span>{name}</span><span>{storage} — {price}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-pluit-blue/40 font-pixel">Billing coming soon.</p>
      </PixelCard>
      <PixelCard className="p-6 space-y-4 border-red-800">
        <h2 className="font-pixel text-xs text-red-400">DANGER ZONE</h2>
        <p className="text-xs text-red-400/70">Deleting your account is permanent and removes all files.</p>
        <PixelButton variant="danger" onClick={handleDeleteAccount} disabled={deleting}>
          {deleting ? 'DELETING...' : 'DELETE ACCOUNT'}
        </PixelButton>
      </PixelCard>
    </div>
  )
}
