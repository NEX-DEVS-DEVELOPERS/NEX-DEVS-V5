/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [], // Add any image domains you need
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 0, // Reduce cache TTL for better freshness
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true, // Set to true for Netlify deployments
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during build for deployment
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during build for deployment
  },
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn', 'info'], // Keep important logs
    } : false,
  },
  experimental: {
    // Remove any experimental features that might cause issues
    optimizeCss: false, // Set to false to avoid deployment issues
    scrollRestoration: true,
    optimizePackageImports: ['framer-motion', 'react-icons'],
    largePageDataBytes: 256 * 1000, // Increase limit for large responses
  },
  // Set to 'standalone' for SSR
  output: 'standalone',
  env: {
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  },
  // Server configuration
  serverRuntimeConfig: {
    // Will only be available on the server side
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    NODE_ENV: process.env.NODE_ENV || 'development',
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    NODE_ENV: process.env.NODE_ENV,
    BUILD_ID: Date.now().toString(), // Add unique build ID to force cache refreshes
  },
  // Add custom headers to prevent caching of API responses
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
          { key: 'X-Content-Type-Options', value: 'nosniff' }
        ],
      },
      {
        source: '/admin/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
    ];
  },
  // Generate unique build ID
  generateBuildId: () => {
    return `build-${Date.now()}`;
  },
  // Avoid React Fast Refresh conflicts with Netlify
  webpack: (config, { dev, isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    
    return config;
  },
}

module.exports = nextConfig 