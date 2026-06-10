import { ImageResponse } from 'next/og'

// Node runtime — more reliable than edge for iMessage/Apple scrapers
export const alt = 'Pluit.cloud — Every byte finds a cloud.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const CLOUD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 26" shape-rendering="crispEdges">
  <rect x="6" y="2" width="2" height="2" fill="white"/>
  <rect x="8" y="2" width="2" height="2" fill="white"/>
  <rect x="4" y="4" width="2" height="2" fill="white"/>
  <rect x="6" y="4" width="2" height="2" fill="white"/>
  <rect x="8" y="4" width="2" height="2" fill="white"/>
  <rect x="10" y="4" width="2" height="2" fill="white"/>
  <rect x="14" y="0" width="2" height="2" fill="white"/>
  <rect x="16" y="0" width="2" height="2" fill="white"/>
  <rect x="12" y="2" width="2" height="2" fill="white"/>
  <rect x="14" y="2" width="2" height="2" fill="white"/>
  <rect x="16" y="2" width="2" height="2" fill="white"/>
  <rect x="18" y="2" width="2" height="2" fill="white"/>
  <rect x="2" y="6" width="20" height="2" fill="white"/>
  <rect x="0" y="8" width="24" height="2" fill="white"/>
  <rect x="0" y="10" width="24" height="2" fill="white"/>
  <rect x="0" y="12" width="24" height="2" fill="white"/>
  <rect x="2" y="16" width="2" height="2" fill="#89CFF0"/>
  <rect x="8" y="16" width="2" height="2" fill="#89CFF0"/>
  <rect x="14" y="16" width="2" height="2" fill="#89CFF0"/>
  <rect x="20" y="16" width="2" height="2" fill="#89CFF0"/>
  <rect x="4" y="20" width="2" height="2" fill="#89CFF0"/>
  <rect x="10" y="20" width="2" height="2" fill="#89CFF0"/>
  <rect x="16" y="20" width="2" height="2" fill="#89CFF0"/>
  <rect x="22" y="20" width="2" height="2" fill="#89CFF0"/>
  <rect x="2" y="24" width="2" height="2" fill="#89CFF0"/>
  <rect x="8" y="24" width="2" height="2" fill="#89CFF0"/>
  <rect x="14" y="24" width="2" height="2" fill="#89CFF0"/>
  <rect x="20" y="24" width="2" height="2" fill="#89CFF0"/>
</svg>`

const CLOUD_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(CLOUD_SVG)}`

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Rain streaks */}
        {[80, 200, 340, 480, 600, 720, 860, 980, 1100].map((x, i) => (
          <div key={i} style={{
            position: 'absolute', left: x, top: 0,
            width: 2, height: 630,
            background: 'rgba(137,207,240,0.08)',
            display: 'flex',
          }} />
        ))}

        {/* Top accent */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: '#89CFF0', display: 'flex' }} />

        {/* Pixel cloud logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={CLOUD_URL} width={160} height={174} style={{ imageRendering: 'pixelated', marginBottom: 36 }} alt="" />

        {/* Title */}
        <div style={{
          color: '#89CFF0',
          fontSize: 72,
          fontWeight: 700,
          letterSpacing: 6,
          marginBottom: 22,
          display: 'flex',
        }}>
          PLUIT.CLOUD
        </div>

        {/* Tagline */}
        <div style={{
          color: '#b8dfff',
          fontSize: 26,
          marginBottom: 50,
          opacity: 0.85,
          display: 'flex',
        }}>
          Every byte finds a cloud.
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: 20 }}>
          {['SMART SEARCH', 'ASK PLUIT', 'VAULT STORAGE'].map(f => (
            <div key={f} style={{
              border: '2px solid rgba(137,207,240,0.4)',
              color: 'rgba(137,207,240,0.7)',
              fontSize: 15,
              padding: '10px 22px',
              display: 'flex',
            }}>
              {f}
            </div>
          ))}
        </div>

        {/* URL */}
        <div style={{
          position: 'absolute', bottom: 28, right: 52,
          color: 'rgba(137,207,240,0.3)',
          fontSize: 18,
          display: 'flex',
        }}>
          pluit.cloud
        </div>

        {/* Bottom accent */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: '#89CFF0', display: 'flex' }} />
      </div>
    ),
    { ...size }
  )
}
