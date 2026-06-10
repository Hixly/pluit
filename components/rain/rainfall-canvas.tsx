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

    const PIXEL_SIZE = 2
    const PIXEL_GAP = 8
    const SPEED = 6

    let drops: number[] = []
    let animId: number

    const init = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const cols = Math.ceil(window.innerWidth / PIXEL_GAP) + 2
      // keep existing drops, only add new ones if screen got wider
      while (drops.length < cols) {
        drops.push(Math.random() * -canvas.height)
      }
      drops = drops.slice(0, cols)
    }

    init()
    window.addEventListener('resize', init)

    function draw() {
      if (!ctx || !canvas) return
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < drops.length; i++) {
        const x = i * PIXEL_GAP
        const y = drops[i]

        ctx.fillStyle = '#ffffff'
        ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE)

        ctx.fillStyle = '#89CFF0'
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
      window.removeEventListener('resize', init)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none"
      style={{ zIndex: 0, opacity }}
    />
  )
}
