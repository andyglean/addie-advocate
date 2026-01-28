import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'injuryadvocate.ai',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;

