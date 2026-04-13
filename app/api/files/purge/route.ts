import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { deleteObject } from '@/lib/wasabi/client'

export async function DELETE(request: NextRequest) {
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

  await deleteObject(file.wasabi_key)
  const { error } = await supabase.from('files').delete().eq('id', fileId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
