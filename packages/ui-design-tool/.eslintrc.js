module.exports = {
  root: true,
  extends: ['../../tools/eslint/workspace/package', '../../tools/eslint/library/react'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: ['@/components/UIDesignToolProvider/UIDesignToolProvider.context'],
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
