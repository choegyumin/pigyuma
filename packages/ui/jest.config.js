const { workspacesModuleNameMapper } = require('@pigyuma/jest-config-snippets');

/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    ...workspacesModuleNameMapper,
  },
  transform: {
    '\\.css\\.ts$': '@vanilla-extract/jest-transform',
  },
};
