module.exports = {
  "**/*.{json,md}": [
    (files) => files.map((file) => `prettier "${file}" --ignore-path .prettierignore --write`),
  ],
  "**/*.{js,jsx,ts,tsx}": [
    (files) => files.map((file) => `prettier "${file}" --ignore-path .prettierignore --write`),
    (files) => files.map((file) => `eslint "${file}" --ignore-path .eslintignore --resolve-plugins-relative-to . --fix`),
  ],
};
