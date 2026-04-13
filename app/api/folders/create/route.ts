import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, parentFolderId } = await request.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Folder name required' }, { status: 400 })

  const { data: folder, error } = await supabase
    .from('folders')
    .insert({ user_id: user.id, name: name.trim(), parent_folder_id: parentFolderId ?? null })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ folder })
}
