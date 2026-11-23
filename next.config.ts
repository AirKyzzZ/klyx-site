import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const withMDX = createMDX();

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const staticAssetDirs = [
  "backdrop",
  "brand",
  "clients",
  "fonts",
  "logos",
  "realisations",
  "team",
  "textures",
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  headers: async () => [
    { source: "/:path*", headers: securityHeaders },
    {
      source: `/(${staticAssetDirs.join("|")})/:path+`,
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=604800, stale-while-revalidate=86400",
        },
      ],
    },
  ],
  pageExtensions: ["ts", "tsx", "mdx"],
  // Optimistic routing predicts as-needed locale URLs wrong and refetches them in a loop.
  experimental: {
    optimisticRouting: false,
    inlineCss: true,
    globalNotFound: true,
    // Netlify restores .next/cache and Turbopack shipped a stale globals.css chunk from it.
    turbopackFileSystemCacheForBuild: false,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(withMDX(nextConfig));
