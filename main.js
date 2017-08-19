var gameMode = "game"
  var usa,
    mainUsa,
    map,
    ber,
    s_ber;
  var width = 800,
    height = 450;
  var renderOption = {
    antialiasing: false,
    transparent: false,
    resolution: window.devicePixeRatio,
    autoResize: true,
    backgroundColor: 0x000000
  }
  var renderer = PIXI.autoDetectRenderer(width, height, renderOption);
  renderer.view.style.position = "absolute";
  renderer.view.style.top = "0px";
  renderer.view.style.left = "0px";

  var stage = new PIXI.Container();

  window.addEventListener("DOMContentLoaded", init)
  document.body.appendChild(renderer.view)
  window.addEventListener("resize", resize);

  function init() {
    PIXI.loader.add("images/usa.png").add("images/hapirabi0.png").load(setup);
    requestAnimationFrame(animate);
    resize();
    //JSONロード
    (function(loadingMap) {
      var map = new XMLHttpRequest;

      map.addEventListener("load", loadingMap, false);
      map.open("GET", "images/hapirabi_map.json", true);
      map.send(null);
    }(function loadingMap(event) {
      var loadmap = event.target;
      map = JSON.parse(loadmap.responseText);
      console.log("JSON読み込み完了", map);
      var maplist = map.layers[1].data;
    }));
  }
  //画像読み込み
  function setup() {
    usa = new PIXI.Sprite(PIXI.loader.resources["images/usa.png"].texture),
    mainUsa = new PIXI.Sprite(PIXI.loader.resources["images/hapirabi0.png"].texture);
    //ここは後で消す
    ber = new PIXI.Graphics();
    ber.beginFill(0x199fff, 1);
    ber.lineStyle(5, 0xffffff);
    ber.drawRect(10, 10, f, 20);
    s_ber = new PIXI.Graphics();
    s_ber.beginFill(0xffff00, 1);
    s_ber.lineStyle(5, 0xffffff);
    s_ber.drawRect(10, 30, s, 20);
    //
    usa.position.set(width / 2, height / 2);
    mainUsa.position.set(540, 0);
  }

  function animate() {
    stage.removeChildren();
    requestAnimationFrame(animate);
    render();
    renderer.render(stage);
  }

  function render() {

    switch (gameMode) {
      case "game":
        gameRender();
        gameKey();
        break;
      case "end":
        endRender();
        break;
    }
  }
  function resize() {
    ratio = Math.min(window.innerWidth / width, window.innerHeight / height);

    stage.scale.x = stage.scale.y = ratio;

    renderer.resize(Math.ceil(width * ratio), Math.ceil(height * ratio));
  }
