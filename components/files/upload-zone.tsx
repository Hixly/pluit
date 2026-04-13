'use client'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { cn } from '@/lib/utils'

interface UploadZoneProps {
  folderId: string | null
  onUploadComplete: () => void
}

export function UploadZone({ folderId, onUploadComplete }: UploadZoneProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [errors, setErrors] = useState<string[]>([])

  const uploadFile = async (file: File) => {
    const res = await fetch('/api/files/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: file.name,
        mimeType: file.type || 'application/octet-stream',
        sizeBytes: file.size,
        folderId,
      }),
    })

    if (!res.ok) {
      const { error } = await res.json()
      throw new Error(error)
    }

    const { uploadUrl } = await res.json()

    await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
    })
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    setErrors([])
    const newErrors: string[] = []

    for (const file of acceptedFiles) {
      setProgress(p => ({ ...p, [file.name]: 0 }))
      try {
        await uploadFile(file)
        setProgress(p => ({ ...p, [file.name]: 100 }))
      } catch (err) {
        newErrors.push(`${file.name}: ${err instanceof Error ? err.message : 'Upload failed'}`)
      }
    }

    setErrors(newErrors)
    setUploading(false)
    setProgress({})
    onUploadComplete()
  }, [folderId, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed p-8 text-center cursor-pointer transition-all',
          isDragActive
            ? 'border-pluit-cyan bg-pluit-cyan/10 shadow-[0_0_20px_rgba(0,255,255,0.2)]'
            : 'border-pluit-blue/50 hover:border-pluit-blue hover:bg-pluit-panel/50'
        )}
      >
        <input {...getInputProps()} />
        <div className="text-4xl mb-3">
          {isDragActive ? '🌧' : '☁️'}
        </div>
        <p className="font-pixel text-xs text-pluit-blue">
          {isDragActive ? 'DROP TO UPLOAD' : 'DRAG FILES HERE'}
        </p>
        <p className="text-xs text-pluit-blue/50 mt-2 font-pixel">
          OR CLICK TO BROWSE
        </p>
      </div>

      {uploading && Object.entries(progress).map(([name]) => (
        <div key={name} className="text-xs text-pluit-blue/70 font-pixel">
          {name.length > 30 ? name.slice(0, 30) + '…' : name} uploading…
        </div>
      ))}

      {errors.map((err, i) => (
        <div key={i} className="text-xs text-red-400 font-pixel">⚠ {err}</div>
      ))}
    </div>
  )
}
