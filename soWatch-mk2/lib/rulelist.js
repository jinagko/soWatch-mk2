"use strict";

exports.option = [
  /** Name, Value, Not Reset, Toolbar group | sort order will affect order in toolbar
      设置名, 预设值, 无视重置, 工具栏中的分组 | 排列顺序将影响在工具栏中的顺序 */
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
  /** Name, Pref.value, Host, [hasPlayer, [Player Rule]], [hasFilter, [Filter Rule]]
      名称, 设置预设值, 域名, [判断播放器, [播放器规则表]], [判断过滤, [过滤规则表]] */
  [
    "youku", // package.json 设置名 youkuSetting , 添加时请注意格式
    0, // 默认规则： 0,禁用
    "http://www.youku.com/", // 域名
           /** RuleName, Player File, hasRemote, isSecured, Pattern
               规则名称, 播放器文件名, 判断远程播放器, 判断安全过滤, 匹配对象 */
    [true, [["youku_loader", "loader.swf", true, null, "http://static.youku.com/*/v/swf/loader*.swf*"], ["youku_player", "player.swf", true, null, "http://static.youku.com/*/v/swf/*player*.swf*"]]],
    [true, [["youku_filter", null, null, true, "http://*.atm.youku.com/v*?vip=*"]]]
  ],
/**  Template End
     模板结束  */
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
  /** Rule Type, Major, Sub-object
      规则类型, 主要参考, 次要对象 */
  ["filter", "youku", ["tudou"]]
];
