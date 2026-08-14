/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true, // Enable gzip compression
  swcMinify: true, // Use SWC for faster minification
  images: {
    unoptimized: true
  },
  // Enable static generation optimization
  staticPageGenerationTimeout: 30,
  // Optimize performance
  experimental: {
    isrMemoryCacheSize: 52 * 1024 * 1024, // 52MB for ISR cache
    esmExternals: true,
  },
  // Response headers for caching
  async headers() {
    return [
      {
        source: '/api/events/:id',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=7200, stale-while-revalidate=86400'
          }
        ]
      },
      {
        source: '/events/:id',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=1800, s-maxage=3600'
          }
        ]
      }
    ];
  }
}

module.exports = nextConfig
