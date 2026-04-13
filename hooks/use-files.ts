'use client'
import useSWR, { mutate } from 'swr'
import { createClient } from '@/lib/supabase/client'
import type { FileRecord, Folder } from '@/types'

const supabase = createClient()

async function fetchVault(folderId: string | null, showTrash: boolean) {
  const filesQuery = supabase
    .from('files')
    .select('*')
    .order('created_at', { ascending: false })

  if (showTrash) {
    filesQuery.not('deleted_at', 'is', null)
  } else {
    filesQuery.is('deleted_at', null)
    if (folderId) {
      filesQuery.eq('folder_id', folderId)
    } else {
      filesQuery.is('folder_id', null)
    }
  }

  const foldersQuery = supabase
    .from('folders')
    .select('*')
    .eq('parent_folder_id', folderId ?? null)
    .order('name')

  const [{ data: files }, { data: folders }] = await Promise.all([
    filesQuery,
    showTrash ? { data: [] } : foldersQuery,
  ])

  return { files: (files ?? []) as FileRecord[], folders: (folders ?? []) as Folder[] }
}

export function useFiles(folderId: string | null = null, showTrash = false) {
  const key = `vault:${folderId}:${showTrash}`
  const { data, error, isLoading } = useSWR(key, () => fetchVault(folderId, showTrash))

  return {
    files: data?.files ?? [],
    folders: data?.folders ?? [],
    isLoading,
    error,
    refresh: () => mutate(key),
  }
}
