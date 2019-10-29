"use strict";

const fs = require("fs");

const { ENCODING_TYPE } = require("./utils");

const check = async (version, changeLogPath) =>
  new Promise((resolve, reject) => {
    fs.readFile(changeLogPath, ENCODING_TYPE, (error, data) => {
      if (error) {
        reject(new Error(`Error reading CHANGELOG.md file: ${error.message}`));
      } else if (data.includes(`[${version}]`)) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });

module.exports = {
  check
};
