"use strict";

const chalk = require("chalk");
const versionExists = require("../versionExists");
const { LINE_SEPARATORS, getPackageJSON } = require("../utils");

class VersionPublished {
  constructor(packagePath) {
    const pathToGet = packagePath || process.cwd();

    this._packageInfo = getPackageJSON(pathToGet);
    this._packageVersion = `${this._packageInfo.name}@${this._packageInfo.version}`;
  }

  exitProcess() {
    console.log(
      chalk.red(
        `ERROR: ${
          this._packageVersion
        } is already published. Please upgrade package version.${LINE_SEPARATORS}`
      )
    );

    process.exitCode = 1;

    return false;
  }

  confirmNotExists() {
    console.log(
      chalk.green(`${this._packageVersion} is not already published.${LINE_SEPARATORS}`)
    );

    return true;
  }

  checkExists(exists) {
    if (exists) {
      return this.exitProcess();
    }

    return this.confirmNotExists();
  }

  check() {
    console.log(chalk.cyan("Checking if current package version is already published"));

    return versionExists
      .check(this._packageInfo.name, this._packageInfo.version)
      .then(result => Promise.resolve(this.checkExists(result)))
      .catch(err => {
        console.log(chalk.red(`Error checking version: ${err.message}`));
        process.exitCode = 1;
      });
  }
}

module.exports = {
  check: packagePath => new VersionPublished(packagePath).check()
};
