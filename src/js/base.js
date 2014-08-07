var base = base || {};

void function(exports) {

  var ua = navigator.userAgent;
  var mobile = /Mobile|Android|SymbianOS|Phone|Pad|Pod/.test(ua);

  var browsers = {
    firefox: /firefox\/\d+\.\d+/i.test(ua), // 火狐浏览器
    weibo: /Weibo/.test(ua), // 微博浏览器
    baiduboxapp: /baiduboxapp/.test(ua), // 百度框
    baidubrowser: /baidubrowser/.test(ua), // 百度浏览器
    weixin: /MicroMessenger/.test(ua), // 微信
    ucbrowser: /UCBrowser/.test(ua) // UC 浏览器
  };

  /**
   * 获取浏览器环境
   */
  function browser() {
    return browsers;
  }

  exports.browser = browser;

  /**
   * 获取浏览器环境
   */
  function isBrowser(name) {
    return browsers[name];
  }

  exports.isBrowser = isBrowser;

  /**
  * 随机打乱数组
  * @param{Array} arr 数组对象
  */
  function shuffle(arr) {
    for (var i = 0; i < arr.length; i++) {
      var j = parseInt(Math.random() * (arr.length - i));
      var t = arr[arr.length - i - 1];
      arr[arr.length - i - 1] = arr[j];
      arr[j] = t;
    }
  }
  exports.shuffle = shuffle;

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

  /**
   * HTML编码
   * @param {String} text
   */
  function encodeHTML(text){
    return String(text).replace(/["<>& ]/g, function(all){
      return "&" + {
        '"': 'quot',
        '<': 'lt',
        '>': 'gt',
        '&': 'amp',
        ' ': 'nbsp'
      }[all] + ";";
    });
  }

  exports.encodeHTML = encodeHTML;

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
