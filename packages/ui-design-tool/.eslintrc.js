module.exports = {
  root: true,
  extends: ['../../tools/eslint/workspace/package', '../../tools/eslint/library/react'],
  overrides: [
    {
      files: ['components/**/*'],
      rules: {
        'import/no-named-as-default': 'off',
      },
    },
  ],
};
