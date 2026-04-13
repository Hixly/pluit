'use client'
import { useState } from 'react'
import { UploadZone } from '@/components/files/upload-zone'
import { FileBrowser } from '@/components/files/file-browser'
import { PixelCard } from '@/components/ui/pixel-card'
import { useFiles } from '@/hooks/use-files'

export default function DashboardPage() {
  const [showTrash, setShowTrash] = useState(false)
  const { refresh } = useFiles(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-pixel text-pluit-blue text-sm">
          {showTrash ? 'TRASH BIN' : 'MY VAULT'}
        </h1>
        <button onClick={() => setShowTrash(t => !t)}
          className="font-pixel text-xs text-pluit-blue/60 hover:text-pluit-blue">
          {showTrash ? 'BACK TO VAULT' : '🗑 TRASH'}
        </button>
      </div>
      {!showTrash && (
        <PixelCard className="p-4">
          <UploadZone folderId={null} onUploadComplete={refresh} />
        </PixelCard>
      )}
      <PixelCard className="p-4">
        <FileBrowser showTrash={showTrash} />
      </PixelCard>
    </div>
  )
}
