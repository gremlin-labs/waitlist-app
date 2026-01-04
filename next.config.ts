import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployments
  output: "standalone",
  
  // Server external packages for discord.js and bullmq
  serverExternalPackages: ["discord.js", "bullmq", "ioredis"],
  
  // Empty turbopack config to acknowledge we don't need webpack customization
  turbopack: {},
};

export default nextConfig;
