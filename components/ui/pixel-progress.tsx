import { cn } from '@/lib/utils'
import { formatBytes } from '@/lib/utils'

interface PixelProgressProps {
  used: number
  limit: number
  className?: string
}

export function PixelProgress({ used, limit, className }: PixelProgressProps) {
  const percent = Math.min((used / limit) * 100, 100)
  const isWarning = percent > 80
  const isDanger = percent > 95

  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between text-xs text-pluit-blue font-pixel mb-2">
        <span>{formatBytes(used)}</span>
        <span>{formatBytes(limit)}</span>
      </div>
      <div className="w-full h-4 bg-pluit-bg border-2 border-pluit-blue">
        <div
          className={cn(
            'h-full transition-all duration-300',
            isDanger ? 'bg-red-500' : isWarning ? 'bg-pluit-gold' : 'bg-pluit-blue'
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="text-right text-xs text-pluit-blue/60 mt-1">
        {percent.toFixed(1)}% used
      </div>
    </div>
  )
}
