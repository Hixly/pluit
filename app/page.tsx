import Link from 'next/link'
import { PixelButton } from '@/components/ui/pixel-button'
import { PixelCard } from '@/components/ui/pixel-card'
import { PixelCloudLogo } from '@/components/ui/pixel-cloud-logo'
import { RainText } from '@/components/landing/rain-text'
import { InstallPrompt } from '@/components/landing/install-prompt'
import { WaterPoolCanvas } from '@/components/rain/water-pool-canvas'

// ─── Pixel Art Feature Icons ──────────────────────────────────────────────────

function PixelSearchIcon() {
  const outline: [number, number][] = [
    [2,0],[3,0],[4,0],[5,0],
    [1,1],[6,1],
    [0,2],[7,2],
    [0,3],[7,3],
    [0,4],[7,4],
    [1,5],[6,5],
    [2,6],[3,6],[4,6],[5,6],
    [6,7],[7,7],
    [7,8],[8,8],
    [8,9],[9,9],
  ]
  return (
    <svg width="48" height="48" viewBox="0 0 50 50" shapeRendering="crispEdges" style={{ overflow: 'visible' }}>
      <rect className="icon-radar" x={5} y={5} width={35} height={35} fill="none" stroke="#89CFF0" strokeWidth={2} opacity={0.6} />
      {outline.map(([col, row], i) => (
        <rect key={i} x={col * 5} y={row * 5} width={5} height={5} fill="#89CFF0" />
      ))}
    </svg>
  )
}

function PixelChatIcon() {
  const border: [number, number][] = [
    [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],
    [0,1],[8,1],[0,2],[8,2],[0,3],[8,3],[0,4],[8,4],[0,5],[8,5],
    [0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6],
    [1,7],[2,7],[1,8],
  ]
  const line1: [number, number][] = [[2,2],[3,2],[4,2],[5,2],[6,2]]
  const line2: [number, number][] = [[2,4],[3,4],[4,4],[5,4]]
  return (
    <svg width="48" height="48" viewBox="0 0 45 45" shapeRendering="crispEdges">
      {border.map(([col, row], i) => (
        <rect key={i} x={col * 5} y={row * 5} width={5} height={5} fill="#89CFF0" />
      ))}
      {line1.map(([col, row], i) => (
        <rect key={i} x={col * 5} y={row * 5} width={5} height={5} fill="#89CFF0" />
      ))}
      {line2.map(([col, row], i) => (
        <rect key={i} x={col * 5} y={row * 5} width={5} height={5} fill="#89CFF0" />
      ))}
      <rect className="icon-type-cursor" x={30} y={20} width={5} height={5} fill="#ffffff" />
    </svg>
  )
}

