import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // The showcase browser frames lose their GSAP pin state on StrictMode's dev double mount.
  reactStrictMode: false,
  images: { formats: ["image/avif", "image/webp"] },
  // Short, guessable paths people might type or link to, all landing on the founder page.
  async redirects() {
    return ["/about", "/founder", "/osayeed", "/zaber", "/osayeedzaber", "/osayeed-jaber", "/osayeid-zaber"].map((source) => ({ source, destination: "/osayeed-zaber", permanent: true }))
  },
}

export default nextConfig
