module.exports = {
  root: true,
  extends: ['../../tools/eslint/workspace/package', '../../tools/eslint/library/react'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@/components/UIDesignToolProvider/UIDesignToolProvider.context',
            message: 'Please use `@/hooks/*` instead.',
          },
          {
            name: '@/hooks/useUIData',
            message:
              'Please use useMode, useStatus, useTree, useItemReference... instead inside this package. See UIDesignToolProvider.context.ts',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['components/**/*'],
      rules: {
        'import/no-named-as-default': 'off',
      },
    },
  ],
};
