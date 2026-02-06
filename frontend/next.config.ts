import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'backend',
        port: '8080',
        pathname: '/music-catalog/**',
      },
    ],
    // Disable image optimization for localhost to avoid "private ip" error
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;


