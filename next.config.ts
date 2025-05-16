import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
        ignoreDuringBuilds: true,
    },
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
