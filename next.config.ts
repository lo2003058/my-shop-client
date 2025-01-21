import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  domains: [
    "images.unsplash.com",
    "tailwindui.com",
    "placehold.co",
    "image.iamyin.me", // Added new domain here
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "tailwindui.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "image.iamyin.me", // Added new remote pattern here
      },
    ],
  },
};

export default nextConfig;
