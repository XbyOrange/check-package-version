"use strict";

const versionNotPublished = require("./versionNotPublished");
const versionInChangelog = require("./versionInChangelog");

const check = async pathPackage => {
  const checkVersion = await versionNotPublished.check(pathPackage);
  const checkLog = await versionInChangelog.check(pathPackage);

  return checkVersion && checkLog;
};

module.exports = {
  check
};
