'use client'
import { useState } from 'react'
import { UploadZone } from '@/components/files/upload-zone'
import { FileBrowser } from '@/components/files/file-browser'
import { AskTheVault } from '@/components/ai/ask-the-vault'
import { PixelCard } from '@/components/ui/pixel-card'
import { PixelButton } from '@/components/ui/pixel-button'
import { PixelSearch } from '@/components/ui/pixel-search'
import { FileIcon } from '@/components/files/file-icon'
import { useFiles } from '@/hooks/use-files'
import { useSearch } from '@/hooks/use-search'
import { useVaultStats } from '@/hooks/use-vault-stats'
import { useStorage } from '@/hooks/use-storage'
import { cn, formatBytes } from '@/lib/utils'
import type { FileRecord } from '@/types'

type Tab = 'vault' | 'trash' | 'ai'

// ─── Quick Stats Bar ──────────────────────────────────────────────────────────

function VaultStats() {
  const { fileCount, aiUsed, aiLimit, tier, isLoading } = useVaultStats()
  const { used, limit } = useStorage()

  const storagePercent = limit > 0 ? Math.min((used / limit) * 100, 100) : 0
  const aiLeft = aiLimit === null ? '∞' : Math.max(0, aiLimit - aiUsed)
  const aiSub = aiLimit === null ? 'UNLIMITED' : `${aiUsed} USED THIS MONTH`

  if (isLoading) return (
    <div className="grid grid-cols-3 gap-2 md:gap-3">
      {[0, 1, 2].map(i => (
        <PixelCard key={i} className="p-2.5 md:p-4 space-y-2 animate-pulse">
          <div className="h-1.5 w-12 bg-pluit-blue/20 rounded-none" />
          <div className="h-4 w-8 bg-pluit-blue/20 rounded-none" />
          <div className="h-1.5 w-16 bg-pluit-blue/10 rounded-none" />
        </PixelCard>
      ))}
    </div>
  )

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-3">
      <StatCard
        label="TOTAL FILES"
        value={String(fileCount)}
        sub="IN YOUR VAULT"
      />
      <StatCard
        label="STORAGE USED"
        value={`${storagePercent.toFixed(1)}%`}
        sub={`${formatBytes(used)} OF ${formatBytes(limit)}`}
      />
      <StatCard
        label="AI CALLS LEFT"
        value={String(aiLeft)}
        sub={aiSub}
        highlight={aiLimit !== null && aiUsed >= aiLimit}
      />
    </div>
  )
}

function StatCard({ label, value, sub, highlight }: {
  label: string
  value: string
  sub: string
  highlight?: boolean
}) {
  return (
    <PixelCard className="p-2.5 md:p-4 space-y-0.5 md:space-y-1">
      <div className="font-pixel text-[6px] md:text-[8px] text-pluit-blue/45 tracking-widest leading-tight">{label}</div>
      <div className={cn(
        'font-pixel text-base md:text-2xl leading-tight',
        highlight ? 'text-red-400' : 'text-pluit-blue'
      )}>
        {value}
      </div>
      <div className="font-pixel text-[6px] md:text-[8px] text-pluit-blue/35 leading-tight truncate">{sub}</div>
    </PixelCard>
  )
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>('vault')
  const [searchQuery, setSearchQuery] = useState('')
  const { refresh } = useFiles(null)
  const { results, isSearching, hasQuery } = useSearch(searchQuery)

  return (
    <div className="space-y-4">
      {/* Stats Bar */}
      <VaultStats />

      {/* Tabs */}
      <div className="flex items-center gap-3 md:gap-6 border-b-2 border-pluit-blue/30 pb-3">
        <button onClick={() => setTab('vault')}
          className={cn('font-sans text-xs md:text-sm pixel-tab pb-1', tab === 'vault' ? 'pixel-tab-active' : 'text-pluit-blue/60 hover:text-pluit-blue')}>
          MY VAULT
        </button>
        <button onClick={() => setTab('ai')}
          className={cn('font-sans text-xs md:text-sm pixel-tab pb-1', tab === 'ai' ? 'pixel-tab-active' : 'text-pluit-blue/60 hover:text-pluit-blue')}>
          ASK PLUIT
        </button>
        <button onClick={() => setTab('trash')}
          className={cn('font-sans text-xs md:text-sm pixel-tab pb-1', tab === 'trash' ? 'pixel-tab-active' : 'text-pluit-blue/60 hover:text-pluit-blue')}>
          TRASH BIN
        </button>
      </div>

      {tab === 'vault' && (
        <>
          <PixelCard className="p-4">
            <UploadZone folderId={null} onUploadComplete={refresh} />
          </PixelCard>

          <PixelSearch
            value={searchQuery}
            onChange={setSearchQuery}
            resultCount={results.length}
            isSearching={isSearching}
          />

          <PixelCard className="p-4">
            {hasQuery
              ? <SearchResults results={results} isSearching={isSearching} query={searchQuery} onRefresh={refresh} />
              : <FileBrowser showTrash={false} />
            }
          </PixelCard>
        </>
      )}

      {tab === 'trash' && (
        <PixelCard className="p-4">
          <FileBrowser showTrash={true} />
        </PixelCard>
      )}

      {tab === 'ai' && (
        <PixelCard className="p-4">
          <AskTheVault />
        </PixelCard>
      )}
    </div>
  )
}

// ─── Search Results ───────────────────────────────────────────────────────────

function SearchResults({ results, isSearching, query, onRefresh }: {
  results: FileRecord[]
  isSearching: boolean
  query: string
  onRefresh: () => void
}) {
  const handleDownload = async (file: FileRecord) => {
    const res = await fetch('/api/files/download-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId: file.id }),
    })
    const { downloadUrl } = await res.json()
    window.open(downloadUrl, '_blank')
  }

  const handleDelete = async (fileId: string) => {
    await fetch('/api/files/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId }),
    })
    onRefresh()
  }

  if (isSearching) {
    return <div className="font-pixel text-xs text-pluit-blue animate-pulse py-4">SEARCHING...</div>
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12 font-pixel text-pluit-blue/40 text-xs">
        NO FILES MATCHING &quot;{query.toUpperCase()}&quot;
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="font-pixel text-xs text-pluit-blue/40 pb-1">
        SEARCH RESULTS FOR &quot;{query.toUpperCase()}&quot;
      </div>
      {results.map((file, idx) => (
        <div
          key={file.id}
          className="vault-file-row vault-row-animate bg-pluit-panel border-2 border-pluit-blue/30 flex items-center justify-between p-3"
          style={{ animationDelay: `${idx * 40}ms` }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <FileIcon mimeType={file.mime_type} size="md" />
            <div className="min-w-0">
              <div className="font-pixel text-xs text-pluit-blue truncate">
                <HighlightMatch text={file.name} query={query} />
              </div>
              <div className="text-xs text-pluit-blue/50 mt-0.5">{formatBytes(file.size_bytes)}</div>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <PixelButton variant="secondary" className="text-xs py-1" onClick={() => handleDownload(file)}>
              SAVE
            </PixelButton>
            <PixelButton variant="danger" className="text-xs py-1" onClick={() => handleDelete(file.id)}>
              DEL
            </PixelButton>
          </div>
        </div>
      ))}
    </div>
  )
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <span>{text}</span>
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-white bg-pluit-blue/30 px-0.5">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  )
}
