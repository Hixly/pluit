export type PlanTier = 'free' | 'personal' | 'pro' | 'business'

export const PLAN_STORAGE_BYTES: Record<PlanTier, number> = {
  free:     5  * 1024 * 1024 * 1024,
  personal: 50 * 1024 * 1024 * 1024,
  pro:      200 * 1024 * 1024 * 1024,
  business: 1024 * 1024 * 1024 * 1024,
}

export const PLAN_UPLOAD_LIMIT_BYTES: Record<PlanTier, number> = {
  free:     250 * 1024 * 1024,
  personal: 2   * 1024 * 1024 * 1024,
  pro:      10  * 1024 * 1024 * 1024,
  business: 50  * 1024 * 1024 * 1024,
}

export const PLAN_AI_CALLS_LIMIT: Record<PlanTier, number | null> = {
  free:     10,
  personal: null,
  pro:      null,
  business: null,
}

export interface Profile {
  id: string
  email: string
  plan_tier: PlanTier
  storage_used_bytes: number
  ai_calls_used_this_month: number
  created_at: string
}

export interface Folder {
  id: string
  user_id: string
  name: string
  parent_folder_id: string | null
  created_at: string
}

export interface FileRecord {
  id: string
  user_id: string
  folder_id: string | null
  name: string
  size_bytes: number
  mime_type: string
  wasabi_key: string
  ai_tags: string[]
  deleted_at: string | null
  created_at: string
  last_accessed_at: string | null
}

export type MimeCategory = 'image' | 'pdf' | 'text' | 'audio' | 'video' | 'spreadsheet' | 'document' | 'archive' | 'other'
