/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Firebase hosting
  output: 'export',
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig; 