'use client'
import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import { useStorage } from '@/hooks/use-storage'
import { PixelCard } from '@/components/ui/pixel-card'
import { PixelProgress } from '@/components/ui/pixel-progress'
import { PixelButton } from '@/components/ui/pixel-button'

const supabase = createClient()

// ─── File type config ─────────────────────────────────────────────────────────

const FILE_TYPES = [
  {
    key: 'images',
    label: 'IMAGES',
    color: '#89CFF0',
    test: (m: string) => m.startsWith('image/'),
  },
  {
    key: 'video',
    label: 'VIDEO',
    color: '#a78bfa',
    test: (m: string) => m.startsWith('video/'),
  },
  {
    key: 'audio',
    label: 'AUDIO',
    color: '#34d399',
    test: (m: string) => m.startsWith('audio/'),
  },
  {
    key: 'docs',
    label: 'DOCUMENTS',
    color: '#b8dfff',
    test: (m: string) =>
      m.startsWith('text/') ||
      m.includes('pdf') ||
      m.includes('word') ||
      m.includes('document') ||
      m.includes('spreadsheet') ||
      m.includes('excel') ||
      m.includes('presentation'),
  },
  {
    key: 'archives',
    label: 'ARCHIVES',
    color: '#fb923c',
    test: (m: string) =>
      m.includes('zip') ||
      m.includes('rar') ||
      m.includes('tar') ||
      m.includes('7z') ||
      m.includes('archive') ||
      m.includes('compressed'),
  },
  {
    key: 'other',
    label: 'OTHER',
    color: '#6b7280',
    test: () => true,
  },
] as const

async function fetchFileTypes(): Promise<Record<string, number>> {
  const { data } = await supabase
    .from('files')
    .select('mime_type')
    .is('deleted_at', null)

  if (!data || data.length === 0) return {}

  const counts: Record<string, number> = {}
  for (const { mime_type } of data) {
    const m = mime_type ?? ''
    // assign to first matching category
    const match = FILE_TYPES.find(t => t.test(m))
    if (match) counts[match.key] = (counts[match.key] ?? 0) + 1
  }
  return counts
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export function StorageSidebar() {
  const { used, limit, tier, isLoading } = useStorage()
  const { data: fileCounts } = useSWR('file-types', fetchFileTypes)

  if (isLoading) return null

  const hasFiles = fileCounts && Object.values(fileCounts).some(v => v > 0)

  return (
    <PixelCard className="p-4 space-y-4">
      {/* Storage header */}
      <div className="font-pixel text-xs text-pluit-blue">STORAGE</div>

      {/* Storage bar */}
      <PixelProgress used={used} limit={limit} />

      {/* Plan name */}
      <div className="font-pixel text-xs text-pluit-gold uppercase text-center">
        {tier} PLAN
      </div>

      {/* Upgrade button */}
      {tier === 'free' && (
        <PixelButton variant="primary" className="w-full text-xs">
          UPGRADE
        </PixelButton>
      )}

      {/* File type breakdown */}
      {hasFiles && (
        <div className="space-y-2 pt-1 border-t border-pluit-blue/20">
          <div className="font-pixel text-[8px] text-pluit-blue/40 pt-1">FILE TYPES</div>
          {FILE_TYPES.filter(t => (fileCounts?.[t.key] ?? 0) > 0).map(t => {
            const count = fileCounts?.[t.key] ?? 0
            const total = Object.values(fileCounts ?? {}).reduce((a, b) => a + b, 0)
            const pct = total > 0 ? Math.round((count / total) * 100) : 0
            return (
              <div key={t.key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* 3px pixel dot */}
                    <div
                      className="w-2 h-2 shrink-0"
                      style={{ background: t.color, imageRendering: 'pixelated' }}
                    />
                    <span className="font-pixel text-[8px] text-pluit-blue/60">{t.label}</span>
                  </div>
                  <span className="font-pixel text-[8px] text-pluit-blue/50">{count}</span>
                </div>
                {/* Mini progress bar */}
                <div className="w-full h-1 bg-pluit-bg border border-pluit-blue/15">
                  <div
                    className="h-full transition-all duration-300"
                    style={{ width: `${pct}%`, background: t.color, opacity: 0.7 }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </PixelCard>
  )
}
