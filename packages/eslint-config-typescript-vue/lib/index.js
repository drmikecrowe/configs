/**
 * Vue.js Rules with Typescript Rules
 */

module.exports = {
  extends: ["@drmikecrowe/typescript", "@drmikecrowe/vue"],

  // Override the `parser` in vue and typescript rules
  parser: "vue-eslint-parser",

  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
  },
};
