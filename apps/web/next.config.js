const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
  experimental: {
    transpilePackages: ['@pigyuma/design-system'],
  },
  webpack(config, options) {
    const { dev, isServer } = options;
    // Do not run type checking twice:
    if (dev && !isServer) {
      config.plugins.push(
        new ForkTsCheckerWebpackPlugin({
          devServer: dev,
          issue: {
            exclude: [{ file: '**/__mocks__/**/*' }, { file: '**/*.test.{js,jsx,ts,tsx}' }],
          },
        }),
      );
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = withVanillaExtract(nextConfig);
