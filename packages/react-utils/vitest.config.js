import reactPlugin from '@vitejs/plugin-react';
const { configDefaults, defineConfig } = require('vitest/config');
const { createWorkspacesAlias } = require('../../tools/vitest/snippets');

const exclude = ['**/*.css.{js,jsx,ts,tsx}'];

module.exports = defineConfig({
  plugins: [reactPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    alias: [...createWorkspacesAlias('packages/react-utils')],
    exclude: [...configDefaults.exclude, ...exclude],
    coverage: { provider: 'c8', reporter: ['text', 'html', 'lcovonly'], exclude: [...configDefaults.coverage.exclude, ...exclude] },
  },
});
