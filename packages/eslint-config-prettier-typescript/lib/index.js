/**
 * TypeScript ESLint Rules with Prettier
 */

module.exports = {
  extends: [
    "plugin:promise/recommended",
    "@drmikecrowe/typescript",
    "@drmikecrowe/prettier",
  ],
  rules: {
    "@typescript-eslint/no-floating-promises": ["error"],
  },
};
