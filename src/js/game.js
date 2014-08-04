var game = game || {};

void function(exports, winElement, docElement) {

  if (base.isPC()) { // PC 上浏览
    /*<debug>*/
    if (location.protocol !== 'file:') {
    /*</debug>*/
      location.href = 'pc.html';
      return;
    /*<debug>*/
    }
    /*</debug>*/
  }

  var strWeixinJSBridgeReady = 'WeixinJSBridgeReady';

  var configs = {
    home: '__homepage__',
    more: '__morepage__',
    title: '__title__',
    desc: '__description__',
    coverUrl: '__cover-url__',
    coverWidth: '__cover-width__',
    coverHeight: '__cover-height__',
    onGameover: null, // function() { ... }
    onReplay: null, // function() { ... }
    onScoreChange: null, // function(currScore, oldScore, maxScore) { ... }
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
    maxScore = localStorage['__name__.maxScore'] || 0;
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
      localStorage['__name__.maxScore'] = maxScore;
    }
  }

  /**
   * 更多游戏
   */
  function more() {
    location.href = configs.home;
  }
  exports.more = more;

  /*global WeixinJSBridge: true*/
  docElement.addEventListener(strWeixinJSBridgeReady, function(e) {
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
    setCurrScore(0);
    if (configs.onReplay) {
      configs.onReplay();
    }
    /* TODO : 处理从新游戏开始 */
  }
  exports.replay = replay;

  /**
   * 游戏结束
   */
  function gameover() {
    if (configs.onGameover) {
      configs.onGameover();
    }
    /* TODO : 处理游戏结束 */
  }

}(game, window, document);