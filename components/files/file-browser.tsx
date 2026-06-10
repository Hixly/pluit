'use client'
import { useState, useRef, useEffect } from 'react'
import { useFiles } from '@/hooks/use-files'
import { FileIcon } from './file-icon'
import { PixelButton } from '@/components/ui/pixel-button'
import { FilePreviewModal } from './file-preview-modal'
import { formatBytes } from '@/lib/utils'
import type { FileRecord, Folder } from '@/types'

interface FileBrowserProps {
  showTrash?: boolean
}

type SortKey = 'name' | 'date' | 'size'

export function FileBrowser({ showTrash = false }: FileBrowserProps) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string; name: string }[]>([])
  const [preview, setPreview] = useState<{ id: string; name: string; mimeType: string } | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortAsc, setSortAsc] = useState(false)
  const [creatingFolder, setCreatingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const folderInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (creatingFolder) folderInputRef.current?.focus()
  }, [creatingFolder])
  const { files, folders, isLoading, refresh } = useFiles(currentFolderId, showTrash)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(a => !a)
    else { setSortKey(key); setSortAsc(false) }
  }

  const sortedFiles = [...files].sort((a, b) => {
    let diff = 0
    if (sortKey === 'name') diff = a.name.localeCompare(b.name)
    else if (sortKey === 'date') diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    else diff = a.size_bytes - b.size_bytes
    return sortAsc ? diff : -diff
  })

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
    const name = newFolderName.trim()
    if (!name) return
    setCreatingFolder(false)
    setNewFolderName('')
    await fetch('/api/folders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, parentFolderId: currentFolderId }),
    })
    refresh()
  }

  const cancelCreateFolder = () => {
    setCreatingFolder(false)
    setNewFolderName('')
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

  const totalItems = folders.length + files.length

  const insideFolder = breadcrumbs.length > 0
  const currentFolderName = insideFolder ? breadcrumbs[breadcrumbs.length - 1].name : null

  return (
    <div className="space-y-3">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => navigateTo(-1)}
          className={`font-pixel text-xs hover:text-pluit-cyan transition-colors ${insideFolder ? 'text-pluit-blue/50' : 'text-pluit-blue'}`}
        >
          VAULT
        </button>
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.id} className="flex items-center gap-2">
            <span className="text-pluit-blue/30 font-pixel text-xs">›</span>
            <button
              onClick={() => navigateTo(i)}
              className={`font-pixel text-xs hover:text-pluit-cyan transition-colors ${i === breadcrumbs.length - 1 ? 'text-pluit-blue' : 'text-pluit-blue/50'}`}
            >
              {crumb.name.toUpperCase()}
            </button>
          </span>
        ))}
      </div>

      {/* Folder header when inside a folder */}
      {insideFolder && (
        <div className="flex items-center gap-2 pb-1 border-b border-pluit-blue/20">
          <span className="text-pluit-blue/40 text-sm">📁</span>
          <span className="font-pixel text-[10px] text-pluit-blue/60 tracking-widest">
            {currentFolderName?.toUpperCase()}
          </span>
          <button
            onClick={() => navigateTo(breadcrumbs.length - 2)}
            className="ml-auto font-pixel text-[9px] text-pluit-blue/40 hover:text-pluit-blue transition-colors"
          >
            ← BACK
          </button>
        </div>
      )}

      {/* Toolbar: new folder + item count + sort */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {!showTrash && !creatingFolder && (
            <PixelButton variant="secondary" onClick={() => setCreatingFolder(true)} className="text-xs shrink-0">
              + FOLDER
            </PixelButton>
          )}
          {!showTrash && creatingFolder && (
            <div className="flex items-center gap-2">
              <input
                ref={folderInputRef}
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCreateFolder(); if (e.key === 'Escape') cancelCreateFolder() }}
                placeholder="FOLDER NAME"
                className="bg-pluit-bg border-2 border-pluit-blue px-2 py-1 text-pluit-blue font-pixel text-[10px] outline-none w-32 focus:border-pluit-cyan placeholder:text-pluit-blue/30"
              />
              <PixelButton onClick={handleCreateFolder} className="text-xs py-1 px-2" disabled={!newFolderName.trim()}>
                OK
              </PixelButton>
              <PixelButton variant="secondary" onClick={cancelCreateFolder} className="text-xs py-1 px-2">
                ✕
              </PixelButton>
            </div>
          )}
          {!creatingFolder && (
            <span className="font-pixel text-[8px] text-pluit-blue/40">
              {showTrash
                ? `${files.length} ITEM${files.length !== 1 ? 'S' : ''} IN TRASH`
                : totalItems === 0
                  ? 'EMPTY'
                  : [
                      folders.length > 0 && `${folders.length} FOLDER${folders.length !== 1 ? 'S' : ''}`,
                      files.length > 0 && `${files.length} FILE${files.length !== 1 ? 'S' : ''}`,
                    ].filter(Boolean).join(' · ')
              }
            </span>
          )}
        </div>

        {/* Sort controls — vault only */}
        {!showTrash && totalItems > 0 && !creatingFolder && (
          <div className="flex gap-1 shrink-0">
            {(['name', 'date', 'size'] as SortKey[]).map(key => (
              <button
                key={key}
                onClick={() => handleSort(key)}
                className={`font-pixel text-[8px] px-2 py-1 border transition-colors ${
                  sortKey === key
                    ? 'border-pluit-blue text-pluit-blue bg-pluit-blue/10'
                    : 'border-pluit-blue/25 text-pluit-blue/40 hover:text-pluit-blue/70 hover:border-pluit-blue/50'
                }`}
              >
                {key.toUpperCase()}{sortKey === key ? (sortAsc ? ' ↑' : ' ↓') : ''}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Empty state */}
      {totalItems === 0 && (
        <div className="text-center py-16 space-y-2">
          <div className="font-pixel text-pluit-blue/40 text-xs">
            {showTrash
              ? 'TRASH IS EMPTY'
              : insideFolder
                ? `${currentFolderName?.toUpperCase()} IS EMPTY`
                : 'NO FILES YET — UPLOAD SOMETHING!'}
          </div>
          {insideFolder && !showTrash && (
            <div className="font-pixel text-pluit-blue/25 text-[9px]">
              UPLOAD FILES ABOVE TO ADD THEM HERE
            </div>
          )}
        </div>
      )}

      {/* Folders */}
      {folders.map((folder, idx) => (
        <div
          key={folder.id}
          className="vault-file-row vault-row-animate bg-pluit-panel border-2 border-pluit-blue/30 flex items-center justify-between p-3 cursor-pointer"
          style={{ animationDelay: `${idx * 40}ms` }}
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
        </div>
      ))}

      {/* Files */}
      {sortedFiles.map((file, idx) => (
        <div
          key={file.id}
          className="vault-file-row vault-row-animate bg-pluit-panel border-2 border-pluit-blue/30 flex items-center justify-between p-3"
          style={{ animationDelay: `${(folders.length + idx) * 40}ms` }}
        >
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
                  SAVE
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
        </div>
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
