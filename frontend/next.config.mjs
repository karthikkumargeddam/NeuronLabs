import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS ? process.env.ALLOWED_DEV_ORIGINS.split(',') : [],
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'wise-action-3f2ccfecaa.strapiapp.com' },
    ],
  },
  turbopack: {},
  async redirects() {
    return [
      {
        source: '/sandbox',
        destination: '/virtual-box',
        permanent: true,
      },
      {
        source: '/virtualbox',
        destination: '/virtual-box',
        permanent: true,
      },
      {
        source: '/virtual-toolbox',
        destination: '/virtual-box',
        permanent: true,
      },
      {
        source: '/sandbox/:path*',
        destination: '/virtual-box/:path*',
        permanent: true,
      }
    ];
  },
};

export default withPWA(nextConfig);
