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
    var name = element[0], type = element[1];
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

    if (index < array.length - 1) {
      var separator = document.createElement("menuseparator");
      separator.setAttribute("id", "sowatchmk2-separator-" + name);
      popup.appendChild(separator);
    }
  });
}

function createSubItem(document, popup) {
  var childList = {
    Player: "Setting_options.Player",
    Filter: "Setting_options.Filter",
    None: "Setting_options.None"
  };

  for (var x in Storage.website) {
    var separator = document.createElement("menuseparator");
    separator.setAttribute("id", "sowatchmk2-separator-" + x);
    popup.appendChild(separator);

    for (var r in childList) {
      var item = document.createElement("menuitem");
      item.setAttribute("id", "sowatchmk2-" + x + r);
      item.setAttribute("label", Locales(x + childList[r]));
      item.setAttribute("type", "radio");
      if (!Storage.website[x].hasPlayer && r == "Player") item.setAttribute("disabled", "true");
      if (!Storage.website[x].hasFilter && r == "Filter") item.setAttribute("disabled", "true");
      popup.appendChild(item);
    }
  }
}

function menuClick(event) {
  Storage.menuitem.forEach(function (element, index, array) {
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

  for (var x in Storage.website) {
    var website = Storage.website[x];
    if (event.target.id == "sowatchmk2-" + x + "Player") {
      if (!website.hasPlayer) continue;
      Preference.setValue(website.prefs.name, 1);
    } else if (event.target.id == "sowatchmk2-" + x + "Filter") {
      if (!website.hasFilter) continue;
      Preference.setValue(website.prefs.name, 2);
    } else if (event.target.id == "sowatchmk2-" + x + "None") {
      Preference.setValue(website.prefs.name, 0);
    }
  }
}

function menuPopup(event) {
  if (event.target.id == "sowatchmk2-popup") {
    Storage.menuitem.forEach(function (element, index, array) {
      var name = element[0], type = element[1];
      if (type == "boolean") {
        if (Storage.option[name].value) event.target.querySelector("#sowatchmk2-" + name).setAttribute("checked", "true");
        else event.target.querySelector("#sowatchmk2-" + name).setAttribute("checked", "false");
      }
    });

    for (var x in Storage.website) {
      var website = Storage.website[x];
      if (!website["onSite"].matches(event.target.ownerDocument.getElementById("content").currentURI) && !website.popup) {
        event.target.querySelector("#sowatchmk2-separator-" + x).setAttribute("hidden", "true");
        event.target.querySelector("#sowatchmk2-" + x + "Player").setAttribute("hidden", "true");
        event.target.querySelector("#sowatchmk2-" + x + "Filter").setAttribute("hidden", "true");
        event.target.querySelector("#sowatchmk2-" + x + "None").setAttribute("hidden", "true");
      } else {
        event.target.querySelector("#sowatchmk2-separator-" + x).setAttribute("hidden", "false");
        event.target.querySelector("#sowatchmk2-" + x + "Player").setAttribute("hidden", "false");
        event.target.querySelector("#sowatchmk2-" + x + "Filter").setAttribute("hidden", "false");
        event.target.querySelector("#sowatchmk2-" + x + "None").setAttribute("hidden", "false");
      }

      if (website.value == 1) {
        event.target.querySelector("#sowatchmk2-" + x + "Player").setAttribute("checked", "true");
      } else if (website.value == 2) {
        event.target.querySelector("#sowatchmk2-" + x + "Filter").setAttribute("checked", "true");
      } else if (website.value == 0) {
        event.target.querySelector("#sowatchmk2-" + x + "None").setAttribute("checked", "true");
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
