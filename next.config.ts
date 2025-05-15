import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rqyfdiipauhonscuywvj.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/avatars/**'
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
