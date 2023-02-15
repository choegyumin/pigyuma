module.exports = {
  extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended', 'plugin:@next/next/recommended', '../_default/rules.js'],
  settings: {
    react: {
      version: '18.0.0',
    },
  },
  rules: {
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/jsx-curly-brace-presence': ['error', 'never'],
    'react/jsx-tag-spacing': 'error',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/self-closing-comp': 'error',

    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '(useIsomorphicLayoutEffect|useRecoilCallback)',
      },
    ],
    'react-hooks/rules-of-hooks': 'error',

    '@next/next/no-html-link-for-pages': 'off',
  },
};
