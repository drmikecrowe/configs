const _ = require("lodash");
const fs = require("fs");
const { json, packageJson, install, uninstall } = require("mrm-core");
const format = require("syncpack/dist/commands/format");
const gc = require("syncpack/dist/lib/get-config");

function wipeFiles(files) {
  files.forEach((file) => {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  });
}

const omitKeys = [
  "allowJs",
  "allowSyntheticDefaultImports",
  "emitDecoratorMetadata",
  "esModuleInterop",
  "experimentalDecorators",
  "forceConsistentCasingInFileNames",
  "isolatedModules",
  "moduleResolution",
  "noEmit",
  "lib",
  "module",
  "noImplicitAny",
  "noUnusedLocals",
  "noUnusedParameters",
  "outDir",
  "preserveConstEnums",
  "pretty",
  "resolveJsonModule",
  "sourceMap",
  "strict",
  "strictNullChecks",
  "target",
];
const guiPackages = ["react", "vue"];

module.exports = function task({
  configScope,
  eslintPeerDependencies,
  eslintObsoleteDependencies,
  eslintRules,
}) {
  const configFile = ".eslintrc.json";
  const packages = [
    "eslint",
    "eslint-plugin-prettier",
    `${configScope}/prettier-config`,
  ];
  const packagesToRemove = ["jslint", "jshint"];

  let pkg = packageJson();
  const hasTypescript = pkg.get("devDependencies.typescript");
  const hasReact = pkg.get("dependencies.react");
  const hasVue = pkg.get("dependencies.vue");
  let hasPrettier = pkg.get("devDependencies.prettier");

  if (!hasPrettier) {
    hasPrettier = true;
    install(["prettier"], { dev: true, yarn: true });
    pkg = packageJson();
    hasPrettier = true;
  }

  const parts = [];
  if (hasPrettier) parts.push("prettier");
  if (hasTypescript) parts.push("typescript");
  if (hasVue) parts.push("vue");
  else if (hasReact) parts.push("react");

  const base = parts.length ? "-" + parts.join("-") : "";
  const full = `${configScope}/eslint-config${base}`;
  const eslintPreset = `${configScope}/${base.slice(1)}`;
  packages.push(full);

  // .eslintrc.json
  const eslintrc = json(configFile, pkg.get("eslintConfig"));

  const hasCustomPreset = _.castArray(eslintrc.get("extends", [])).find((x) =>
    x.startsWith(eslintPreset)
  );
  if (!hasCustomPreset) {
    eslintrc.set("extends", [eslintPreset]);

    // Now, remove all the eslint config that is now in the common packages
    Object.keys(pkg.get("devDependencies")).forEach((key) => {
      if (key.startsWith("eslint-")) {
        if (key.endsWith("react") || key.endsWith("vue")) {
          packagesToRemove.push(key);
        }
      }
    });
  }
  if (eslintRules) {
    eslintrc.merge({
      rules: eslintRules,
    });
  }
  eslintrc.save();

  // .prettierrc.js
  if (hasPrettier) {
    fs.writeFileSync(
      ".prettierrc.js",
      `const base = require("${configScope}/prettier-config")
module.exports = {
  ...base,
  // Your overrides go here
};`
    );
  }

  if (hasTypescript) {
    packages.push(
      `${configScope}/configs-typescript`,
      `${configScope}/eslint-config-prettier-typescript`
    );
    const isGui = guiPackages.some((name) =>
      pkg.get(`devDependencies.${name}`)
    );
    const type = isGui ? "dom" : "library";

    // tsconfig.json
    const tsconfig = json("tsconfig.json");
    tsconfig.merge({
      extends: `${configScope}/configs-typescript/${type}.json`,
    });
    const co = tsconfig.get("compilerOptions");
    tsconfig.set("compilerOptions", _.omit(co, omitKeys));
    tsconfig.save();
  }

  wipeFiles([".prettierrc", ".eslintrc", ".eslintrc.js"]);

  pkg.save();

  format.formatToDisk(gc.getConfig({}));

  // Dependencies
  uninstall([...packagesToRemove, ...eslintObsoleteDependencies], {
    yarn: true,
  });
  install([...packages, ...eslintPeerDependencies], { yarn: true, dev: true });
};

module.exports.description = "Migrate ESLint config to my global";
module.exports.parameters = {
  eslintPeerDependencies: {
    type: "config",
    default: [],
  },
  eslintObsoleteDependencies: {
    type: "config",
    default: [],
  },
  eslintRules: {
    type: "config",
  },
  configScope: {
    type: "input",
    default: "@drmikecrowe",
  },
};
