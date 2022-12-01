module.exports = {
  "**/*.{js,jsx,ts,tsx,json,md}": [
    (files) => files.map((file) => `prettier "${file}" --ignore-path .prettierignore --write`),
  ],
};
