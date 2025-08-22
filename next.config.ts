import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/admin/dashboard',
        permanent: true,
      },
      {
        source: '/dashboard/:path*',
        destination: '/admin/dashboard/:path*',
        permanent: true,
      },
      // Redirect old merchant dashboard URLs if needed
      {
        source: '/merchant-portal',
        destination: '/merchant/dashboard',
        permanent: true,
      },
      {
        source: '/merchant-portal/:path*',
        destination: '/merchant/dashboard/:path*',
        permanent: true,
      }
    ];
  },
};

export default nextConfig;
