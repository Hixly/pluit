'use client'

import { useEffect, useState } from 'react'
import { PixelButton } from '@/components/ui/pixel-button'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block align-middle">
      <path d="M8 1v9M8 1L5 4M8 1l3 3" stroke="#89CFF0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 8v5a1 1 0 001 1h8a1 1 0 001-1V8" stroke="#89CFF0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline-block align-middle">
      <rect x="0.5" y="0.5" width="13" height="13" rx="3" stroke="#89CFF0" strokeWidth="1"/>
      <path d="M7 4v6M4 7h6" stroke="#89CFF0" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showSteps, setShowSteps] = useState(false)

  useEffect(() => {
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)

    const ua = navigator.userAgent
    setIsIOS(/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (isStandalone) return null

  async function handleInstall() {
    if (deferredPrompt) {
      await deferredPrompt.prompt()
      await deferredPrompt.userChoice
      setDeferredPrompt(null)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="border-2 border-pluit-blue/40 bg-black/80 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-pluit-blue/60 flex items-center justify-center shrink-0">
            <span className="font-pixel text-pluit-blue text-[10px]">APP</span>
          </div>
          <div>
            <div className="font-pixel text-pluit-blue text-[10px]">INSTALL PLUIT</div>
            <div className="text-white/50 text-xs mt-0.5">Add to your home screen</div>
          </div>
        </div>

        {deferredPrompt ? (
          <PixelButton onClick={handleInstall} className="w-full text-xs">
            INSTALL APP →
          </PixelButton>
        ) : isIOS ? (
          <div className="space-y-3">
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="w-full font-pixel text-[10px] text-pluit-blue/70 hover:text-pluit-blue transition-colors text-left flex items-center justify-between"
            >
              <span>{showSteps ? '▾' : '▸'} HOW TO INSTALL ON iPHONE</span>
            </button>
            {showSteps && (
              <ol className="space-y-3 text-xs text-white/65 pl-1">
                <li className="flex items-start gap-2">
                  <span className="font-pixel text-pluit-blue text-[10px] shrink-0 mt-0.5">1.</span>
                  <span>Tap the <ShareIcon /> share button in Safari</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-pixel text-pluit-blue text-[10px] shrink-0 mt-0.5">2.</span>
                  <span>Scroll down and tap <strong className="text-white/80">&quot;Add to Home Screen&quot;</strong> <PlusIcon /></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-pixel text-pluit-blue text-[10px] shrink-0 mt-0.5">3.</span>
                  <span>Tap <strong className="text-white/80">&quot;Add&quot;</strong> — Pluit opens like a native app</span>
                </li>
              </ol>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="w-full font-pixel text-[10px] text-pluit-blue/70 hover:text-pluit-blue transition-colors text-left flex items-center justify-between"
            >
              <span>{showSteps ? '▾' : '▸'} HOW TO INSTALL</span>
            </button>
            {showSteps && (
              <ol className="space-y-3 text-xs text-white/65 pl-1">
                <li className="flex items-start gap-2">
                  <span className="font-pixel text-pluit-blue text-[10px] shrink-0 mt-0.5">1.</span>
                  <span>Open <strong className="text-white/80">pluit.cloud</strong> in Chrome or Edge</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-pixel text-pluit-blue text-[10px] shrink-0 mt-0.5">2.</span>
                  <span>Tap the <strong className="text-white/80">menu (⋮)</strong> then <strong className="text-white/80">&quot;Install app&quot;</strong> or <strong className="text-white/80">&quot;Add to Home screen&quot;</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-pixel text-pluit-blue text-[10px] shrink-0 mt-0.5">3.</span>
                  <span>Pluit appears on your home screen as a full-screen app</span>
                </li>
              </ol>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
