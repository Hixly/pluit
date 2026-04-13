import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.wasabisys.com',
      },
    ],
  },
}

export default nextConfig
