import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    cpus: 1,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        {
          source: "/api/:path*",
          destination: `${apiUrl}/api/:path*`,
        },
        {
          source: "/uploads/:path*",
          destination: `${apiUrl}/api/uploads/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
