module.exports = {
  root: true,
  extends: ['../../tools/eslint/react'],
  rules: {
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        groups: ['type', ['builtin', 'external', 'internal'], ['parent', 'sibling', 'index'], 'object'],
        pathGroups: [
          /**
           * CSS Selector Declaration Order
           * @see {@link ./styles/README.md}
           */
          {
            pattern: '@pigyuma/ui/styles/config',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@pigyuma/ui/styles/extensions',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@pigyuma/ui/styles/foundations',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@pigyuma/ui/styles/mixins',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@pigyuma/ui/styles/globals',
            group: 'internal',
            position: 'after',
          },
        ],
        'newlines-between': 'ignore',
      },
    ],
  },
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
      },
    },
  ],
};
