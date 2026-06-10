'use client'
import { useEffect, useRef } from 'react'

const PX = 3          // pixel grid size
const POOL_H = 80     // canvas height in real pixels
const WAVE_Y = 18     // base Y of water surface from top of canvas

interface Splash {
  x: number
  y: number
  vy: number
  life: number
}

interface Ripple {
  x: number
  y: number
  r: number
  maxR: number
  life: number
}

export function WaterPoolCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let time = 0
    let splashes: Splash[] = []
    let ripples: Ripple[] = []
    let spawnTimer = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = POOL_H
    }
    resize()
    window.addEventListener('resize', resize)

    // Compute pixel-snapped wave surface Y at column i
    function waveAt(x: number, t: number): number {
      const raw =
        Math.sin(x * 0.012 + t * 1.1) * 5 +
        Math.sin(x * 0.027 + t * 0.7) * 3 +
        Math.sin(x * 0.006 + t * 1.9) * 2
      // snap to pixel grid
      return WAVE_Y + Math.round(raw / PX) * PX
    }

    function spawnSplash(x: number, surfY: number) {
      const count = 2 + Math.floor(Math.random() * 3)
      for (let j = 0; j < count; j++) {
        splashes.push({
          x: Math.round((x + (Math.random() - 0.5) * 12) / PX) * PX,
          y: surfY,
          vy: -(1.5 + Math.random() * 3.5),
          life: 1,
        })
      }
      ripples.push({
        x: Math.round(x / PX) * PX,
        y: surfY,
        r: 0,
        maxR: 3 + Math.floor(Math.random() * 5),
        life: 1,
      })
    }

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      time += 0.018
      spawnTimer += 1

      const W = canvas.width
      const cols = Math.ceil(W / PX)

      // ── Build surface ─────────────────────────────────────────────
      const surf: number[] = []
      for (let i = 0; i <= cols; i++) {
        surf[i] = waveAt(i * PX, time)
      }

      // ── Water body (rows below surface, darkening with depth) ─────
      for (let i = 0; i < cols; i++) {
        const x = i * PX
        const sy = surf[i]

        // Surface highlight row
        ctx.fillStyle = 'rgba(184, 223, 255, 0.75)'
        ctx.fillRect(x, sy, PX, PX)

        // Sub-surface shimmer (every 4th column, offset phase)
        if (i % 4 === Math.floor(time * 2) % 4) {
          ctx.fillStyle = 'rgba(137, 207, 240, 0.25)'
          ctx.fillRect(x, sy + PX, PX, PX)
        }

        // Water body rows with depth fade
        const bodyH = POOL_H - sy - PX
        const steps = Math.ceil(bodyH / PX)
        for (let s = 0; s < steps; s++) {
          const depth = s / steps
          const alpha = 0.35 * (1 - depth * 0.7)
          ctx.fillStyle = `rgba(30, 90, 140, ${alpha})`
          ctx.fillRect(x, sy + PX + s * PX, PX, PX)
        }
      }

      // ── Spawn splashes ────────────────────────────────────────────
      // Roughly 6-8 splash groups per second at 60fps
      if (spawnTimer % 8 === 0) {
        const n = 1 + Math.floor(Math.random() * 3)
        for (let k = 0; k < n; k++) {
          const xi = Math.floor(Math.random() * cols)
          spawnSplash(xi * PX, surf[xi])
        }
      }

      // ── Draw splash particles ─────────────────────────────────────
      splashes = splashes.filter(s => {
        s.y += s.vy
        s.vy += 0.25 // gravity
        s.life -= 0.055

        if (s.life <= 0) return false

        const sx = Math.round(s.x / PX) * PX
        const sy = Math.round(s.y / PX) * PX
        ctx.fillStyle = `rgba(184, 223, 255, ${s.life * 0.9})`
        ctx.fillRect(sx, sy, PX, PX)
        return true
      })

      // ── Draw ripples (pixel-art flattened ellipse outlines) ───────
      ripples = ripples.filter(r => {
        r.r += 0.4
        r.life -= 0.045

        if (r.life <= 0 || r.r > r.maxR) return false

        const rr = Math.round(r.r) * PX
        const ry = Math.round(rr * 0.3) // flattened
        const alpha = r.life * 0.55

        // Draw as a series of pixel-snapped border points of an ellipse
        ctx.fillStyle = `rgba(137, 207, 240, ${alpha})`
        // Top and bottom arcs (4-point pixel approximation)
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
          const ex = Math.round((r.x + Math.cos(a) * rr) / PX) * PX
          const ey = Math.round((r.y + Math.sin(a) * ry) / PX) * PX
          ctx.fillRect(ex, ey, PX, PX)
        }
        return true
      })

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
      className="w-full pointer-events-none block"
      style={{ height: `${POOL_H}px`, imageRendering: 'pixelated' }}
    />
  )
}
