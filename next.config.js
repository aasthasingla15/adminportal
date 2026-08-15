/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  swcMinify: true,
  images: {
    unoptimized: true
  },
  staticPageGenerationTimeout: 30,
  cacheMaxMemorySize: 52 * 1024 * 1024,
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
};

module.exports = nextConfig;
