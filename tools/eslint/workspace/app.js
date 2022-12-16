module.exports = {
  extends: ['../_default/settings.js', '../_default/rules.js'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@/*'],
            message: "Importing packages by alias is not allowed. Please import from '@pigyuma/*' instead.",
          },
        ],
      },
    ],
  },
};
