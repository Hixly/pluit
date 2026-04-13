import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { folderId } = await request.json()
  if (!folderId) return NextResponse.json({ error: 'folderId required' }, { status: 400 })

  await supabase.from('files').update({ folder_id: null }).eq('folder_id', folderId).eq('user_id', user.id)

  const { error } = await supabase.from('folders').delete().eq('id', folderId).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
