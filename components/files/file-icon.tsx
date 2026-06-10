'use client'
import { getMimeCategory } from '@/lib/utils'
import { cn } from '@/lib/utils'

// Pixel grid: 8 cols × 8 rows, P=3 → viewBox 24×24
const P = 3
type Px = [number, number]

function PixelIcon({
  pixels,
  color = '#89CFF0',
  accent,
  svgSize,
}: {
  pixels: Px[]
  color?: string
  accent?: { pixels: Px[]; color: string }[]
  svgSize: number
}) {
  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox="0 0 24 24"
      shapeRendering="crispEdges"
    >
      {pixels.map(([x, y], i) => (
        <rect key={i} x={x * P} y={y * P} width={P} height={P} fill={color} />
      ))}
      {accent?.map(({ pixels: ap, color: ac }, gi) =>
        ap.map(([x, y], i) => (
          <rect key={`${gi}-${i}`} x={x * P} y={y * P} width={P} height={P} fill={ac} />
        ))
      )}
    </svg>
  )
}

// ─── Document outline (shared by file/text/doc/other) ───────────────────────
const DOC_OUTLINE: Px[] = [
  [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],          // top (no fold corner)
  [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],    // left
  [1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],    // bottom
  [7,2],[7,3],[7,4],[7,5],[7,6],                 // right (starts at row 2)
  [6,0],[6,1],[7,1],                             // fold corner mark
]
const DOC_LINES: Px[] = [
  [1,3],[2,3],[3,3],[4,3],[5,3],[6,3],
  [1,5],[2,5],[3,5],[4,5],[5,5],[6,5],
]

// ─── Folder ─────────────────────────────────────────────────────────────────
const FOLDER: Px[] = [
  [0,0],[1,0],[2,0],[3,0],                      // tab
  [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],
  [0,2],[7,2],[0,3],[7,3],[0,4],[7,4],
  [0,5],[7,5],[0,6],[7,6],
  [0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],
]

// ─── Image (frame + mountain) ───────────────────────────────────────────────
const IMG_FRAME: Px[] = [
  [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],
  [0,1],[7,1],[0,2],[7,2],[0,3],[7,3],
  [0,4],[7,4],[0,5],[7,5],[0,6],[7,6],
  [0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],
]
const IMG_CONTENT: Px[] = [
  [5,2],                                        // sun
  [2,5],[3,4],[4,5],[5,5],[6,5],               // mountain
]

// ─── Audio (musical note) ───────────────────────────────────────────────────
const AUDIO: Px[] = [
  [3,0],[4,0],[5,0],[6,0],                      // flag top
  [6,1],[6,2],[6,3],                            // stem
  [4,3],[5,3],                                  // head top
  [3,4],[4,4],[5,4],
  [3,5],[5,5],
  [3,6],[4,6],[5,6],                            // head bottom
]

// ─── Video (film strip with play triangle) ──────────────────────────────────
const VIDEO_FRAME: Px[] = [
  [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],
  [0,1],[2,1],[5,1],[7,1],
  [0,2],[7,2],[0,3],[7,3],[0,4],[7,4],
  [0,5],[7,5],[0,6],[2,6],[5,6],[7,6],
  [0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],
]
const VIDEO_PLAY: Px[] = [
  [2,2],[2,3],[2,4],[2,5],
  [3,3],[3,4],
  [4,3],[4,4],
  [5,3],
]

// ─── Archive (box with stripe) ──────────────────────────────────────────────
const ARCHIVE: Px[] = [
  [1,0],[2,0],[3,0],[4,0],[5,0],[6,0],
  [0,1],[7,1],
  [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],
  [0,3],[7,3],[0,4],[7,4],[0,5],[7,5],[0,6],[7,6],
  [0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],
]
const ARCHIVE_STRIPE: Px[] = [
  [3,1],[4,1],[3,2],[4,2],
]

// ─── Spreadsheet (grid) ─────────────────────────────────────────────────────
const SHEET: Px[] = [
  [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],
  [0,1],[7,1],[0,2],[7,2],
  [2,1],[2,2],[2,3],[2,4],[2,5],[2,6],           // col divider
  [5,1],[5,2],[5,3],[5,4],[5,5],[5,6],           // col divider
  [0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],
  [0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],
  [0,4],[7,4],[0,6],[7,6],
  [0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],
]

interface FileIconProps {
  mimeType?: string
  isFolder?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function FileIcon({ mimeType, isFolder, size = 'md', className }: FileIconProps) {
  const category = isFolder ? 'folder' : (mimeType ? getMimeCategory(mimeType) : 'other')

  const svgSize = { sm: 16, md: 24, lg: 32 }[size]

  const icon = (() => {
    switch (category) {
      case 'folder':
        return <PixelIcon pixels={FOLDER} color="#89CFF0" svgSize={svgSize} />
      case 'image':
        return <PixelIcon pixels={IMG_FRAME} color="#89CFF0" svgSize={svgSize}
          accent={[{ pixels: IMG_CONTENT, color: '#ffffff' }]} />
      case 'audio':
        return <PixelIcon pixels={AUDIO} color="#89CFF0" svgSize={svgSize} />
      case 'video':
        return <PixelIcon pixels={VIDEO_FRAME} color="#89CFF0" svgSize={svgSize}
          accent={[{ pixels: VIDEO_PLAY, color: '#ffffff' }]} />
      case 'archive':
        return <PixelIcon pixels={ARCHIVE} color="#89CFF0" svgSize={svgSize}
          accent={[{ pixels: ARCHIVE_STRIPE, color: '#ffffff' }]} />
      case 'spreadsheet':
        return <PixelIcon pixels={SHEET} color="#89CFF0" svgSize={svgSize} />
      default:
        return <PixelIcon pixels={DOC_OUTLINE} color="#89CFF0" svgSize={svgSize}
          accent={[{ pixels: DOC_LINES, color: '#ffffff' }]} />
    }
  })()

  return (
    <span className={cn('inline-block leading-none select-none', className)} title={category}>
      {icon}
    </span>
  )
}
