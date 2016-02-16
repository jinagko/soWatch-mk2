"use strict";

var Storage = require("../lib/storage.js");
var Pattern = require("../lib/makepattern.js");
var FileIO = require("../lib/file-io.js");
var Preference = require("../lib/pref-utils.js");
var Synchronize = require("../lib/sync.js");

function getRule(rulelist) {
  rulelist.forEach(function (element, index, array) {
    var name = element[0], player = element[1], remote = element[2], filter = element[3], string = element[4];
    if (player != undefined) {
      if (!remote) {
        Storage.player[name] = {
          offline: player,
          pattern: Pattern.fromString(string)
        };
      } else {
          Storage.player[name] = {
          offline: Storage.file.path + player,
          online: Storage.file.link + player,
          pattern: Pattern.fromString(string)
        };
      }
    }
    if (filter != undefined) {
      Storage.filter[name] = {
        secured: filter,
        pattern: Pattern.fromString(string)
      };
    }
  });
}

function setRule(state, type, rulelist) {
  rulelist.forEach(function (element, index, array) {
    var object = Storage[type][element[0]];
    if (state == "on") {
      object["target"] = object["pattern"];
    }
    if (state == "off") {
      object["target"] = null;
    }
  });
}

exports.pendingOption = function () {
  for (var i in Storage.website) {
    Storage.website[i].value = Preference.getValue(Storage.website[i].prefs.name);

    if (Storage.website[i].hasPlayer) {
      getRule(Storage.website[i].player);
      if (Storage.website[i].value == 1) setRule("on", "player", Storage.website[i].player);
      else setRule("off", "player", Storage.website[i].player);
    } else {
      if (Storage.website[i].value == 1) Preference.resetValue(Storage.website[i].prefs);
    }

    if (Storage.website[i].hasFilter) {
      getRule(Storage.website[i].filter);
      if (Storage.website[i].value == 2) setRule("on", "filter", Storage.website[i].filter);
      else setRule("off", "filter", Storage.website[i].filter);
    } else {
      if (Storage.website[i].value == 2) Preference.resetValue(Storage.website[i].prefs);
    }

    if (Storage.website[i].value > 2) Preference.resetValue(Storage.website[i].prefs);
  }
};
exports.restore = function () {
  for (var i in Storage.option) {
    if (Storage.option[i].ignore) continue;
    Preference.resetValue(Storage.option[i].prefs);
  }
  for (var x in Storage.website) {
    Preference.resetValue(Storage.website[x].prefs);
  }
};
exports.download = function (state) {
  var when = parseInt(Date.now() / 1000);
  if (state && Storage.option["update"].value > when) return;

  for (var i in Storage.player) {
    if ("online" in Storage.player[i]) {
      var link = Storage.player[i]["online"];
      var file = FileIO.toPath(Storage.player[i]["offline"]);
      Synchronize.fetch(link, file);
    }
  }
  Preference.setValue(Storage.option["update"].prefs.name, when + Storage.option["period"].value * 86400);
};
