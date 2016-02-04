"use strict";

var {Cu} = require("chrome");
var {MatchPattern} = Cu.import("resource://gre/modules/MatchPattern.jsm", {});

exports.fromURL = function (url) {
  var buffer = url.replace(/https?:\/\/(www\.)?/, "*://*.") + "*";
  return new MatchPattern(buffer);
};
exports.fromString = function (string) {
  return new MatchPattern(string);
};
