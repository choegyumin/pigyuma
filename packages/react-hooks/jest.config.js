const { workspacesModuleNameMapper } = require('@pigyuma/jest-config-snippets');

/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    ...workspacesModuleNameMapper,
  },
};
