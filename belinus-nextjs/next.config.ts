import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'master.belinus.net',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization?.splitChunks,
          minSize: 1000,
          maxSize: 5 * 1024 * 1024,
          cacheGroups: {
            ...config.optimization?.splitChunks?.cacheGroups,
            default: false,
            vendors: false,
          },
        },
      };
    }
    config.cache = false;
    return config;
  },
};

export default withNextIntl(nextConfig);
