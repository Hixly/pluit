'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { PixelButton } from '@/components/ui/pixel-button'
import { PixelCard } from '@/components/ui/pixel-card'

export default function SignupPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${location.origin}/api/auth/callback` },
    })
    if (error) { setError(error.message); setLoading(false) }
    else { setSuccess(true); setLoading(false) }
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/api/auth/callback` },
    })
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <PixelCard className="w-full max-w-sm p-8 text-center space-y-4">
          <div className="text-4xl">🌧</div>
          <h2 className="font-pixel text-pluit-blue text-xs">CHECK YOUR EMAIL</h2>
          <p className="text-pluit-blue/60 text-xs">We sent a confirmation link to {email}</p>
        </PixelCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <PixelCard className="w-full max-w-sm p-8 space-y-6">
        <div className="text-center">
          <h1 className="font-pixel text-pluit-blue text-sm">CREATE ACCOUNT</h1>
          <p className="text-pluit-blue/60 text-xs mt-2">Join Pluit.cloud</p>
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="font-pixel text-xs text-pluit-blue block mb-2">EMAIL</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full bg-pluit-bg border-2 border-pluit-blue p-2 text-white text-sm focus:border-pluit-cyan outline-none" />
          </div>
          <div>
            <label className="font-pixel text-xs text-pluit-blue block mb-2">PASSWORD</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
              className="w-full bg-pluit-bg border-2 border-pluit-blue p-2 text-white text-sm focus:border-pluit-cyan outline-none" />
          </div>
          {error && <p className="text-red-400 text-xs font-pixel">{error}</p>}
          <PixelButton type="submit" className="w-full" disabled={loading}>
            {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
          </PixelButton>
        </form>
        <div className="relative">
          <div className="border-t border-pluit-blue/30" />
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-pluit-panel px-2 text-xs text-pluit-blue/50 font-pixel">OR</span>
        </div>
        <PixelButton variant="secondary" className="w-full" onClick={handleGoogle}>
          SIGN UP WITH GOOGLE
        </PixelButton>
        <p className="text-center text-xs text-pluit-blue/60">
          Have an account?{' '}
          <Link href="/login" className="text-pluit-blue hover:text-pluit-cyan font-pixel">LOGIN</Link>
        </p>
      </PixelCard>
    </div>
  )
}
