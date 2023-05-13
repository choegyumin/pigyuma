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
           * See {@link ./css/README.md}
           */
          {
            pattern: '@/config',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@/foundations',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@/mixins',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@/css',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@/primitives',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@/patterns',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@/components',
            group: 'internal',
            position: 'after',
          },
        ],
        'newlines-between': 'ignore',
      },
    ],
    '@typescript-eslint/ban-ts-comment': 'off',
  },
};
