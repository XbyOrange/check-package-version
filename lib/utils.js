"use strict";
const path = require("path");

const ENCODING_TYPE = "utf8";
const LINE_SEPARATORS = "\n\n";

const getPackageJSON = jsonPath => require(path.resolve(jsonPath, "package.json"));

module.exports = {
  ENCODING_TYPE,
  LINE_SEPARATORS,
  getPackageJSON
};
