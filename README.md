[![pipeline status](https://gitlab.com/OrangeX/frontend/tools/check-package-version/badges/master/pipeline.svg)](https://gitlab.com/OrangeX/frontend/check-package-version/commits/master)
[![coverage report](https://gitlab.com/OrangeX/frontend/tools/check-package-version/badges/master/coverage.svg)](https://gitlab.com/OrangeX/frontend/check-package-version/commits/master)
[SonarQube](https://sonarqube.apps.pre.xbyorange.com/dashboard?id=front%3Atools%3Acheck-package-version)

# Check Package Version

Ensures that current package version does not exists, and checks that current version has an entry in the CHANGELOG.md file.

Useful to check versioning before merging packages code into master.

## Table of contents

- [Quick start](#quick-start)
- [Executing different checks independently](#executing-different-checks-independently)
- [Programmatic usage](#programmatic-usage)
- [Global usage](#global-usage)

## Quick start

### Add the dependency

```bash
npm i @nex/check-package-version --save-dev
```

### Add a script to your package.json

```json
{
  "scripts": {
    "check-package-version": "check-package-version"
  }
}
```

### Execute checks

```bash
npm run check-package-version
```

This execution will result in an error if the package name and version is already published, or if the currently defined version has not a correspondent entry in the CHANGELOG.md file.

## Executing different checks independently

The `check-package-version` command performs all checks by default, but you can execute them independently:

### Checking only if package version is already published:

```json
{
  "scripts": {
    "check-version-not-published": "check-version-not-published"
  }
}
```

```bash
npm run check-version-not-published
```

### Checking only if package version has a correspondence in the CHANGELOG.md file:

```json
{
  "scripts": {
    "check-version-in-changelog": "check-version-in-changelog"
  }
}
```

```bash
npm run check-version-in-changelog
```

## Programmatic usage

You can use the checker classes programmaticaly if needed. This package exports two methods:

### `checkVersion` ([packagePath])

This method checks by `npm view` the current version in the registry.
The function prints a message in the prompt when the flow goes ok, and mark the process to exit with 1 code when it is not.
This methos returns a promise.

- packagePath `<string>` Optional parameter for checking a package by its path.

### `checkChangelog` ([packagePath])

The function prints a message in the prompt when the flow goes ok, and mark the process to exit with 1 code when it is not.
This method returns a promise that resolves whit a boolean value. `true` whether the porcess went ok and `false` in case it was not.

- packagePath `<string>` Optional parameter for checking a package by its path.

### `checkAll` ([packagePath])

This method is a mix between `checkVersion` and `checkChangelog` checking both the version and the changelog properly.
The function prints a message in the prompt when the flow goes ok, and mark the process to exit with 1 code when it is not.
This method returns a promise that resolves whit a boolean value. `true` whether the porcess went ok and `false` in case it was not.

- packagePath `<string>` Optional parameter for checking a package by its path.

## Global usage

This package can be installed and used globally:

```bash
npm i @nex/check-package-version -g
```

Now, execute the command in the folder of the package you want to check:

```bash
check-package-version # Perform all checks
check-version-not-published # Check if version is already published
check-version-in-changelog # Check if version has a correspondence in the CHANGELOG.md file
```
