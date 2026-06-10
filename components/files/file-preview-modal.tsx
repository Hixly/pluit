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
  const isVideo = mimeType.startsWith('video/')
  const isAudio = mimeType.startsWith('audio/')
  const canPreview = isImage || isPdf || isText || isVideo || isAudio

  return (
    <div className="fixed inset-0 bg-pluit-bg/90 flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      <PixelCard className="w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-3 md:p-4 border-b-2 border-pluit-blue shrink-0">
          <span className="font-pixel text-[10px] md:text-xs text-pluit-blue truncate mr-2">{fileName}</span>
          <div className="flex gap-2 shrink-0">
            {url && (
              <a href={url} target="_blank" rel="noreferrer">
                <PixelButton variant="secondary" className="text-xs py-1">SAVE</PixelButton>
              </a>
            )}
            <PixelButton variant="secondary" onClick={onClose} className="text-xs py-1">CLOSE</PixelButton>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 min-h-0">
          {loading && <div className="font-pixel text-pluit-blue text-xs text-center py-8 animate-pulse">LOADING...</div>}
          {!loading && url && isImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={fileName} className="max-w-full mx-auto" />
          )}
          {!loading && url && isPdf && (
            <iframe src={url} className="w-full h-[60vh]" title={fileName} />
          )}
          {!loading && url && isText && <TextPreview url={url} />}
          {!loading && url && isVideo && (
            <video src={url} controls className="w-full max-h-[60vh] mx-auto">
              Your browser does not support video playback.
            </video>
          )}
          {!loading && url && isAudio && (
            <div className="flex flex-col items-center gap-6 py-8">
              <div className="font-pixel text-pluit-blue/40 text-[10px] tracking-widest">NOW PLAYING</div>
              <div className="font-pixel text-pluit-blue text-xs text-center px-4">{fileName}</div>
              <audio src={url} controls className="w-full max-w-md" />
            </div>
          )}
          {!loading && !canPreview && (
            <div className="text-center py-8 space-y-4">
              <p className="font-pixel text-xs text-pluit-blue/60">PREVIEW NOT AVAILABLE</p>
              <p className="font-pixel text-[9px] text-pluit-blue/30">{mimeType}</p>
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
