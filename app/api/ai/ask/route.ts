import { convertToModelMessages, streamText, UIMessage } from 'ai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 60

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(req: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan_tier, ai_calls_used_this_month')
    .eq('id', user.id)
    .single()

  if (profile?.plan_tier === 'free' && (profile?.ai_calls_used_this_month ?? 0) >= 10) {
    return new Response(
      JSON.stringify({ error: 'AI call limit reached. Upgrade to continue.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const { data: files } = await supabase
    .from('files')
    .select('id, name, mime_type, size_bytes, ai_tags, created_at')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(50)

  const { messages }: { messages: UIMessage[] } = await req.json()

  const fileContext = files && files.length > 0
    ? `The user has ${files.length} file(s) in their vault:\n` +
      files.map(f =>
        `- "${f.name}" (${f.mime_type}, ${(f.size_bytes / 1024).toFixed(1)} KB${f.ai_tags?.length ? `, tags: ${f.ai_tags.join(', ')}` : ''})`
      ).join('\n')
    : 'The user currently has no files in their vault.'

  const systemPrompt = `You are VAULT AI, the intelligent assistant for Pluit.cloud — an 8-bit themed cloud storage platform.
You help users find, understand, and manage their stored files.
${fileContext}
Guidelines:
- Be concise and helpful. Use a slightly retro/techy tone.
- When referencing files, use their exact names.
- If asked to search for files, scan the list above and report matches.
- Keep responses focused. No fluff.`

  supabase
    .from('profiles')
    .update({ ai_calls_used_this_month: (profile?.ai_calls_used_this_month ?? 0) + 1 })
    .eq('id', user.id)
    .then(() => {})

  const result = streamText({
    model: anthropic('claude-sonnet-4-5'),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
