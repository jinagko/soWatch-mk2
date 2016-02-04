"use strict";

var {Cu} = require("chrome");
var {OS} = Cu.import("resource://gre/modules/osfile.jsm", {});

exports.folder = OS.Path.join(OS.Constants.Path.profileDir, "soWatch");
exports.server = "https://bitbucket.org/kafan15536900/haoutil/raw/master/player/testmod/";
exports.toURI = function (path) {
  return OS.Path.toFileURI(path) + "/";
};
exports.toPath = function (uri) {
  return OS.Path.fromFileURI(uri);
};
exports.copyFile = function (object, target) {
  OS.File.move(object, target);
};
exports.makeFolder = function (folder) {
  OS.File.makeDir(folder);
};
exports.deleteFolder = function (folder) {
  OS.File.removeDir(folder);
};
