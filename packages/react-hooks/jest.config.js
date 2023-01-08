const { transformIgnoreESMPatterns, workspacesModuleNameMapper } = require('../../tools/jest/snippets');

/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    ...workspacesModuleNameMapper,
  },
  transformIgnorePatterns: [...transformIgnoreESMPatterns],
};
