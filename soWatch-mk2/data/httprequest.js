"use strict";

var Storage = require("../lib/storage.js");
var Pattern = require("../lib/makepattern.js");
var Services = require("../lib/services.js");
var {Cc, Ci, Cr, Cu} = require("chrome");
var {NetUtil} = Cu.import("resource://gre/modules/NetUtil.jsm", {});

var swf = Pattern.fromString("http://*/*.swf*");
var xml = Pattern.fromString("http://*/*.xml*");

function getFilter(rule, request) {
  if (rule["secured"]) request.suspend();
  else request.cancel(Cr.NS_BINDING_ABORTED);
}

function getPlayer(local, rule, callback) {
  if (local) var object = rule["device"];
  else var object = rule["ranged"];

  NetUtil.asyncFetch(object, function (inputStream, status) {
    var binaryOutputStream = Cc["@mozilla.org/binaryoutputstream;1"].createInstance(Ci.nsIBinaryOutputStream);
    var storageStream = Cc["@mozilla.org/storagestream;1"].createInstance(Ci.nsIStorageStream);
    var count = inputStream.available();
    var data = NetUtil.readInputStreamToString(inputStream, count);
      storageStream.init(512, count, null);
      binaryOutputStream.setOutputStream(storageStream.getOutputStream(0));
      binaryOutputStream.writeBytes(data, count);
      rule["storageStream"] = storageStream;
      rule["count"] = count;
    if (typeof callback == "function") {
      callback();
    }
  });
}

function TrackingListener() {
  this.originalListener = null;
  this.rule = null;
}
TrackingListener.prototype = {
  onStartRequest: function (request, context) {
    this.originalListener.onStartRequest(request, context);
  },
  onStopRequest: function (request, context) {
    this.originalListener.onStopRequest(request, context, Cr.NS_OK);
  },
  onDataAvailable: function (request, context) {
    this.originalListener.onDataAvailable(request, context, this.rule["storageStream"].newInputStream(0), 0, this.rule["count"]);
  }
}

var HttpRequest = {
  observe: function (subject, topic, data) {
    if (topic == "http-on-examine-response") {
      HttpRequest.filter(subject);
      HttpRequest.player(subject);
    }
  },
  filter: function (subject) {
    var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);

    for (var i in Storage.filter) {
      var rule = Storage.filter[i];
      if (rule["target"] && rule["target"].matches(httpChannel.URI)) {
        if (i.includes("iqiyi")) {  // issue #7 细节补丁
          this.iqiyi ++;
          if (this.iqiyi != 2) getFilter(rule, httpChannel);
        } else {
          getFilter(rule, httpChannel);
        }
      }
    }
  },
  player: function (subject) {
    var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);

    if (!swf.matches(httpChannel.URI) && !xml.matches(httpChannel.URI)) return;

    for (var i in Storage.website) {
      if (Storage.website[i]["onSite"].matches(httpChannel.URI)) {
        if (i == "iqiyi") { // issues #7 前置补丁
          this.iqiyi = 0;
        }
        Storage.website[i].popup = true;
      } else {
        Storage.website[i].popup = false;
      }
    }

    for (var i in Storage.player) {
      var rule = Storage.player[i];
      if (rule["target"] && rule["target"].matches(httpChannel.URI)) {
        if (!rule["storageStream"] || !rule["count"]) {
          httpChannel.suspend();;
          getPlayer(Storage.option.offline.value, rule, function () {
            httpChannel.resume();
          });
        }
        var newListener = new TrackingListener();
        subject.QueryInterface(Ci.nsITraceableChannel);
        newListener.originalListener = subject.setNewListener(newListener);
        newListener.rule = rule;
        break;
      }
    }
  }
};

exports.addListener = function () {
  Services.obs.addObserver(HttpRequest, "http-on-examine-response", false);
};
exports.removeListener = function () {
  Services.obs.removeObserver(HttpRequest, "http-on-examine-response");
};
