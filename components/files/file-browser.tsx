'use client'
import { useState } from 'react'
import { useFiles } from '@/hooks/use-files'
import { FileIcon } from './file-icon'
import { PixelButton } from '@/components/ui/pixel-button'
import { PixelCard } from '@/components/ui/pixel-card'
import { FilePreviewModal } from './file-preview-modal'
import { formatBytes } from '@/lib/utils'
import type { FileRecord, Folder } from '@/types'

interface FileBrowserProps {
  showTrash?: boolean
}

export function FileBrowser({ showTrash = false }: FileBrowserProps) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string; name: string }[]>([])
  const [preview, setPreview] = useState<{ id: string; name: string; mimeType: string } | null>(null)
  const { files, folders, isLoading, refresh } = useFiles(currentFolderId, showTrash)

  const enterFolder = (folder: Folder) => {
    setCurrentFolderId(folder.id)
    setBreadcrumbs(b => [...b, { id: folder.id, name: folder.name }])
  }

  const navigateTo = (index: number) => {
    if (index === -1) {
      setCurrentFolderId(null)
      setBreadcrumbs([])
    } else {
      setCurrentFolderId(breadcrumbs[index].id)
      setBreadcrumbs(b => b.slice(0, index + 1))
    }
  }

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
    refresh()
  }

  const handleRestore = async (fileId: string) => {
    await fetch('/api/files/restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId }),
    })
    refresh()
  }

  const handlePurge = async (fileId: string) => {
    if (!confirm('Permanently delete? This cannot be undone.')) return
    await fetch('/api/files/purge', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId }),
    })
    refresh()
  }

  const handleCreateFolder = async () => {
    const name = prompt('Folder name:')
    if (!name?.trim()) return
    await fetch('/api/folders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, parentFolderId: currentFolderId }),
    })
    refresh()
  }

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm('Delete folder? Files inside will move to root.')) return
    await fetch('/api/folders/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folderId }),
    })
    refresh()
  }

  if (isLoading) {
    return <div className="font-pixel text-pluit-blue text-xs animate-pulse">LOADING...</div>
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 font-pixel text-xs">
        <button onClick={() => navigateTo(-1)} className="text-pluit-blue hover:text-pluit-cyan">
          VAULT
        </button>
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.id} className="flex items-center gap-2">
            <span className="text-pluit-blue/40">/</span>
            <button onClick={() => navigateTo(i)} className="text-pluit-blue hover:text-pluit-cyan">
              {crumb.name.toUpperCase()}
            </button>
          </span>
        ))}
      </div>

      {!showTrash && (
        <div className="flex gap-2">
          <PixelButton variant="secondary" onClick={handleCreateFolder} className="text-xs">
            + FOLDER
          </PixelButton>
        </div>
      )}

      {folders.length === 0 && files.length === 0 && (
        <div className="text-center py-16 font-pixel text-pluit-blue/40 text-xs">
          {showTrash ? 'TRASH IS EMPTY' : 'NO FILES YET — UPLOAD SOMETHING!'}
        </div>
      )}

      {folders.map(folder => (
        <PixelCard
          key={folder.id}
          className="flex items-center justify-between p-3 cursor-pointer hover:bg-[#1a2235]"
          onClick={() => enterFolder(folder)}
        >
          <div className="flex items-center gap-3">
            <FileIcon isFolder size="md" />
            <span className="font-pixel text-xs text-pluit-blue">{folder.name.toUpperCase()}</span>
          </div>
          <PixelButton
            variant="danger"
            className="text-xs py-1"
            onClick={e => { e.stopPropagation(); handleDeleteFolder(folder.id) }}
          >
            DEL
          </PixelButton>
        </PixelCard>
      ))}

      {files.map(file => (
        <PixelCard key={file.id} className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3 min-w-0">
            <FileIcon mimeType={file.mime_type} size="md" />
            <div className="min-w-0">
              <div className="font-pixel text-xs text-pluit-blue truncate">{file.name}</div>
              <div className="text-xs text-pluit-blue/50 mt-1">{formatBytes(file.size_bytes)}</div>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {!showTrash && (
              <>
                <PixelButton variant="secondary" className="text-xs py-1"
                  onClick={() => setPreview({ id: file.id, name: file.name, mimeType: file.mime_type })}>
                  VIEW
                </PixelButton>
                <PixelButton variant="secondary" className="text-xs py-1" onClick={() => handleDownload(file)}>
                  DL
                </PixelButton>
                <PixelButton variant="danger" className="text-xs py-1" onClick={() => handleDelete(file.id)}>
                  DEL
                </PixelButton>
              </>
            )}
            {showTrash && (
              <>
                <PixelButton variant="secondary" className="text-xs py-1" onClick={() => handleRestore(file.id)}>
                  RESTORE
                </PixelButton>
                <PixelButton variant="danger" className="text-xs py-1" onClick={() => handlePurge(file.id)}>
                  DELETE
                </PixelButton>
              </>
            )}
          </div>
        </PixelCard>
      ))}

      {preview && (
        <FilePreviewModal
          fileId={preview.id}
          fileName={preview.name}
          mimeType={preview.mimeType}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  )
}
