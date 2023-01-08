const nextJest = require('next/jest');
const { transformIgnoreESMPatterns, workspacesModuleNameMapper } = require('../../tools/jest/snippets');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import("ts-jest").JestConfigWithTsJest} */
const customJestConfig = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    ...workspacesModuleNameMapper,
  },
  transform: {
    '\\.css\\.ts$': '@vanilla-extract/jest-transform',
  },
  transformIgnorePatterns: [...transformIgnoreESMPatterns],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = async () => ({
  ...(await createJestConfig(customJestConfig)()),
  transformIgnorePatterns: customJestConfig.transformIgnorePatterns,
});
