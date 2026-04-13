'use client'
import { useStorage } from '@/hooks/use-storage'
import { PixelCard } from '@/components/ui/pixel-card'
import { PixelProgress } from '@/components/ui/pixel-progress'
import { PixelButton } from '@/components/ui/pixel-button'

export function StorageSidebar() {
  const { used, limit, tier, isLoading } = useStorage()
  if (isLoading) return null

  return (
    <PixelCard className="p-4 space-y-4">
      <div className="font-pixel text-xs text-pluit-blue">STORAGE</div>
      <PixelProgress used={used} limit={limit} />
      <div className="font-pixel text-xs text-pluit-gold uppercase text-center">
        {tier} PLAN
      </div>
      {tier === 'free' && (
        <PixelButton variant="primary" className="w-full text-xs">
          UPGRADE
        </PixelButton>
      )}
    </PixelCard>
  )
}
