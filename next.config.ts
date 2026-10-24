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
    // Las imágenes del CDN ya vienen optimizadas (tamaño y formato).
    // Las servimos directo para máxima compatibilidad y que siempre carguen.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "d2uil25qo43m6t.cloudfront.net" },
      // Fotos subidas desde el panel (Supabase Storage)
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  experimental: {
    serverActions: {
      // El panel achica las fotos antes de subirlas; esto deja margen.
      // (Vercel acepta como máximo 4,5 MB por petición.)
      bodySizeLimit: "4mb",
    },
  },
  async redirects() {
    return [
      { source: "/productos", destination: "/tienda", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
