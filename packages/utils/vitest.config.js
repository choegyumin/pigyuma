const { defineConfig } = require('vitest/config');
const { createWorkspacesAlias } = require('../../tools/vitest/snippets');

module.exports = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    alias: [...createWorkspacesAlias('packages/utils')],
    coverage: { provider: 'c8', reporter: ['text', 'html', 'lcovonly'] },
  },
});
