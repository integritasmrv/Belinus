import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'master.belinus.net' },
    ],
  },
};

export default nextConfig;