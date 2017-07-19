require("node_modules/pixi.js"); //pixi.js ver 4.3.0

(function() {

  /*
SETp.1 元のコンテナ用意(描画要素はこの下にぶら下がる)
*/
  var stage = new PIXIContainer();

  /*描画するレンダラーを用意*/

  var renderer = PIXI.autoDetectRenderer(640, 360, {
    antialias: true, //アンチエイリアスをONに
    backgroundColor: 0x00ffd4, //背景
    // transparent: true;   //背景透明の場合
  });

  /*stageのDOM要素にviewを追加*/
  document.getElementById("stage").appendChild(renderer.view);

  /*animaion関数を定義*/
  var animaion = function() {
    //更新処理
    requestAnimationFrame(animaion);
    //描画
    renderer.render(stage);
  };

  animaion();
}());
