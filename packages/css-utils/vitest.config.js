const { vanillaExtractPlugin } = require('@vanilla-extract/vite-plugin');
const { defineConfig } = require('vitest/config');
const { createWorkspacesAlias } = require('../../tools/vitest/snippets');

module.exports = defineConfig({
  plugins: [vanillaExtractPlugin()],
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    alias: [...createWorkspacesAlias('packages/css-utils')],
    coverage: { provider: 'c8', reporter: ['text', 'html', 'lcovonly'] },
  },
});
