import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "d2uil25qo43m6t.cloudfront.net" },
    ],
  },
  async redirects() {
    return [
      { source: "/productos", destination: "/tienda", permanent: true },
    ];
  },
};

export default nextConfig;
