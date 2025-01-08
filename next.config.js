const createMDX = require("@next/mdx");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    forceSwcTransforms: true,
    appDir: true,
  },
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  async redirects() {
    return [
      {
        source: "/how-arrays-work",
        destination: "https://nan-archive.vercel.app/how-arrays-work",
        permanent: false,
      },
      {
        source: "/debugger",
        destination: "https://nan-archive.vercel.app/debugger",
        permanent: false,
      },
      {
        source: "/sliding-window",
        destination: "https://nan-archive.vercel.app/sliding-window",
        permanent: false,
      },
    ];
  },
};

const withMDX = createMDX({});

module.exports = withMDX(nextConfig);
