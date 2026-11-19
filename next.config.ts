import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export, so the site can be hosted on GitHub Pages or Vercel
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
