import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUploadUrl } from '@/lib/wasabi/client'
import { getWasabiKey } from '@/lib/utils'
import { PLAN_UPLOAD_LIMIT_BYTES, PLAN_STORAGE_BYTES } from '@/types'
import type { PlanTier } from '@/types'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, mimeType, sizeBytes, folderId } = await request.json()
  if (!name || !mimeType || !sizeBytes) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan_tier, storage_used_bytes')
    .eq('id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const tier = profile.plan_tier as PlanTier
  if (sizeBytes > PLAN_UPLOAD_LIMIT_BYTES[tier]) {
    return NextResponse.json({ error: 'File exceeds upload limit for your plan' }, { status: 413 })
  }
  if (profile.storage_used_bytes + sizeBytes > PLAN_STORAGE_BYTES[tier]) {
    return NextResponse.json({ error: 'Storage limit reached' }, { status: 413 })
  }

  const wasabiKey = getWasabiKey(user.id, folderId ?? null, name)
  const uploadUrl = await getUploadUrl(wasabiKey, mimeType, sizeBytes)

  const { data: fileRecord, error } = await supabase
    .from('files')
    .insert({ user_id: user.id, folder_id: folderId ?? null, name, size_bytes: sizeBytes, mime_type: mimeType, wasabi_key: wasabiKey })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ uploadUrl, file: fileRecord })
}
