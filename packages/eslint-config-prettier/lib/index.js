/**
 * Standard JavaScript Style with Prettier
 */

module.exports = {
  extends: ["@drmikecrowe", "prettier"],

  plugins: [
    // Use `eslint-plugin-prettier` to intergrade prettier to eslint workflow
    "prettier",
  ],

  // Rules overrides
  rules: {
    "prettier/prettier": "warn",
  },
};
