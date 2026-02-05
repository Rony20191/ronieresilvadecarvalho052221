import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/music-catalog/**',
      },
    ],
    // Disable image optimization for localhost to avoid "private ip" error
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;


