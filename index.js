"use strict";

const checkVersion = require("./lib/checks/versionNotPublished");
const checkChangelog = require("./lib/checks/versionInChangelog");
const checkAll = require("./lib/checks/all");

module.exports = {
  checkVersion: checkVersion.check,
  checkChangelog: checkChangelog.check,
  checkAll: checkAll.check
};
