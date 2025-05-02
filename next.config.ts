import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['res.cloudinary.com', 'profile.line-scdn.net'],
  },
};

export default nextConfig;