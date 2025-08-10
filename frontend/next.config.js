/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        ws: false,
      }
    }

    // Suprimir warnings específicos do Supabase Realtime
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
    ]

    return config
  },
}

module.exports = nextConfig


