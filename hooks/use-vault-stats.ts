'use client'
import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import { PLAN_AI_CALLS_LIMIT } from '@/types'
import type { PlanTier } from '@/types'

const supabase = createClient()

async function fetchVaultStats() {
  const [countRes, profileRes] = await Promise.all([
    supabase
      .from('files')
      .select('id', { count: 'exact', head: true })
      .is('deleted_at', null),
    supabase
      .from('profiles')
      .select('ai_calls_used_this_month, plan_tier')
      .single(),
  ])
  const tier = (profileRes.data?.plan_tier ?? 'free') as PlanTier
  const aiUsed = profileRes.data?.ai_calls_used_this_month ?? 0
  const aiLimit = PLAN_AI_CALLS_LIMIT[tier]
  return {
    fileCount: countRes.count ?? 0,
    aiUsed,
    aiLimit,
    tier,
  }
}

export function useVaultStats() {
  const { data, isLoading } = useSWR('vault-stats', fetchVaultStats)
  return {
    fileCount: data?.fileCount ?? 0,
    aiUsed: data?.aiUsed ?? 0,
    aiLimit: data?.aiLimit ?? 10,
    tier: (data?.tier ?? 'free') as PlanTier,
    isLoading,
  }
}
