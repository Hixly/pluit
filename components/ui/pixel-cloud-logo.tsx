'use client'

interface PixelCloudLogoProps {
  size?: number
  className?: string
  animated?: boolean
}

const P = 10 // viewBox units per pixel (viewBox = 160x160)

const cloud: [number, number][] = [
  [3,1],[4,1],
  [2,2],[3,2],[4,2],[5,2],
  [7,0],[8,0],
  [6,1],[7,1],[8,1],[9,1],
  [1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[10,3],
  [0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4],[11,4],
  [0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],[10,5],[11,5],
  [0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6],[10,6],[11,6],
]

const rainRow1: [number, number][] = [[1,8],[4,8],[7,8],[10,8]]
const rainRow2: [number, number][] = [[2,10],[5,10],[8,10],[11,10]]
const rainRow3: [number, number][] = [[1,12],[4,12],[7,12],[10,12]]

export function PixelCloudLogo({ size = 96, className, animated = true }: PixelCloudLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      className={className}
      shapeRendering="crispEdges"
      style={{ overflow: 'visible' }}
    >
      <g className={animated ? 'cloud-float cloud-glow' : undefined}>
        {cloud.map(([col, row], i) => (
          <rect key={i} x={col * P} y={row * P} width={P} height={P} fill="#ffffff" />
        ))}
      </g>
      <g className={animated ? 'rain-row-1' : undefined}>
        {rainRow1.map(([col, row], i) => (
          <rect key={i} x={col * P} y={row * P} width={P} height={P} fill="#89CFF0" />
        ))}
      </g>
      <g className={animated ? 'rain-row-2' : undefined}>
        {rainRow2.map(([col, row], i) => (
          <rect key={i} x={col * P} y={row * P} width={P} height={P} fill="#89CFF0" />
        ))}
      </g>
      <g className={animated ? 'rain-row-3' : undefined}>
        {rainRow3.map(([col, row], i) => (
          <rect key={i} x={col * P} y={row * P} width={P} height={P} fill="#89CFF0" />
        ))}
      </g>
    </svg>
  )
}
