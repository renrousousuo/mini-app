var game = game || {};

void function(exports) {

  if (base.isPC()) { // PC 上浏览
    /*<debug>*/
    if (location.protocol !== 'file:') {
    /*</debug>*/
      location.href = base.format('pc.html#{search}#{hash}', location);
      return;
    /*<debug>*/
    }
    /*</debug>*/
  }

  var strWeixinJSBridgeReady = 'WeixinJSBridgeReady';
  var maxScoreKey;

  var configs = {
    onGameover: null, // function() { ... }
    onReplay: null, // function() { ... }
    onScoreChange: null, // function(currScore, oldScore, maxScore, result) { ... }
    onWeixinReady: null // function() { ... }
  };

  var maxScore = 0; // 历史记录
  var currScore = 0; // 当前积分

  /**
   * 初始化游戏
   * @param{Object} options 选项
   */
  function init(options) {
    var options = options || {};
    for (var name in options) {
      configs[name] = options[name];
    }
    maxScoreKey = base.format('#{name}.#{channel}.maxScore', configs);
    maxScore = localStorage[maxScoreKey] || 0;
    setCurrScore(0);
    replay();
  }
  exports.init = init;

  /**
   * 当前积分改变
   * @param{Number} value 新积分值
   */
  function setCurrScore(value) {
    if (configs.onScoreChange) {
      var result = {};
      configs.onScoreChange(value, currScore, maxScore, result);
      if (typeof result.title === 'string') {
        configs.title = result.title;
      }
      if (typeof result.desc === 'string') {
        configs.desc = result.desc;
      }
    }
    currScore = value;
    if (currScore > maxScore) { // 保存历史记录
      maxScore = currScore;
      localStorage[maxScoreKey] = maxScore;
    }
  }

  /**
   * 增加积分
   * @param{Number} offset 变化的部分
   */
  function setScoreBy(offset) {
    setCurrScore(currScore + offset);
  }
  exports.setScoreBy = setScoreBy;

  /**
   * 设置积分
   * @param{Number} value 变化后的值
   */
  function setScoreTo(value) {
    setCurrScore(value);
  }
  exports.setScoreTo = setScoreTo;

  /**
   * 更多游戏
   */
  function more() {
    location.href = configs.more;
  }
  exports.more = more;

  /*global WeixinJSBridge: true*/
  document.addEventListener(strWeixinJSBridgeReady, function(e) {
    if (configs.onWeixinReady) {
      configs.onWeixinReady(e);
    }

    WeixinJSBridge.on('menu:share:appmessage', function() {
      WeixinJSBridge.invoke('sendAppMessage', {
        img_width: configs.coverWidth,
        img_height: configs.coverHeight,
        img_url: configs.coverUrl,
        link: configs.home,
        desc: configs.desc,
        title: configs.title
      }, more);
    });

    WeixinJSBridge.on('menu:share:timeline', function() {
      WeixinJSBridge.invoke('shareTimeline', {
        img_width: configs.coverWidth,
        img_height: configs.coverHeight,
        img_url: configs.coverUrl,
        link: configs.home,
        desc: configs.desc,
        title: configs.title
      }, more);
    });
  });

  /**
   * 从新游戏开始
   */
  function replay() {
    hideGameover();
    setCurrScore(0);
    if (configs.onReplay) {
      configs.onReplay();
    }
  }
  exports.replay = replay;

  /**
   * 游戏结束
   */
  function gameover() {
    if (configs.onGameover) {
      configs.onGameover();
    }
    showGameover();
  }

  exports.gameover = gameover;

  var panelShare = document.querySelector('#panelShare');
  if (panelShare) {
    panelShare.addEventListener('touchend', function() {
      hideShare();
    });
  }

  /**
   * 显示分享蒙层
   */
  function showShare() {
    if (panelShare) {
      panelShare.style.display = 'block';
    }
  }

  /**
   * 隐藏分享蒙层
   */
  function hideShare() {
    if (panelShare) {
      panelShare.style.display = '';
    }
  }

  exports.showShare = showShare;
  exports.hideShare = hideShare;

  var panelGameover = document.querySelector('#panelGameover');
  /**
   * 显示分享蒙层
   */
  function showGameover() {
    if (panelGameover) {
      panelGameover.style.display = 'block';
    }
  }

  /**
   * 隐藏分享蒙层
   */
  function hideGameover() {
    if (panelGameover) {
      panelGameover.style.display = '';
    }
  }

  exports.showGameover = showGameover;
  exports.hideGameover = hideGameover;

  var browser = base.browser();

  var btnShare = document.querySelector('#btnShare');
  if (btnShare) {
    btnShare.addEventListener('click', function() {
      if (browser['baidubrowser']) { // 百度浏览器
        if (typeof flyflow_webkit_js != 'undefined') {
          flyflow_webkit_js.onShare(
            configs.title,
            configs.img_url,
            configs.home
          );
        }
        return;
      }
      showShare();
    });
  }

  var btnReplay = document.querySelector('#btnReplay');
  if (btnReplay) {
    btnReplay.addEventListener('click', function() {
      replay();
    });
  }

  var imgShare = document.querySelector('#panelShare img');
  if (browser['weixin']) { // 微信
    imgShare.src = 'img/weixin-share.png';
  }

  document.body.addEventListener('touchmove', function(e) {
    e.stopPropagation();
    e.preventDefault();
  });
}(game);