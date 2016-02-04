"use strict";

var Events = require("./data/events.js");
var HttpRequest = require("./data/httprequest.js");

exports.main = function (options, callbacks) {
  Events.startup();
  HttpRequest.addListener();
};

exports.onUnload = function (reason) {
  Events.shutdown();
  HttpRequest.removeListener();
};
