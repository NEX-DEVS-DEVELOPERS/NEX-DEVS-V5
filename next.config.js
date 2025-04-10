/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static optimization where possible
  output: 'standalone',
  
  // Ensure proper image optimization
  images: {
    domains: [],
    unoptimized: process.env.NETLIFY === 'true',
  },
  
  // Enable experimental features carefully
  experimental: {
    // Only keep the experiments that are explicitly enabled in your build
    scrollRestoration: true,
  },
  
  // Add Netlify-specific configuration
  env: {
    NETLIFY_NEXT_PLUGIN_SKIP: process.env.NETLIFY ? 'false' : 'true',
  },
  
  // Use transpilePackages instead of direct compiler options
  transpilePackages: [],
  
  // Disable type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true, 
  },
};

module.exports = nextConfig; 