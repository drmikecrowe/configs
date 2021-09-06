const fs = require("fs");

const jest_env = {};
const jest_plugins = [];

if (fs.existsSync("package.json")) {
  const pkg = JSON.parse(fs.readFileSync("package.json"));
  if (pkg.devDependencies && pkg.devDependencies.jest) {
    jest_env.jest = true;
    jest_plugins.push("jest");
  }
}
module.exports = {
  extends: ["eslint:recommended"],
  env: {
    node: true,
    es6: true,
    ...jest_env,
  },
  parserOptions: {
    ecmaVersion: 8,
  },
  plugins: jest_plugins,

  rules: {
    /**
     * Let prettier manage the width
     */
    "max-len": "off",
    /**
     * Requires the use of single quotes wherever possible
     *
     * @see https://eslint.org/docs/rules/quotes
     */
    quotes: [
      "error",
      "single",
      {
        allowTemplateLiterals: true,
      },
    ],

    /**
     * Requires the use of `const` or `let` instead of `var`
     *
     * @see https://eslint.org/docs/rules/no-var
     */
    "no-var": ["error"],

    /**
     * Requires the use of trailing commas in object and array literals
     *
     * @see https://eslint.org/docs/rules/comma-dangle
     */
    "comma-dangle": ["error", "always-multiline"],
  },
};
