'use client'
import { useEffect, useRef } from 'react'

interface RainfallCanvasProps {
  opacity?: number
}

export function RainfallCanvas({ opacity = 0.25 }: RainfallCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const PIXEL_SIZE = 2
    const PIXEL_GAP = 8
    const SPEED = 6
    const cols = Math.ceil(window.innerWidth / PIXEL_GAP)
    const drops: number[] = Array.from({ length: cols }, () =>
      Math.random() * -canvas.height
    )

    let animId: number

    function draw() {
      if (!ctx || !canvas) return
      ctx.fillStyle = 'rgba(10, 14, 26, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < drops.length; i++) {
        const x = i * PIXEL_GAP
        const y = drops[i]

        ctx.fillStyle = '#00ffff'
        ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE)

        ctx.fillStyle = '#00bfff'
        ctx.fillRect(x, y + PIXEL_SIZE * 2, PIXEL_SIZE, PIXEL_SIZE * 3)

        if (drops[i] > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i] += SPEED
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity }}
    />
  )
}
