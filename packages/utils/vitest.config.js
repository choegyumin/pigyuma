const { defineConfig } = require('vitest/config');
const { workspacesAlias } = require('../../tools/vitest/snippets');

module.exports = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    alias: [...workspacesAlias],
  },
});
