import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    typedEnv: true,
  },
  reactCompiler: true,
  typedRoutes: true,
};

export default nextConfig;
