import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    nodeMiddleware: true,
  },
  devIndicators: false,
};

export default nextConfig;
