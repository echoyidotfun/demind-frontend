import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 添加对SSE的支持
  experimental: {
    // 确保支持长连接和流式响应
  },

  // 确保服务器不会过早关闭连接
  httpAgentOptions: {
    keepAlive: true,
  },

  // 将构建目标设为服务器端渲染
  reactStrictMode: true,
};

export default nextConfig;
