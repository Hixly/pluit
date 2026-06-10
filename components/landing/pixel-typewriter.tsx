'use client'
import { useState, useEffect } from 'react'

interface PixelTypewriterProps {
  text: string
  speed?: number
  className?: string
  cursorChar?: string
}

export function PixelTypewriter({ text, speed = 70, className, cursorChar = '_' }: PixelTypewriterProps) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (displayed.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1))
      }, speed)
      return () => clearTimeout(timer)
    } else {
      setDone(true)
    }
  }, [displayed, text, speed])

  return (
    <span className={className}>
      {displayed}
      <span className={done ? 'pixel-blink' : ''}>{cursorChar}</span>
    </span>
  )
}
