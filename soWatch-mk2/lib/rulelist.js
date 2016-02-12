"use strict";

exports.option = [
  ["restore", "command", false, 0],
  ["button", true, false, null],
  ["update", 0, true, null],
  ["period", 8, false, null],
  ["download", "command", false, 2],
  ["offline", true, false, 1],
  ["server", "", true, null],
  ["folder", "", true, null]
];
exports.website = [
  [
    "youku",
    0,
    "http://www.youku.com/",
    [true, [["youku_loader", "loader.swf", true, null, "http://static.youku.com/*/v/swf/loader*.swf*"], ["youku_player", "player.swf", true, null, "http://static.youku.com/*/v/swf/*player*.swf*"]]],
    [true, [["youku_filter", null, null, true, "http://*.atm.youku.com/v*?vip=*"]]]
  ],
  [
    "tudou",
    0,
    "http://www.tudou.com/",
    [true, [["tudou_portal", "tudou.swf", true, null, "http://js.tudouui.com/bin/lingtong/PortalPlayer*.swf*"]]],
    [true, [["tudou_filter", null, null, false, "http://*.atm.youku.com/v*?vip=*"]]]
  ],
  [
    "iqiyi",
    0,
    "http://www.iqiyi.com/",
    [true, [["iqiyi_v5", "iqiyi5.swf", true, null, "http://www.iqiyi.com/common/flashplayer/*/MainPlayer*.swf*"], ["iqiyi_out", "iqiyi_out.swf", true, null, "http://www.iqiyi.com/common/flashplayer/*/EnjoyPlayer*.swf*"]]],
    [true, [["iqiyi_filter", null, null, false, ["http://*/videos/other/*/*/*/*.f4v*", "http://data.video.qiyi.com/videos/other/*/*/*/*.hml*"]]]]
  ],
  [
    "letv",
    0,
    "http://www.letv.com/",
    [true, [["letv_player", "letv.swf", true, null, ["http://player.letvcdn.com/*/*/*/*/*/*/newplayer/LetvPlayer.swf*", "http://player.letvcdn.com/*/*/*/*/newplayer/SDKLetvPlayer.swf*"]], ["letv_pccs", "http://www.letv.com/cmsdata/playerapi/pccs_sdk_20141113.xml", false, null, ["http://www.letv.com/cmsdata/playerapi/pccs_PlayerSDK*.xml*", "http://www.letv.com/cmsdata/playerapi/pccs_LiveSDK*.xml*"]]]],
    [true, [["letv_filter", null, null, false, ["http://*/*/*/*/letv-gug/*/ver_*-avc-*-aac-*.letv*", "http://*.letvimg.com/lc*_gugwl/*/*/*/*/*", "http://*.letvimg.com/lc*_diany/*/*/*/*/*"]]]]
  ],
  [
    "sohu",
    0,
    "http://tv.sohu.com/",
    [true, [["sohu_player", "sohu_live.swf", true, null, "http://tv.sohu.com/upload/swf/*/Main.swf*"]]],
    [true, [["sohu_filter", null, null, true, "http://v.aty.sohu.com/v*"]]]
  ],
  [
    "pptv",
    0,
    "http://www.pptv.com/",
    [true, [["pptv_player", "player4player2.swf", true, null, "http://player.pplive.cn/ikan/*/player4player2.swf*"]]],
    [true, [["pptv_filter", null, null, false, "http://de.as.pptv.com/ikandelivery/vast/*draft/*"]]]
  ],
  [
    "qq",
    0,
    "http://v.qq.com/",
    [false, []],
    [true, [["qq_filter", null, null, false, ["http://*/vmind.qqvideo.tc.qq.com/*.mp4?vkey=*", "http://*.gtimg.com/qqlive/*"]]]]
  ]
];
exports.wrapper = [
  ["filter", "youku", ["tudou"]]
];
