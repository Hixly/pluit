import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
}

export const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant = 'primary', children, ...props }, ref) => {
    const variants = {
      primary: 'bg-pluit-blue text-pluit-bg border-pluit-cyan hover:bg-pluit-cyan',
      secondary: 'bg-transparent text-pluit-blue border-pluit-blue hover:bg-pluit-panel',
      danger: 'bg-red-600 text-white border-red-400 hover:bg-red-500',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'font-pixel text-xs px-4 py-2 border-2 transition-all duration-75',
          'pixel-press pixel-glow cursor-pointer',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
PixelButton.displayName = 'PixelButton'
