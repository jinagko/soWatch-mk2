"use strict";

var {Cc, Ci} = require("chrome");

exports.io = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
exports.obs = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
exports.sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
