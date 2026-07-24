/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    outputFileTracingIncludes: {
      '/apk/centryx-dpc-v2.apk': ['./public/apk/**/*'],
    },
  },
};

module.exports = nextConfig;
