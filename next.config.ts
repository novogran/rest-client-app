import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import bundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  experimental: {
    globalNotFound: true,
  },
};

const withNextIntl = createNextIntlPlugin('./src/core/i18n/request.ts');
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});
export default withNextIntl(withBundleAnalyzer(nextConfig));
