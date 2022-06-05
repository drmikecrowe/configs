/**
 * Based on Vue.js rules
 *
 * @see https://eslint.vuejs.org/rules
 */

const fs = require("fs");

let nuxt = [];
let vuever = "";
if (fs.existsSync("package.json")) {
  const pkg = JSON.parse(fs.readFileSync("package.json"));
  if (pkg.devDependencies && pkg.devDependencies.nuxt) {
    nuxt.push("plugin:nuxt/recommended");
  }
  const vue =
    (pkg.devDependencies && pkg.devDependencies.vue) ||
    (pkg.dependencies && pkg.dependencies.vue);
  if (vue) {
    const vver = /[0-9]/.exec(vue);
    if (vver.startsWith(3)) vuever = "3";
  }
}

module.exports = {
  extends: [
    "@drmikecrowe",
    // Vue style guide
    ...nuxt,
    `plugin:vue${vuever}/recommended`,
  ],

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    extraFileExtensions: [".vue"],
  },

  // Rules overrides
  rules: {
    /**
     * Disallow use of v-html to prevent XSS attack
     *
     * @see https://eslint.vuejs.org/rules/no-v-html.html
     */
    "vue/no-v-html": "off",
  },
};
