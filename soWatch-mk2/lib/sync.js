"use strict";

var FileIO = require("./file-io.js");
var {Cu} = require("chrome");
var {Downloads} = Cu.import("resource://gre/modules/Downloads.jsm", {});

function fetch(link, file, probe) {
  if (probe > 3) return;

  probe ++;
  var temp = file + "_sotemp"; // 因为Downloads.jsm并不能直接覆盖原文件所以需要使用临时文件
  Downloads.fetch(link, temp, {isPrivate: true}).then(
    function onSuccess() {
      FileIO.copyFile(temp, file);
    },
    function onFailure() {
      FileIO.makeFolder(FileIO.folder);
      fetch(link, file, probe);
    }
  );
}

exports.fetch = fetch;
