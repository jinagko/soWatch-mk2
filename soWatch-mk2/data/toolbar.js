"use strict";

var Storage = require("../lib/storage.js");
var Preference = require("../lib/pref-utils.js");
var Services = require("../lib/services.js");
var Worker = require("./worker.js");
var Locales = require("sdk/l10n").get;
var {Cu} = require("chrome");
var {CustomizableUI} = Cu.import("resource:///modules/CustomizableUI.jsm", {});

var cssFile = Services.io.newURI(require("sdk/self").data.url("toolbar.css"), null, null);
var iconShown = false;

function createButton(document) {
  var button = document.createElement("toolbarbutton");
  button.setAttribute("id", "sowatchmk2-button");
  button.setAttribute("class", "toolbarbutton-1");
  button.setAttribute("type", "menu");
  button.setAttribute("label", "soWatch! mk2");

  var popup = document.createElement("menupopup");
  popup.setAttribute("id", "sowatchmk2-popup");
  popup.addEventListener("click", menuClick, false);
  popup.addEventListener("popupshowing", menuPopup, false);
  button.appendChild(popup);

  createTopItem(document, popup);
  createSubItem(document, popup);

  return button;
}

function createTopItem(document, popup) {
  Storage.menuitem.forEach(function (element, index, array) {
    element.forEach(function (_element, _index, _array) {
      var name = _element[0], type = _element[1];
      var item = document.createElement("menuitem");
      item.setAttribute("id", "sowatchmk2-" + name);
      item.setAttribute("class", "menuitem-iconic");
      if (type == "boolean") {
        item.setAttribute("label", Locales(name + "_title"));
        item.setAttribute("type", "checkbox");
      } else if (type == "command") {
        item.setAttribute("label", Locales(name + "_label"));
      }
      popup.appendChild(item);
    });
    if (index < array.length - 1) {
      var separator = document.createElement("menuseparator");
      separator.setAttribute("id", "sowatchmk2-separator-" + index);
      popup.appendChild(separator);
    }
  });
}

function createSubItem(document, popup) {
  var childList = {
    player: "_options.Player",
    filter: "_options.Filter",
    none: "_options.None"
  };

  for (var i in Storage.website) {
    var separator = document.createElement("menuseparator");
    separator.setAttribute("id", "sowatchmk2-separator-" + i);
    popup.appendChild(separator);

    for (var x in childList) {
      var item = document.createElement("menuitem");
      item.setAttribute("id", "sowatchmk2-" + i + "-" + x);
      item.setAttribute("label", Locales(i + childList[x]));
      item.setAttribute("type", "radio");
      if (!Storage.website[i].hasPlayer && x == "player") item.setAttribute("disabled", "true");
      if (!Storage.website[i].hasFilter && x == "filter") item.setAttribute("disabled", "true");
      popup.appendChild(item);
    }
  }
}

function menuClick(event) {
  Storage.command.forEach(function (element, index, array) {
    var name = element[0], type = element[1];
    if (event.target.id == "sowatchmk2-" + name) {
      if (type == "command") {
        Worker[name]();
      } else if (type == "boolean") {
        if (Storage.option[name].value) Preference.setValue(Storage.option[name].prefs.name, false);
        else Preference.setValue(Storage.option[name].prefs.name, true);
      }
    }
  });

  for (var i in Storage.website) {
    var website = Storage.website[i];
    if (event.target.id == "sowatchmk2-" + i + "-player") {
      if (!website.hasPlayer) continue;
      Preference.setValue(website.prefs.name, 1);
    } else if (event.target.id == "sowatchmk2-" + i + "-filter") {
      if (!website.hasFilter) continue;
      Preference.setValue(website.prefs.name, 2);
    } else if (event.target.id == "sowatchmk2-" + i + "-none") {
      Preference.setValue(website.prefs.name, 0);
    }
  }
}

function menuPopup(event) {
  if (event.target.id == "sowatchmk2-popup") {
    Storage.command.forEach(function (element, index, array) {
      var name = element[0], type = element[1];
      if (type == "boolean") {
        if (Storage.option[name].value) event.target.querySelector("#sowatchmk2-" + name).setAttribute("checked", "true");
        else event.target.querySelector("#sowatchmk2-" + name).setAttribute("checked", "false");
      }
    });

    for (var i in Storage.website) {
      var website = Storage.website[i];
      if (!website["onSite"].matches(event.target.ownerDocument.getElementById("content").currentURI) && !website.popup) {
        event.target.querySelector("#sowatchmk2-separator-" + i).setAttribute("hidden", "true");
        event.target.querySelector("#sowatchmk2-" + i + "-player").setAttribute("hidden", "true");
        event.target.querySelector("#sowatchmk2-" + i + "-filter").setAttribute("hidden", "true");
        event.target.querySelector("#sowatchmk2-" + i + "-none").setAttribute("hidden", "true");
      } else {
        event.target.querySelector("#sowatchmk2-separator-" + i).setAttribute("hidden", "false");
        event.target.querySelector("#sowatchmk2-" + i + "-player").setAttribute("hidden", "false");
        event.target.querySelector("#sowatchmk2-" + i + "-filter").setAttribute("hidden", "false");
        event.target.querySelector("#sowatchmk2-" + i + "-none").setAttribute("hidden", "false");
      }

      if (website.value == 1) {
        event.target.querySelector("#sowatchmk2-" + i + "-player").setAttribute("checked", "true");
      } else if (website.value == 2) {
        event.target.querySelector("#sowatchmk2-" + i + "-filter").setAttribute("checked", "true");
      } else if (website.value == 0) {
        event.target.querySelector("#sowatchmk2-" + i + "-none").setAttribute("checked", "true");
      }
    }
  }
}

exports.create = function () {
  if (iconShown) return;
  CustomizableUI.createWidget({
    id: "sowatchmk2-button",
    type: "custom",
    defaultArea: CustomizableUI.AREA_NAVBAR,
    onBuild: createButton
  });
  Services.sss.loadAndRegisterSheet(cssFile, Services.sss.AUTHOR_SHEET);
  iconShown = true;
};
exports.remove = function () {
  if (!iconShown) return;
  Services.sss.unregisterSheet(cssFile, Services.sss.AUTHOR_SHEET);
  CustomizableUI.destroyWidget("sowatchmk2-button");
  iconShown = false;
};
