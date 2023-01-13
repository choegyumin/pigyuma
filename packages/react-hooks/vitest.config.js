import reactPlugin from '@vitejs/plugin-react';
const { defineConfig } = require('vitest/config');
const { workspacesAlias } = require('../../tools/vitest/snippets');

module.exports = defineConfig({
  plugins: [reactPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    alias: [...workspacesAlias],
  },
});
