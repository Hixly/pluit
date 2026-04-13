import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getDownloadUrl } from '@/lib/wasabi/client'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { fileId } = await request.json()
  if (!fileId) return NextResponse.json({ error: 'Missing fileId' }, { status: 400 })

  const { data: file } = await supabase
    .from('files')
    .select('wasabi_key, user_id')
    .eq('id', fileId)
    .eq('user_id', user.id)
    .single()

  if (!file) return NextResponse.json({ error: 'File not found' }, { status: 404 })

  await supabase.from('files').update({ last_accessed_at: new Date().toISOString() }).eq('id', fileId)
  const downloadUrl = await getDownloadUrl(file.wasabi_key)
  return NextResponse.json({ downloadUrl })
}
