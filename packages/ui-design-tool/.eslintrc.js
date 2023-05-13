module.exports = {
  root: true,
  extends: ['../../tools/eslint/workspace/package', '../../tools/eslint/library/react'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@/renderer/components/UIDesignToolProvider/UIDesignToolProvider.context',
            message: 'Please use `@/renderer/hooks/*` instead.',
          },
          {
            name: '@/renderer/hooks/useUIData',
            message:
              'Please use useMode, useStatus, useTree, useItemReference... instead inside this package. See UIDesignToolProvider.context.ts',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['renderer/components/**/*'],
      rules: {
        'import/no-named-as-default': 'off',
      },
    },
  ],
};
