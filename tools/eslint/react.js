module.exports = {
  extends: ["next", "./base"],
  rules: {
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "react/jsx-curly-brace-presence": ["error", "never"],
    "react/jsx-tag-spacing": "error",
    "react/prop-types": "off",
    "react/self-closing-comp": "error",

    "react-hooks/rules-of-hooks": "error",

    "@next/next/no-html-link-for-pages": "off",
  },
};
