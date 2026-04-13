import { getMimeCategory } from '@/lib/utils'
import { cn } from '@/lib/utils'

const ICONS: Record<string, string> = {
  image:       '🖼',
  pdf:         '📄',
  text:        '📝',
  audio:       '🎵',
  video:       '🎬',
  spreadsheet: '📊',
  document:    '📃',
  archive:     '📦',
  folder:      '📁',
  other:       '📎',
}

interface FileIconProps {
  mimeType?: string
  isFolder?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function FileIcon({ mimeType, isFolder, size = 'md', className }: FileIconProps) {
  const category = isFolder ? 'folder' : (mimeType ? getMimeCategory(mimeType) : 'other')
  const icon = ICONS[category]

  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  }

  return (
    <span
      className={cn('inline-block leading-none select-none', sizes[size], className)}
      style={{ imageRendering: 'pixelated' }}
      title={category}
    >
      {icon}
    </span>
  )
}
