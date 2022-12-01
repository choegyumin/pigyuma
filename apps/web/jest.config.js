const nextJest = require('next/jest');
const { workspacesModuleNameMapper } = require('@pigyuma/jest-config-snippets');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    ...workspacesModuleNameMapper,
    // Handle module aliases (this will be automatically configured in Next.js for you soon)
    '^components/(.*)$': '<rootDir>/components/$1',
    '^pages/(.*)$': '<rootDir>/pages/$1',
  },
  transform: {
    '\\.css\\.ts$': '@vanilla-extract/jest-transform',
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
