import { cn } from '@/lib/utils'
import { type HTMLAttributes } from 'react'

export function PixelCard({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-pluit-panel border-2 border-pluit-blue',
        'shadow-[4px_4px_0px_rgba(137,207,240,0.2)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
