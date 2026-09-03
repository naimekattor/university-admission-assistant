const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["yale-mix-resident-initial.trycloudflare.com"],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
      {
        source: '/api/server/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
      {
        source: '/api/preparation/:path*',
        destination: `${BACKEND_URL}/api/preparation/:path*`,
      },
      {
        source: '/api/practice/:path*',
        destination: `${BACKEND_URL}/api/practice/:path*`,
      },
      {
        source: '/api/exams/:path*',
        destination: `${BACKEND_URL}/api/exams/:path*`,
      },
      {
        source: '/api/study-plan/:path*',
        destination: `${BACKEND_URL}/api/study-plan/:path*`,
      },
      {
        source: '/api/rag/:path*',
        destination: `${BACKEND_URL}/api/rag/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${BACKEND_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
