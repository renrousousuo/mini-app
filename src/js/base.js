var base = base || {};

void function(exports) {

  var mobile = /Mobile|Android|SymbianOS|Phone|Pad|Pod/.test(navigator.userAgent);

  var firefox = /firefox\/\d+\.\d+/i.test(navigator.userAgent);

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

  function isMobile() {
    return mobile;
  }
  function isPC() {
    return !mobile;
  }

  exports.isMobile = isMobile;
  exports.isPC = isPC;

}(base);
