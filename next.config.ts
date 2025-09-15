import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  experimental: {
    globalNotFound: true,
  },
};

const withNextIntl = createNextIntlPlugin('./src/core/i18n/request.ts');
export default withNextIntl(nextConfig);
