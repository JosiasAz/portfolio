import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Screenshots do Microlink: 1 dia de cache para não estourar o limite grátis (50/dia).
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.microlink.io",
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
      },
    ],
  },
};

export default nextConfig;
