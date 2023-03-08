import reactPlugin from '@vitejs/plugin-react';
const { defineConfig } = require('vitest/config');
const { createWorkspacesAlias } = require('../../tools/vitest/snippets');

module.exports = defineConfig({
  plugins: [reactPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    alias: [...createWorkspacesAlias('packages/react-utils')],
    coverage: { provider: 'c8', reporter: ['text', 'html', 'lcovonly'] },
  },
});
