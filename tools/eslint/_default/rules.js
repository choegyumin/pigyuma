module.exports = {
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': ['error'],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-empty': ['error', { allowEmptyCatch: true }],
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true }],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],

    'import/no-anonymous-default-export': 'warn',
    'import/no-named-as-default-member': 'off',
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        groups: ['type', ['builtin', 'external', 'internal'], ['parent', 'sibling', 'index'], 'object'],
        'newlines-between': 'ignore',
      },
    ],
  },
  overrides: [
    {
      files: ['*.css.ts'],
      rules: {
        'import/no-anonymous-default-export': 'off',
      },
    },
  ],
};
