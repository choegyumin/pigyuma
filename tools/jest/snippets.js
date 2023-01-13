const esm = ['lodash-es'];

module.exports = {
  transformIgnoreESMPatterns: [`node_modules/(?!(${esm.join('|')})/)`],
  workspacesModuleNameMapper: {
    // Alias in worksapce
    '^~/(.*)$': ['<rootDir>/../../apps/web/$1'],
    '^@/(.*)$': [
      '<rootDir>/../../packages/react-utility-types/$1',
      '<rootDir>/../../packages/react-utils/$1',
      '<rootDir>/../../packages/ui/$1',
      '<rootDir>/../../packages/ui-design-tool/$1',
      '<rootDir>/../../packages/utils/$1',
    ],
    // Packages
    '^@pigyuma/react-utility-types/(.*)$': '<rootDir>/../../packages/react-utility-types/$1',
    '^@pigyuma/react-utils/(.*)$': '<rootDir>/../../packages/react-utils/$1',
    '^@pigyuma/ui/(.*)$': '<rootDir>/../../packages/ui/$1',
    '^@pigyuma/ui-design-tool/(.*)$': '<rootDir>/../../packages/ui-design-tool/$1',
    '^@pigyuma/utils/(.*)$': '<rootDir>/../../packages/utils/$1',
  },
};
