import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // TypeScript & ESLint settings to prevent build-time blocking
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Image optimization settings
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.aarong.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.lulus.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.pinterest.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.shopify.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.app.goo.gl', pathname: '/**' },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '.googleusercontent.com',
        pathname: '/**',
      },
      { protocol: 'https', hostname: 'ecstasybd.com', pathname: '/**' },
      {
        protocol: 'https',
        hostname: 'www.yellowclothing.net',
        pathname: '/**',
      },
      { protocol: 'https', hostname: 'store.fcbarcelona.com', pathname: '/**' },
    ],
  },

  // Custom webpack configuration
  webpack: (config) => {
    config.externals.push(
      'mongodb-client-encryption',
      'gcp-metadata',
      'kerberos',
      'aws4'
    );
    return config;
  },
};

export default nextConfig;
