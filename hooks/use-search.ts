'use client'
import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import type { FileRecord } from '@/types'

const supabase = createClient()

async function searchFiles(query: string): Promise<FileRecord[]> {
  const { data } = await supabase
    .from('files')
    .select('*')
    .is('deleted_at', null)
    .ilike('name', `%${query}%`)
    .order('created_at', { ascending: false })
    .limit(50)
  return (data ?? []) as FileRecord[]
}

export function useSearch(query: string) {
  const trimmed = query.trim()
  const { data, isLoading } = useSWR(
    trimmed.length > 0 ? `search:${trimmed}` : null,
    () => searchFiles(trimmed),
    { keepPreviousData: true }
  )
  return {
    results: data ?? [],
    isSearching: isLoading,
    hasQuery: trimmed.length > 0,
  }
}