function PixelFolderIcon() {
  const frame: [number, number][] = [
    [0,1],[1,1],[2,1],[3,1],
    [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],
    [0,3],[9,3],[0,4],[9,4],[0,5],[9,5],[0,6],[9,6],[0,7],[9,7],
    [0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[8,8],[9,8],
  ]
  const file1: [number, number][] = [[2,4],[3,4],[4,4],[5,4],[6,4],[7,4]]
  const file2: [number, number][] = [[2,6],[3,6],[4,6],[5,6],[6,6],[7,6]]
  return (
    <svg width="48" height="48" viewBox="0 0 50 45" shapeRendering="crispEdges">
      {frame.map(([col, row], i) => (
        <rect key={i} x={col * 5} y={row * 5} width={5} height={5} fill="#89CFF0" />
      ))}
      <g className="icon-file-1">
        {file1.map(([col, row], i) => (
          <rect key={i} x={col * 5} y={row * 5} width={5} height={5} fill="#ffffff" />
        ))}
      </g>
      <g className="icon-file-2">
        {file2.map(([col, row], i) => (
          <rect key={i} x={col * 5} y={row * 5} width={5} height={5} fill="#ffffff" />
        ))}
      </g>
    </svg>
  )
}

// ─── Pixel Divider ────────────────────────────────────────────────────────────

function PixelDivider() {
  return (
    <div className="flex items-center gap-3 w-full max-w-5xl mx-auto px-6">
      <div className="flex-1 h-px bg-pluit-blue/15" />
      <span className="font-pixel text-[8px] text-pluit-blue/25">◆</span>
      <div className="flex-1 h-px bg-pluit-blue/15" />
    </div>
  )
}

// ─── Check mark for pricing ───────────────────────────────────────────────────

function Check() {
  return <span className="text-pluit-cyan font-pixel text-[8px]">✓</span>
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  const features = [
    {
      icon: <PixelSearchIcon />,
      title: 'SMART SEARCH',
      desc: 'Real-time search across every file in your vault. Find anything instantly — no folder-digging required.',
      scan: '',
    },
    {
      icon: <PixelChatIcon />,
      title: 'ASK PLUIT',
      desc: 'Chat directly with your documents. Get summaries, extract answers, and understand your files with AI.',
      scan: 'feature-scanline-fast',
    },
    {
      icon: <PixelFolderIcon />,
      title: 'VAULT STORAGE',
      desc: 'Upload files of any type, organize into folders, preview in-browser, and download anywhere.',
      scan: 'feature-scanline-slow',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Nav ── */}
      <header className="border-b-2 border-pluit-blue/30 bg-pluit-panel/80 backdrop-blur-sm px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 shrink-0">
          <PixelCloudLogo size={36} animated={false} />
          <span className="font-pixel text-pluit-blue text-[10px] md:text-xs tracking-widest">PLUIT.CLOUD</span>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          {/* Hide nav links on mobile */}
          <Link href="#capabilities" className="hidden md:block font-pixel text-[9px] text-pluit-blue/60 hover:text-pluit-blue transition-colors">
            CAPABILITIES
          </Link>
          <Link href="#storage" className="hidden md:block font-pixel text-[9px] text-pluit-blue/60 hover:text-pluit-blue transition-colors">
            STORAGE
          </Link>
          <Link href="/login">
            <PixelButton variant="secondary" className="text-[10px] md:text-xs px-3 py-1.5 md:px-4 md:py-2">LOGIN</PixelButton>
          </Link>
          <Link href="/signup">
            <PixelButton className="text-[10px] md:text-xs px-3 py-1.5 md:px-4 md:py-2">GET STARTED</PixelButton>
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-4 pt-16 md:pt-24 pb-16 md:pb-20 space-y-5 md:space-y-6">
        <PixelCloudLogo size={96} className="md:w-32 md:h-32" />

        <h1 className="font-pixel text-pluit-blue text-xl md:text-3xl tracking-tight">
          PLUIT.CLOUD
        </h1>

        <div className="font-pixel text-pluit-cyan text-xs md:text-sm min-h-[1.25rem]">
          <RainText text="Every byte finds a cloud." charDelay={65} />
        </div>

        <p className="text-white/55 text-xs md:text-sm max-w-xs md:max-w-sm leading-relaxed px-2">
          Cloud storage that actually thinks. Upload, search, and have conversations with your files — powered by PLUIT.
        </p>

        <div className="flex flex-wrap gap-3 items-center justify-center pt-1">
          <Link href="/signup">
            <PixelButton className="text-xs md:text-sm px-6 md:px-8 py-2 md:py-3">
              START FOR FREE →
            </PixelButton>
          </Link>
          <Link href="/login">
            <PixelButton variant="secondary" className="text-xs md:text-sm px-5 md:px-6 py-2 md:py-3">
              LOGIN
            </PixelButton>
          </Link>
        </div>

        {/* Trust strip — 2×2 on mobile, 1 row on desktop */}
        <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-center gap-2 md:gap-4 pt-2 font-pixel text-[7px] md:text-[8px] text-pluit-blue/35">
          <span className="text-center">5 GB FREE</span>
          <span className="text-center">NO CREDIT CARD</span>
          <span className="text-center">AI-POWERED</span>
          <span className="text-center">ALWAYS SECURE</span>
        </div>
      </section>

      <PixelDivider />

      {/* ── Features ── */}
      <section id="capabilities" className="px-6 py-20 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12 space-y-2">
          <div className="font-pixel text-[8px] text-pluit-blue/40 tracking-widest">{'> CAPABILITIES'}</div>
          <h2 className="font-pixel text-pluit-blue text-xs">WHAT YOUR VAULT CAN DO</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(f => (
            <PixelCard key={f.title} className="feature-card p-8 space-y-5 text-center bg-black/70">
              <div className={`feature-scanline ${f.scan}`} />
              <div className="flex justify-center pt-2">{f.icon}</div>
              <div className="font-pixel text-xs text-pluit-blue">{f.title}</div>
              <p className="text-sm text-white/65 leading-relaxed">{f.desc}</p>
            </PixelCard>
          ))}
        </div>
      </section>

      <PixelDivider />

      {/* ── Storage ── */}
      <section id="storage" className="px-6 py-20 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12 space-y-2">
          <div className="font-pixel text-[8px] text-pluit-blue/40 tracking-widest">{'> STORAGE'}</div>
          <h2 className="font-pixel text-pluit-blue text-xs">FREE, ON THE HOUSE</h2>
        </div>
        <div className="max-w-md mx-auto">
          <div className="relative p-8 border-2 border-pluit-blue bg-pluit-blue/10 shadow-[0_0_24px_rgba(137,207,240,0.2)] space-y-5 text-center">
            <div className="font-pixel text-xs text-pluit-cyan">YOUR VAULT</div>
            <div className="font-pixel text-white text-4xl leading-none">
              5 GB
              <span className="block mt-2 text-xs text-pluit-blue/60">FREE FOREVER</span>
            </div>
            <div className="border-t border-pluit-blue/20 pt-4 space-y-2 text-left max-w-[15rem] mx-auto">
              {['5 GB of storage', 'AI-powered search', 'Chat with your files', 'Folder organization', 'No credit card, no billing'].map(feat => (
                <div key={feat} className="flex items-start gap-2 text-xs text-white/70">
                  <Check />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
            <Link href="/signup" className="block">
              <PixelButton className="w-full text-xs">CREATE FREE ACCOUNT →</PixelButton>
            </Link>
          </div>
        </div>
        <p className="text-center text-[10px] text-pluit-blue/30 mt-8 font-pixel">
          NO PLANS. NO PAYWALLS. JUST A CLEAN PLACE FOR YOUR FILES.
        </p>
      </section>

      <PixelDivider />

      {/* ── Final CTA ── */}
      <section className="px-6 py-20">
        <PixelCard className="max-w-2xl mx-auto p-12 text-center space-y-6 bg-pluit-panel/80">
          <PixelCloudLogo size={72} animated={true} />
          <h2 className="font-pixel text-pluit-blue text-sm leading-relaxed">
            YOUR VAULT AWAITS
          </h2>
          <p className="text-white/55 text-sm leading-relaxed max-w-sm mx-auto">
            Join Pluit.cloud. Store, search, and talk to your files — 5 GB free, no strings attached.
          </p>
          <Link href="/signup">
            <PixelButton className="text-sm px-10 py-3">
              CREATE FREE ACCOUNT →
            </PixelButton>
          </Link>
        </PixelCard>
      </section>

      <PixelDivider />

      {/* ── Install App ── */}
      <section id="install" className="px-6 py-20 max-w-5xl mx-auto w-full">
        <div className="text-center mb-10 space-y-2">
          <div className="font-pixel text-[8px] text-pluit-blue/40 tracking-widest">{'> GET THE APP'}</div>
          <h2 className="font-pixel text-pluit-blue text-xs">TAKE PLUIT WITH YOU</h2>
          <p className="text-white/50 text-xs max-w-sm mx-auto mt-2 leading-relaxed">
            Install Pluit on your phone for instant access — no app store needed.
          </p>
        </div>
        <InstallPrompt />
      </section>

      {/* ── Water Pool ── */}
      <WaterPoolCanvas />

      {/* ── Footer ── */}
      <footer className="border-t-2 border-pluit-blue/20 px-6 py-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <PixelCloudLogo size={28} animated={false} />
            <span className="font-pixel text-xs text-pluit-blue/50 tracking-widest">PLUIT.CLOUD</span>
          </div>
          <span className="font-pixel text-[8px] text-pluit-blue/25 tracking-widest">
            EVERY BYTE FINDS A CLOUD
          </span>
          <div className="flex gap-5 font-pixel text-[8px] text-pluit-blue/40">
            <Link href="/login" className="hover:text-pluit-blue transition-colors">LOGIN</Link>
            <Link href="/signup" className="hover:text-pluit-blue transition-colors">SIGN UP</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
