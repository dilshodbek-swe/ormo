import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  // Akkaunt sahifalari dashboard ichiga ko'chdi — eski havolalar ishlashda davom etadi
  redirects: async () =>
    ["profile", "orders", "settings"].map((page) => ({
      source: `/${page}`,
      destination: `/dashboard/${page}`,
      permanent: false,
    })),
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
