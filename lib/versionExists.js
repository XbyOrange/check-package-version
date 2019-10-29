"use strict";

const childProcess = require("child_process");

const { ENCODING_TYPE } = require("./utils");

const defaultOptions = {
  log: false,
  cwd: process.cwd()
};

const check = async (packageName, packageVersion, options) =>
  new Promise((resolve, reject) => {
    const finalOptions = { ...defaultOptions, ...options };
    const logs = [];
    const logData = data => logs.push(data);

    const npmProcess = childProcess.spawn("npm", ["view", `${packageName}@${packageVersion}`], {
      cwd: finalOptions.cwd
    });

    npmProcess.stdout.setEncoding(ENCODING_TYPE);
    npmProcess.stderr.setEncoding(ENCODING_TYPE);

    npmProcess.stdout.on("data", logData);
    npmProcess.stderr.on("data", logData);

    npmProcess.on("close", code => {
      const allLogs = logs.join("");
      if (finalOptions.log) {
        console.log(allLogs);
      }

      if (code !== 0) {
        if (allLogs.includes("404")) {
          resolve(false);
        } else {
          reject(new Error(`Error executing npm view ${packageName}@${packageVersion}`));
        }
      } else if (!allLogs.length) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });

module.exports = {
  check
};
