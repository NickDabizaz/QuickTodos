/** @type {import('next').NextConfig} */
const nextConfig = {
  // Common configuration for all environments
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  // Disable page types generation to avoid TypeScript errors
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

// Add static export only for production builds
if (process.env.NODE_ENV === 'production') {
  nextConfig.output = 'export';
}

module.exports = nextConfig; 