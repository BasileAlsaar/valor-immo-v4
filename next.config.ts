import type { NextConfig } from "next"
import withSerwistInit from "@serwist/next"

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  register: false, // registration manuelle via components/pwa/register-pwa.tsx
  reloadOnOnline: true,
  // Désactivé en dev — laisse pnpm dev intact, SW actif uniquement en prod build
  disable: process.env.NODE_ENV !== "production",
})

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 jours
    remotePatterns: [{ protocol: "https", hostname: "media.apimo.pro" }],
  },
}

export default withSerwist(nextConfig)
