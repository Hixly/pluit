'use client'
import { useEffect, useState } from 'react'
import { PixelButton } from '@/components/ui/pixel-button'
import { PixelCard } from '@/components/ui/pixel-card'

interface FilePreviewModalProps {
  fileId: string
  fileName: string
  mimeType: string
  onClose: () => void
}

export function FilePreviewModal({ fileId, fileName, mimeType, onClose }: FilePreviewModalProps) {
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/files/download-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId }),
    })
      .then(r => r.json())
      .then(({ downloadUrl }) => { setUrl(downloadUrl); setLoading(false) })
  }, [fileId])

  const isImage = mimeType.startsWith('image/')
  const isPdf = mimeType === 'application/pdf'
  const isText = mimeType.startsWith('text/')

  return (
    <div className="fixed inset-0 bg-pluit-bg/90 flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      <PixelCard className="w-full max-w-3xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b-2 border-pluit-blue shrink-0">
          <span className="font-pixel text-xs text-pluit-blue truncate">{fileName}</span>
          <PixelButton variant="secondary" onClick={onClose} className="text-xs py-1 ml-4">CLOSE</PixelButton>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {loading && <div className="font-pixel text-pluit-blue text-xs text-center py-8 animate-pulse">LOADING...</div>}
          {!loading && url && isImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={fileName} className="max-w-full mx-auto" />
          )}
          {!loading && url && isPdf && (
            <iframe src={url} className="w-full h-[60vh]" title={fileName} />
          )}
          {!loading && url && isText && <TextPreview url={url} />}
          {!loading && !isImage && !isPdf && !isText && (
            <div className="text-center py-8 space-y-4">
              <p className="font-pixel text-xs text-pluit-blue/60">PREVIEW NOT AVAILABLE</p>
              {url && <a href={url} download={fileName}><PixelButton>DOWNLOAD FILE</PixelButton></a>}
            </div>
          )}
        </div>
      </PixelCard>
    </div>
  )
}

function TextPreview({ url }: { url: string }) {
  const [text, setText] = useState<string | null>(null)
  useEffect(() => { fetch(url).then(r => r.text()).then(setText) }, [url])
  if (!text) return <div className="font-pixel text-xs text-pluit-blue/60 text-center py-8 animate-pulse">LOADING...</div>
  return <pre className="text-xs text-pluit-blue/80 whitespace-pre-wrap break-words font-mono">{text}</pre>
}
