const { workspacesModuleNameMapper } = require('@pigyuma/jest-config-snippets');

/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'node',
  moduleNameMapper: {
    ...workspacesModuleNameMapper,
  },
};
