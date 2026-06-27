import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: [
    '@skye/types',
    '@skye/core',
    '@skye/weather-sdk',
    '@skye/shared-hooks',
    '@skye/ui',
    '@skye/animations',
  ],
}

export default nextConfig
