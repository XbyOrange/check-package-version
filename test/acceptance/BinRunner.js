"use strict";

const childProcess = require("child_process");
const path = require("path");

const ENCODING_TYPE = "utf8";

module.exports = class BinRunner {
  constructor(binary, fixture, registry) {
    this._binary = `../../../../bin/${binary}`;
    this._fixture = fixture;
    this._logs = [];
    this._registry = registry;
    this.logData = this.logData.bind(this);
    this._npmEnv = this._registry
      ? {
          ...process.env,
          npm_config_registry: this._registry
        }
      : process.env;
  }

  logData(data) {
    this._logs.push(data);
  }

  async run() {
    return new Promise(resolve => {
      const packageProcess = childProcess.spawn(this._binary, {
        cwd: path.resolve(__dirname, "fixtures", this._fixture),
        env: this._npmEnv
      });

      packageProcess.stdout.setEncoding(ENCODING_TYPE);
      packageProcess.stderr.setEncoding(ENCODING_TYPE);

      packageProcess.stdout.on("data", this.logData);
      packageProcess.stderr.on("data", this.logData);

      packageProcess.on(
        "close",
        function(code) {
          this._exitCode = code;
          resolve({
            code: this._exitCode,
            logs: this._logs.join("")
          });
        }.bind(this)
      );
    });
  }
};
