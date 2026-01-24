import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    typedEnv: true,
    viewTransition: true,
  },
  reactCompiler: true,
  typedRoutes: true,
};

export default nextConfig;
