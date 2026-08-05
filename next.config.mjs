/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["yale-mix-resident-initial.trycloudflare.com"],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
