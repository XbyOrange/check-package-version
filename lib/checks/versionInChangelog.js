"use strict";

const path = require("path");
const chalk = require("chalk");
const changelogIncludesVersion = require("../changelogIncludesVersion");
const { LINE_SEPARATORS, getPackageJSON } = require("../utils");

class VersionChangelog {
  constructor(packagePath) {
    this._packagePath = packagePath || process.cwd();
    this._packageInfo = getPackageJSON(this._packagePath);
  }

  exitProcess() {
    console.log(
      chalk.red(
        `ERROR: version ${
          this._packageInfo.version
        } is not defined in the CHANGELOG.md file. Please add an entry for this version.`
      )
    );

    process.exitCode = 1;
  }

  confirmIncluded() {
    console.log(
      chalk.green(
        `${this._packageInfo.version} is defined in the CHANGELOG.md file.${LINE_SEPARATORS}`
      )
    );
  }

  checkIncluded(included) {
    if (!included) {
      this.exitProcess();
      return false;
    }

    this.confirmIncluded();
    return true;
  }

  check() {
    console.log(
      chalk.cyan("Checking if current package version has changes documented in changelog")
    );
    return changelogIncludesVersion
      .check(this._packageInfo.version, path.resolve(this._packagePath, "CHANGELOG.md"))
      .then(result => Promise.resolve(this.checkIncluded(result)))
      .catch(err => {
        console.log(chalk.red(`Error checking changelog: ${err.message}`));
        process.exitCode = 1;
      });
  }
}

module.exports = {
  check: packagePath => new VersionChangelog(packagePath).check()
};
