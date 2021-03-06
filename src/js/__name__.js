var __name__ = __name__ || {};

void function(exports) {
  /*<debug>*/
  function __uri(url) {
    return url;
  }
  /*</debug>*/

  var options = {
    name: '__name__',
    home: __uri('__homepage__'),
    more: __uri('__morepage__'),
    title: '__title__',
    desc: '__description__',
    channel: '__channel__',
    coverUrl: __uri('__cover-url__'),
    coverWidth: '__cover-width__',
    coverHeight: '__cover-height__',
    /**
     * 游戏结束
     */
    onGameover: function() {
      /* TODO */
    },
    /**
     * 游戏重新开始
     */
    onReplay: function() {
      /* TODO */
    },
    /**
     * 游戏积分发生改变
     * @param{Number} currScore 当前积分
     * @param{Number} oldScore 上次积分
     * @param{Number} maxScore 最高积分
     * @param{Object} result 分享时的标题和描述
     *  @field{String} title 标题
     *  @field{String} desc 描述
     */
    onScoreChange: function(currScore, oldScore, maxScore, result) {
      if (currScore > maxScore) {
        /* TODO : 新记录出现 */
      }
      /* TODO */
    }
  };

  function init() {
    game.init(options);
  }
  exports.init = init;
  // game.replay();
  // game.more();
  /* TODO : 游戏逻辑 */
  init();

}(__name__);