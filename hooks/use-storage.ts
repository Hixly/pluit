'use client'
import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import { PLAN_STORAGE_BYTES } from '@/types'
import type { PlanTier } from '@/types'

const supabase = createClient()

async function fetchStorage() {
  const { data } = await supabase
    .from('profiles')
    .select('storage_used_bytes, plan_tier')
    .single()
  return data
}

export function useStorage() {
  const { data, error, isLoading } = useSWR('storage', fetchStorage)
  const used = data?.storage_used_bytes ?? 0
  const tier = (data?.plan_tier ?? 'free') as PlanTier
  const limit = PLAN_STORAGE_BYTES[tier]
  const percentUsed = Math.min((used / limit) * 100, 100)
  return { used, limit, tier, percentUsed, isLoading, error }
}
