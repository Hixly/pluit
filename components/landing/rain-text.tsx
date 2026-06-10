'use client'
import { useEffect, useState } from 'react'

interface RainTextProps {
  text: string
  className?: string
  charDelay?: number
  repeatEvery?: number // ms between repeats
}

export function RainText({ text, className, charDelay = 65, repeatEvery = 7000 }: RainTextProps) {
  const [ready, setReady] = useState(false)
  const [cycle, setCycle] = useState(0)

  // Keep drops small enough to stay within line height — prevents baseline drift on mobile
  const [drops, setDrops] = useState<number[]>(() =>
    text.split('').map(() => 8 + Math.floor(Math.random() * 8))
  )

  // Trigger the animation on mount and after each reset
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 150)
    return () => clearTimeout(t)
  }, [cycle])

  // Once the animation has finished, wait then replay
  useEffect(() => {
    if (!ready) return
    const totalDuration = text.length * charDelay + 420 // last char finishes here
    const wait = repeatEvery - totalDuration

    const loop = setTimeout(() => {
      setReady(false)
      // Re-randomise drops so each replay looks slightly different
      setDrops(text.split('').map(() => 8 + Math.floor(Math.random() * 8)))
      // Small gap so spans go invisible before next cycle
      setTimeout(() => setCycle(c => c + 1), 80)
    }, Math.max(wait, 1000))

    return () => clearTimeout(loop)
  }, [ready, text, charDelay, repeatEvery])

  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <span
          key={`${cycle}-${i}`}
          style={{
            display: 'inline-block',
            verticalAlign: 'bottom', // anchors all chars to same baseline — prevents mid-animation height drift
            whiteSpace: char === ' ' ? 'pre' : undefined,
            ['--drop' as string]: `${drops[i]}px`,
            animation: ready
              ? `char-rain-in 0.35s steps(4, end) ${i * charDelay}ms both`
              : undefined,
            opacity: ready ? undefined : 0,
          }}
        >
          {char}
        </span>
      ))}
    </span>
  )
}
