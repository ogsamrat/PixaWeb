import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  async redirects() {
    return [
      {
        source: "/docs",
        destination: "https://celoref.mintlify.app/api-reference/introduction",
        permanent: true,
      },
      {
        source: "/docs/:path*",
        destination: "https://celoref.mintlify.app/api-reference/introduction",
        permanent: true,
      },
      {
        source: "/favicon.ico",
        destination: "/assets/favicon/favicon.ico",
        permanent: true,
      },
      {
        source: "/site.webmanifest",
        destination: "/assets/favicon/site.webmanifest",
        permanent: true,
      },
      {
        source: "/apple-touch-icon.png",
        destination: "/assets/favicon/apple-touch-icon.png",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
