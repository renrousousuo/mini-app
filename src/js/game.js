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
    onScoreChange: null, // function(currScore, oldScore, maxScore) { ... }
    onWeixinReady: null
  };

  var maxScore = 0;
  var currScore = 0;
  function init(options) {
    var options = options || {};
    for (var name in options) {
      configs[name] = options[name];
    }
    maxScore = localStorage['__name__.maxScore'] || 0;
    replay();
  }
  exports.init = init;

  function setCurrScore(value) {
    if (configs.onScoreChange) {
      configs.onScoreChange(value, currScore, maxScore);
    }
    currScore = value;
    if (currScore > maxScore) { // 保存历史记录
      maxScore = currScore;
      localStorage['__name__.maxScore'] = maxScore;
    }
  }

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

  function replay() {
    /* TODO */
  }
  exports.replay = replay;

}(game, window, document);