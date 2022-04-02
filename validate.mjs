#!/usr/bin/env zx

const scope = '@drmikecrowe';

const checkDependencies = (pkgName) => {
  if (!pkgName) return;
  const folder = `packages/${pkgName}`;
  const { name, dependencies } = fs.readJsonSync(`${folder}/package.json`)
  if (name !== `${scope}/${pkgName}`) {
    console.warn(`In ${chalk.blue(folder)}:\nExpected: ${chalk.blue(scope + '/' + pkgName)}\nGot: ${name}`)
    process.exit(1);
  }
  const parts2 = pkgName.replace("eslint-config-", "").split("-");
  const indexFile = `${folder}/lib/index.js`;
  const indexjs = fs.readFileSync(`${indexFile}`);

  const test = (first, second) => {
    let pkgs = []
    if (first) pkgs.push(first);
    if (second) pkgs.push(second);
    if (pkgs.length === 0) return;
    const name = pkgs.join("-");
    const extend = `${scope}/${name}`;
    console.log(`Checking ${chalk.blue(folder)} for ${chalk.green(extend)}`);
    if (indexjs.indexOf(extend) === -1) {
      console.warn(`In ${chalk.red(folder)}/lib/index.js:\nExpected: ${chalk.red(extend)}`)
      process.exit(1)
    }
    const depends = `${scope}/eslint-config-${name}`;
    console.log(`Checking ${chalk.blue(folder)} for ${chalk.green(depends)}`)
    if (!dependencies[depends]) {
      console.warn(`In ${chalk.red(folder)}/package.json:\nExpected: ${chalk.red(depends)} in dependencies but missing`)
      process.exit(1)
    }
    return name;
  };

  if (parts2.length === 3) {
    const first = parts2.shift();
    const last = parts2.pop();
    const middle = parts2.shift();
    test(first, last);
    test(middle, last);
    test(first, middle);
    checkDependencies(`eslint-config-${first}-${last}`);
    checkDependencies(`eslint-config-${middle}-${last}`);
  } else if (parts2.length === 2) {
    const first = parts2.shift();
    const last = parts2.pop();
    test(first);
    test(last);
    checkDependencies(`eslint-config-${first}`);
    checkDependencies(`eslint-config-${last}`);
  }
};

checkDependencies('eslint-config-prettier-typescript-vue');
