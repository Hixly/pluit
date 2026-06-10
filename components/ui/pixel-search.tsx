'use client'

interface PixelSearchProps {
  value: string
  onChange: (v: string) => void
  resultCount?: number
  isSearching?: boolean
}

export function PixelSearch({ value, onChange, resultCount, isSearching }: PixelSearchProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        {/* Pixel magnifier icon */}
        <svg
          width="14" height="14"
          viewBox="0 0 8 8"
          shapeRendering="crispEdges"
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        >
          <rect x="2" y="0" width="1" height="1" fill="#89CFF0" />
          <rect x="3" y="0" width="1" height="1" fill="#89CFF0" />
          <rect x="1" y="1" width="1" height="1" fill="#89CFF0" />
          <rect x="4" y="1" width="1" height="1" fill="#89CFF0" />
          <rect x="1" y="2" width="1" height="1" fill="#89CFF0" />
          <rect x="4" y="2" width="1" height="1" fill="#89CFF0" />
          <rect x="2" y="3" width="1" height="1" fill="#89CFF0" />
          <rect x="3" y="3" width="1" height="1" fill="#89CFF0" />
          <rect x="4" y="4" width="1" height="1" fill="#89CFF0" />
          <rect x="5" y="5" width="1" height="1" fill="#89CFF0" />
          <rect x="6" y="6" width="1" height="1" fill="#89CFF0" />
        </svg>

        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="SEARCH VAULT..."
          className="w-full bg-pluit-bg border-2 border-pluit-blue/50 hover:border-pluit-blue focus:border-pluit-cyan pl-8 pr-4 py-2 font-pixel text-xs text-white placeholder:text-pluit-blue/30 outline-none transition-colors"
        />

        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 font-pixel text-xs text-pluit-blue/50 hover:text-pluit-blue"
          >
            ×
          </button>
        )}
      </div>

      {value.trim() && (
        <span className="font-pixel text-xs text-pluit-blue/50 shrink-0 whitespace-nowrap">
          {isSearching ? 'SEARCHING...' : `${resultCount ?? 0} FOUND`}
        </span>
      )}
    </div>
  )
}
