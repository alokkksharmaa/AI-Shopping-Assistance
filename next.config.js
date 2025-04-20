/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['fakestoreapi.com', 'i.dummyjson.com', 'images.unsplash.com', 'source.unsplash.com', 'cdn.dummyjson.com', 'dummyjson.com'],
    unoptimized: true,
  },
  output: 'export',
  distDir: 'out',
};

module.exports = nextConfig;
