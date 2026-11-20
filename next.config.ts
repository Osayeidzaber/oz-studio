import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // The showcase browser frames lose their GSAP pin state on StrictMode's dev double mount.
  reactStrictMode: false,
  images: { formats: ["image/avif", "image/webp"] },
}

export default nextConfig
