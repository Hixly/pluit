import Link from 'next/link'
import { PixelButton } from '@/components/ui/pixel-button'
import { PixelCard } from '@/components/ui/pixel-card'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b-2 border-pluit-blue bg-pluit-panel px-6 py-3 flex items-center justify-between">
        <span className="font-pixel text-pluit-blue text-sm">PLUIT.CLOUD</span>
        <div className="flex gap-3">
          <Link href="/login"><PixelButton variant="secondary" className="text-xs">LOGIN</PixelButton></Link>
          <Link href="/signup"><PixelButton className="text-xs">GET STARTED</PixelButton></Link>
        </div>
      </header>
      <section className="flex flex-col items-center justify-center flex-1 text-center px-4 py-24 space-y-8">
        <div className="text-8xl">🌧</div>
        <h1 className="font-pixel text-pluit-blue text-2xl leading-relaxed">PLUIT.CLOUD</h1>
        <p className="font-pixel text-pluit-cyan text-sm">Every byte finds a cloud.</p>
        <p className="text-pluit-blue/60 text-sm max-w-md">AI-enhanced cloud storage that actually organizes your files. Pixel-perfect. Always raining.</p>
        <Link href="/signup"><PixelButton className="text-sm px-8 py-3">START FOR FREE</PixelButton></Link>
      </section>
      <section className="px-6 py-16 max-w-5xl mx-auto w-full">
        <h2 className="font-pixel text-pluit-blue text-xs text-center mb-12">FEATURES</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '🔍', title: 'SMART SEARCH', desc: 'Find any file by asking a question. No more digging through folders.' },
            { icon: '💬', title: 'CHAT YOUR FILES', desc: 'Ask questions about your documents. Get summaries instantly.' },
            { icon: '📂', title: 'AUTO-ORGANIZE', desc: 'AI suggests how to group your files. Accept with one click.' },
          ].map(f => (
            <PixelCard key={f.title} className="p-6 space-y-3 text-center">
              <div className="text-4xl">{f.icon}</div>
              <div className="font-pixel text-xs text-pluit-blue">{f.title}</div>
              <p className="text-xs text-pluit-blue/60">{f.desc}</p>
            </PixelCard>
          ))}
        </div>
      </section>
      <section className="px-6 py-16 max-w-5xl mx-auto w-full">
        <h2 className="font-pixel text-pluit-blue text-xs text-center mb-12">PRICING</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { name: 'FREE', storage: '5GB', price: '$0', ai: '10 AI/mo' },
            { name: 'PERSONAL', storage: '50GB', price: '$5', ai: 'Unlimited AI' },
            { name: 'PRO', storage: '200GB', price: '$12', ai: 'Unlimited AI' },
            { name: 'BUSINESS', storage: '1TB', price: '$30', ai: 'Unlimited AI' },
          ].map(p => (
            <PixelCard key={p.name} className="p-5 space-y-3 text-center">
              <div className="font-pixel text-xs text-pluit-gold">{p.name}</div>
              <div className="font-pixel text-pluit-blue text-lg">{p.price}<span className="text-xs">/mo</span></div>
              <div className="text-xs text-pluit-blue/60">{p.storage}</div>
              <div className="text-xs text-pluit-blue/60">{p.ai}</div>
            </PixelCard>
          ))}
        </div>
        <p className="text-center text-xs text-pluit-blue/40 mt-6 font-pixel">Billing coming soon. Sign up free today.</p>
      </section>
      <footer className="border-t-2 border-pluit-blue/30 px-6 py-4 text-center font-pixel text-xs text-pluit-blue/40">
        PLUIT.CLOUD — EVERY BYTE FINDS A CLOUD.
      </footer>
    </div>
  )
}
