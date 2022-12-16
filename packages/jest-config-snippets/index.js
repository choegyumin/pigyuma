module.exports = {
  workspacesModuleNameMapper: {
    // Alias in worksapce
    '^~/(.*)$': ['<rootDir>/../../apps/web/$1'],
    '^@/(.*)$': [
      '<rootDir>/../../packages/react-hooks/$1',
      '<rootDir>/../../packages/react-utility-types/$1',
      '<rootDir>/../../packages/ui/$1',
      '<rootDir>/../../packages/utils/$1',
    ],
    // Packages
    '^@pigyuma/react-hooks/(.*)$': '<rootDir>/../../packages/react-hooks/$1',
    '^@pigyuma/react-utility-types/(.*)$': '<rootDir>/../../packages/react-utility-types/$1',
    '^@pigyuma/ui/(.*)$': '<rootDir>/../../packages/ui/$1',
    '^@pigyuma/utils/(.*)$': '<rootDir>/../../packages/utils/$1',
  },
};
