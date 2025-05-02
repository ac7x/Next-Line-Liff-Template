import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'profile.line-scdn.net'], // 添加 LINE 頭像域名
  },
};

export default nextConfig;