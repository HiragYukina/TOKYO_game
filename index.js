var renderer = PIXI.autoDetectRenderer(256, 256);

// それをHTMLファイルに入れる
document.body.appendChild(renderer.view);

// stageという名前の容器（オプジェクト）を作る
var stage = new PIXI.Container();

PIXI.loader.add("images/usa.png").load(setup);

function setup() {
  var usa = new PIXI.Sprite(PIXI.loader.resources["images/usa.png"].texture);
  stage.addChild(usa);
  renderer.render(stage);
}
// レンダラーにstageを受け入れてって伝える
