var base = base || {};

void function(exports) {

  var ua = navigator.userAgent;
  var mobile = /Mobile|Android|SymbianOS|Phone|Pad|Pod/.test(ua);

  var firefox = /firefox\/\d+\.\d+/i.test(ua); // 火狐浏览器
  var weibo = /Weibo/.test(ua); // 微博浏览器
  var baiduboxapp = /baiduboxapp/.test(ua); // 百度框
  var baidubrowser = /baidubrowser/.test(ua); // 百度浏览器
  var weixin = /MicroMessenger/.test(ua); // 微信

  /**
   * 获取浏览器环境
   */
  function browser() {
    return {
      firefox: firefox,
      weibo: weibo,
      baiduboxapp: baiduboxapp,
      baidubrowser: baidubrowser,
      weixin: weixin
    };
  }

  exports.browser = browser;

  /* 字符串处理 */
  /**
   * 格式化函数
   * @param {String} template 模板
   * @param {Object} json 数据项
   */
  function format(template, json) {
    return template.replace(/#\{(.*?)\}/g, function(all, key) {
      return json && (key in json) ? json[key] : "";
    });
  }

  exports.format = format;

  /* 声音处理 */
  var soundElements;

  if (mobile) {
    /*<include ../include/mobile.js>*/
  }

  /*
   * 播放声音
   * @param{String} file 文件路径，如是 firefox 则用 ogg 文件播放
   * @param{Boolean} loop 是否循环播放
   * @param{pause} pause 是否暂停，可以异步加载
   */
  function playSound(file, loop, pause) {
    soundElements = soundElements || {};
    try {
      if (!soundElements[file]) {
        var url = firefox ? file.replace(/\.mp3/, '.ogg') : file;
        soundElements[file] = new Audio();
        /* ios 不支持 new Audio(file) */
        soundElements[file].src = url;
        soundElements[file].load();
        loop && soundElements[file].addEventListener('ended', function() {
          this.currentTime = 0;
          this.play();
        }, false);
      }
      if (!pause) {
        soundElements[file].play();
      }
    } catch(ex) {}
  }

  exports.playSound = playSound;

  /**
   * 是否在移动环境
   */
  function isMobile() {
    return mobile;
  }

  /**
   * 是否在 PC 环境
   */
  function isPC() {
    return !mobile;
  }

  exports.isMobile = isMobile;
  exports.isPC = isPC;

}(base);
