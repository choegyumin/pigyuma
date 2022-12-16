module.exports = {
  root: true,
  extends: ['../../tools/eslint/workspace/package', '../../tools/eslint/library/react'],
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
            pattern: '~/ui/styles/config',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '~/ui/styles/extensions',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '~/ui/styles/foundations',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '~/ui/styles/mixins',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '~/ui/styles/globals',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '~/ui/styles/patterns',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '~/ui/styles/components',
            group: 'internal',
            position: 'after',
          },
        ],
        'newlines-between': 'ignore',
      },
    ],
  },
};
