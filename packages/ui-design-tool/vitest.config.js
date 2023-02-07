const { vanillaExtractPlugin } = require('@vanilla-extract/vite-plugin');
import reactPlugin from '@vitejs/plugin-react';
const { defineConfig } = require('vitest/config');
const { workspacesAlias } = require('../../tools/vitest/snippets');

module.exports = defineConfig({
  plugins: [reactPlugin(), vanillaExtractPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    alias: [...workspacesAlias],
  },
});