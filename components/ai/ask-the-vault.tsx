'use client'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState, useRef, useEffect } from 'react'
import { PixelCard } from '@/components/ui/pixel-card'
import { PixelButton } from '@/components/ui/pixel-button'

export function AskTheVault() {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/ai/ask' }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-pluit-blue pixel-blink" />
        <span className="font-pixel text-xs text-pluit-blue">ASK PLUIT — ONLINE</span>
      </div>

      {/* Message History */}
      <PixelCard className="p-4 min-h-64 max-h-96 overflow-y-auto flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
            <div className="font-pixel text-pluit-blue text-xs leading-relaxed">
              ASK ANYTHING ABOUT YOUR FILES
            </div>
            <div className="text-pluit-blue/40 text-xs font-pixel leading-relaxed space-y-1">
              <p>&gt; &quot;What files do I have?&quot;</p>
              <p>&gt; &quot;Find my PDFs&quot;</p>
              <p>&gt; &quot;How much storage am I using?&quot;</p>
            </div>
          </div>
        )}

        {messages.map(message => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <span className="font-pixel text-xs text-pluit-blue/50 shrink-0 mt-0.5">PLUIT&gt;</span>
            )}
            <div
              className={`max-w-[80%] px-3 py-2 text-xs leading-relaxed border-2 ${
                message.role === 'user'
                  ? 'bg-pluit-blue text-black border-pluit-cyan font-pixel'
                  : 'bg-pluit-panel text-white border-pluit-blue/40 font-sans'
              }`}
            >
              {message.parts.map((part, i) =>
                part.type === 'text' ? (
                  <span key={i} className="whitespace-pre-wrap">{part.text}</span>
                ) : null
              )}
            </div>
            {message.role === 'user' && (
              <span className="font-pixel text-xs text-pluit-blue/50 shrink-0 mt-0.5">&lt;U</span>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2 justify-start">
            <span className="font-pixel text-xs text-pluit-blue/50 shrink-0 mt-0.5">PLUIT&gt;</span>
            <div className="px-3 py-2 border-2 border-pluit-blue/40 bg-pluit-panel">
              <span className="font-pixel text-xs text-pluit-blue">
                PROCESSING
                <span className="pixel-blink">_</span>
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="font-pixel text-xs text-red-400 border-2 border-red-400/40 px-3 py-2">
            ⚠ {error.message || 'Connection error. Try again.'}
          </div>
        )}

        <div ref={bottomRef} />
      </PixelCard>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={isLoading}
          placeholder="ASK PLUIT..."
          className="flex-1 bg-pluit-bg border-2 border-pluit-blue p-2 font-pixel text-xs text-white placeholder:text-pluit-blue/30 focus:border-pluit-cyan outline-none disabled:opacity-40"
        />
        <PixelButton type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? '...' : 'SEND'}
        </PixelButton>
      </form>

      <p className="text-pluit-blue/30 font-pixel text-xs text-center">
        FREE PLAN: 10 AI CALLS/MONTH
      </p>
    </div>
  )
}
