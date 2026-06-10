'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useStorage } from '@/hooks/use-storage'
import { PixelCard } from '@/components/ui/pixel-card'
import { PixelButton } from '@/components/ui/pixel-button'
import { PixelProgress } from '@/components/ui/pixel-progress'
import { useState, useEffect } from 'react'
import { formatBytes } from '@/lib/utils'
import { PLAN_AI_CALLS_LIMIT } from '@/types'
import type { Profile } from '@/types'

const PLANS = [
  { name: 'FREE',     storage: '5 GB',   price: '$0/mo',  ai: '10 calls/mo' },
  { name: 'PERSONAL', storage: '50 GB',  price: '$5/mo',  ai: 'Unlimited' },
  { name: 'PRO',      storage: '200 GB', price: '$12/mo', ai: 'Unlimited' },
  { name: 'BUSINESS', storage: '1 TB',   price: '$30/mo', ai: 'Unlimited' },
]

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const { used, limit, tier, percentUsed } = useStorage()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwStatus, setPwStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [pwError, setPwError] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setEmail(user.email ?? '')
      const { data } = await supabase
        .from('profiles').select('*').eq('id', user?.id ?? '').single()
      if (data) setProfile(data)
    }
    load()
  }, [])

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) { setPwError('Passwords do not match'); setPwStatus('error'); return }
    if (newPassword.length < 8) { setPwError('Minimum 8 characters'); setPwStatus('error'); return }
    setPwStatus('loading'); setPwError('')
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) { setPwError(error.message); setPwStatus('error') }
    else { setPwStatus('success'); setNewPassword(''); setConfirmPassword('') }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Delete your account and ALL files permanently? This cannot be undone.')) return
    if (!confirm('Are you absolutely sure?')) return
    setDeleting(true)
    await supabase.auth.signOut()
    router.push('/')
  }

  const aiLimit = PLAN_AI_CALLS_LIMIT[tier]
  const aiUsed = profile?.ai_calls_used_this_month ?? 0

  return (
    <div className="space-y-4">
      <h1 className="font-pixel text-pluit-blue text-sm">SETTINGS</h1>

      {/* Row 1: Account + AI Usage side by side */}
      <div className="grid grid-cols-2 gap-4">
        <PixelCard className="p-5 space-y-3">
          <h2 className="font-pixel text-xs text-pluit-blue border-b border-pluit-blue/20 pb-2">ACCOUNT</h2>
          <Row label="EMAIL" value={email || '...'} />
          <Row label="PLAN" value={tier.toUpperCase()} highlight />
          <Row label="MEMBER SINCE" value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '...'} />
        </PixelCard>

        <PixelCard className="p-5 space-y-3">
          <h2 className="font-pixel text-xs text-pluit-blue border-b border-pluit-blue/20 pb-2">VAULT AI USAGE</h2>
          <div className="flex justify-between font-pixel text-xs">
            <span className="text-white">{aiUsed} calls used</span>
            <span className="text-pluit-blue/60">{aiLimit === null ? '∞ limit' : `${aiLimit} limit`}</span>
          </div>
          {aiLimit !== null && (
            <div className="w-full bg-pluit-bg border border-pluit-blue/30 h-2">
              <div className="h-full bg-pluit-blue" style={{ width: `${Math.min((aiUsed / aiLimit) * 100, 100)}%` }} />
            </div>
          )}
          <p className="text-xs text-pluit-blue/40 font-pixel">
            {aiLimit === null ? 'UNLIMITED ON YOUR PLAN' : `${aiLimit - aiUsed} CALLS REMAINING`}
          </p>
          {aiLimit !== null && aiUsed >= aiLimit && (
            <p className="font-pixel text-xs text-red-400">⚠ LIMIT REACHED — UPGRADE TO CONTINUE</p>
          )}
        </PixelCard>
      </div>

      {/* Row 2: Storage full width */}
      <PixelCard className="p-5 space-y-3">
        <h2 className="font-pixel text-xs text-pluit-blue border-b border-pluit-blue/20 pb-2">STORAGE</h2>
        <PixelProgress used={used} limit={limit} />
        <div className="flex justify-between font-pixel text-xs">
          <span className="text-white">{formatBytes(used)} used</span>
          <span className="text-pluit-blue/60">{formatBytes(limit)} total — {percentUsed.toFixed(1)}% used</span>
        </div>
      </PixelCard>

      {/* Row 3: Plans full width */}
      <PixelCard className="p-5 space-y-3">
        <h2 className="font-pixel text-xs text-pluit-blue border-b border-pluit-blue/20 pb-2">PLANS</h2>
        <div className="grid grid-cols-4 gap-3">
          {PLANS.map(p => (
            <div
              key={p.name}
              className={`p-3 border-2 space-y-1 ${
                p.name.toLowerCase() === tier
                  ? 'border-pluit-blue bg-pluit-blue/10'
                  : 'border-pluit-blue/20'
              }`}
            >
              <div className="flex items-center gap-1">
                {p.name.toLowerCase() === tier && <span className="font-pixel text-xs text-pluit-blue">&gt;</span>}
                <span className="font-pixel text-xs text-white">{p.name}</span>
              </div>
              <div className="font-pixel text-xs text-pluit-blue">{p.storage}</div>
              <div className="font-pixel text-xs text-pluit-blue/50">{p.ai}</div>
              <div className="font-pixel text-xs text-pluit-blue/40">{p.price}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-pluit-blue/30 font-pixel">BILLING COMING SOON</p>
      </PixelCard>

      {/* Row 4: Change Password + Danger Zone side by side */}
      <div className="grid grid-cols-2 gap-4">
        <PixelCard className="p-5 space-y-3">
          <h2 className="font-pixel text-xs text-pluit-blue border-b border-pluit-blue/20 pb-2">CHANGE PASSWORD</h2>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="font-pixel text-xs text-pluit-blue/60 block mb-1">NEW PASSWORD</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                minLength={8} required
                className="w-full bg-pluit-bg border-2 border-pluit-blue p-2 text-white text-sm focus:border-pluit-cyan outline-none" />
            </div>
            <div>
              <label className="font-pixel text-xs text-pluit-blue/60 block mb-1">CONFIRM PASSWORD</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                minLength={8} required
                className="w-full bg-pluit-bg border-2 border-pluit-blue p-2 text-white text-sm focus:border-pluit-cyan outline-none" />
            </div>
            {pwStatus === 'error' && <p className="font-pixel text-xs text-red-400">⚠ {pwError}</p>}
            {pwStatus === 'success' && <p className="font-pixel text-xs text-green-400">✓ PASSWORD UPDATED</p>}
            <PixelButton type="submit" disabled={pwStatus === 'loading'}>
              {pwStatus === 'loading' ? 'UPDATING...' : 'UPDATE PASSWORD'}
            </PixelButton>
          </form>
        </PixelCard>

        <PixelCard className="p-5 space-y-3" style={{ borderColor: '#7f1d1d' }}>
          <h2 className="font-pixel text-xs text-red-400 border-b border-red-900/40 pb-2">DANGER ZONE</h2>
          <p className="text-xs text-red-400/60 leading-relaxed">
            Permanently deletes your account and removes all files from your vault. This action cannot be undone.
          </p>
          <PixelButton variant="danger" onClick={handleDeleteAccount} disabled={deleting}>
            {deleting ? 'DELETING...' : 'DELETE ACCOUNT'}
          </PixelButton>
        </PixelCard>
      </div>
    </div>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="font-pixel text-xs text-pluit-blue/50">{label}</span>
      <span className={`text-xs truncate max-w-[60%] text-right ${highlight ? 'font-pixel text-pluit-blue' : 'text-white'}`}>
        {value}
      </span>
    </div>
  )
}
