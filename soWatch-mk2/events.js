"use strict";

var Storage = require("../lib/storage.js");
var Rulelist = require("../lib/rulelist.js");
var FileIO = require("../lib/file-io.js");
var Pattern = require("../lib/makepattern.js");
var Preference = require("../lib/pref-utils.js");
var Worker = require("./worker.js");
var Toolbar = require("./toolbar.js");

var buttonListener = new Array();

function readList() {
  Rulelist.option.forEach(function (element, index, array) {
    var name = Rulelist.option[index][0], value = Rulelist.option[index][1], ignore = Rulelist.option[index][2], menuitem = Rulelist.option[index][3];
    if (value == "command") {
      buttonListener.push(name);
    } else {
      Storage.option[name] = {
        prefs: {name: name, value: value},
        ignore: ignore
      };
    }

    if (menuitem) {
      if (value == "command") {
        Storage.menuitem.push([name, "command"]);
      } else if (typeof value == "boolean") {
        Storage.menuitem.push([name, "boolean"]);
      }
    }
  });

  Rulelist.website.forEach(function (element, index, array) {
    var name = Rulelist.website[index][0], value = Rulelist.website[index][1], address = Rulelist.website[index][2], player = Rulelist.website[index][3], filter = Rulelist.website[index][4];
    Storage.website[name] = {
      prefs: {name: name + "Setting", value: value},
      onSite: Pattern.fromURL(address),
      hasPlayer: player[0],
      player: player[1],
      hasFilter: filter[0],
      filter: filter[1]
    };
  });
}

function handleWrapper() {
  Rulelist.wrapper.forEach(function (element, index, array) {
    var entry = Rulelist.wrapper[index][0], major = Rulelist.wrapper[index][1], minor = Rulelist.wrapper[index][2];
    for (var r in minor) {
      if (entry == "player") {
        if ((Storage.website[major].value == 1 && Storage.website[minor[r]].value != 1) || (Storage.website[major].value != 1 && Storage.website[minor[r]].value == 1)) {
          Preference.setValue(Storage.website[minor[r]].prefs.name, Storage.website[major].value);
        }
      }
      if (entry == "filter") {
        if ((Storage.website[major].value == 2 && Storage.website[minor[r]].value == 0) || (Storage.website[major].value == 0 && Storage.website[minor[r]].value == 2)) {
          Preference.setValue(Storage.website[minor[r]].prefs.name, Storage.website[major].value);
        }
      }
    }
  });
}

function readOption() {
  for (var i in Storage.option) {
    Storage.option[i].value = Preference.getValue(Storage.option[i].prefs.name);
  }

  if (Storage.option.fileServer.value) Storage.file.link = Storage.option.fileServer.value;
  else Storage.file.link = FileIO.server;

  if (Storage.option.fileFolder.value) Storage.file.path = FileIO.toURI(Storage.option.fileFolder.value);
  else Storage.file.path = FileIO.toURI(FileIO.folder);

  Worker.pendingOption();
  handleWrapper();

  if (Storage.option.buttonEnabled.value) Toolbar.create();
  else Toolbar.remove();

  Worker.getUpdate("auto");
};

exports.startup = function () {
  readList();
  readOption();
  Preference.addListener("", readOption);
  buttonListener.forEach(function (element, index, array) {
    Preference.addListener(element, Worker[element]);
  });
};
exports.shutdown = function () {
  Toolbar.remove();
  Preference.removeListener("", readOption);
  buttonListener.forEach(function (element, index, array) {
    Preference.removeListener(element, Worker[element]);
  });
};
