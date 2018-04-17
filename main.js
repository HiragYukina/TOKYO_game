var gameMode = "game"
  var usa,
    mainUsa,
    ground,
    ase,
    hage;
  var layers,
    map_width,
    map_height,
    tile_rect_w,
    tile_rect_h;
  var width = 800,
    height = 450;
  var x0 = -700;
  var y0 = -900;
  var plyer;
  var score;
  var title;
  var renderOption = {
    antialiasing: false,
    transparent: false,
    resolution: window.devicePixeRatio,
    autoResize: true,
    backgroundColor: 0xffffff
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
    PIXI.loader.add("images/usa.png").add("images/hapi_hu.png").add("images/hapi_hazusi.png").add("images/hapirabi100.png").add("images/hapirabi75.png").add("images/hapirabi50.png").add("images/hapirabi25.png").add("images/kodomo.png").add("images/kodomo_hu.png").add("images/otona.png").add("images/map1.png").add("images/ase.png").add("images/title.png").add("images/start.png").add("images/stop.png").add("images/hapirabi_map.png").load(setup);
    resize();
    //JSONロード
    (function(loadingMap) {
      var map = new XMLHttpRequest;

      map.addEventListener("load", loadingMap, false);
      map.open("GET", "images/hapirabi_map.json", true);
      map.send(null);
    }(function loadingMap(event) {
      var loadmap = event.target;
      var map = JSON.parse(loadmap.responseText);
      //stage抽出
      layers = map.layers;

      //マップの横幅
      map_width = map.width;
      //マップの高さ
      map_height = map.height;
      //タイルの幅
      tile_rect_w = map.tilewidth;
      //タイルの高さ
      tile_rect_h = map.tileheight;

    }));
    requestAnimationFrame(animate);
  }
  //ステージ生成
  function stageinit() {
    var map_id = [0];
    for (var i = 0; i < layers.length; i++) {
      var map = layers[i];
      for (var y = 0; y < 100; y++) {
        for (var x = 0; x < 100; x++) {
          var j = x + (y * 100);
          //サイズ(48,48)
          var tile = [tile_rect_w, tile_rect_h];
          var map.data[j]
        }
      }
    }

  }
  //画像読み込み
  function setup() {
    player = new PIXI.Sprite(PIXI.loader.resources["images/hapirabi_map.png"].texture);
    player.position.set(x0, y0)

    var hageusa = PIXI.utils.TextureCache["images/hapi_hazusi.png"];
    var hagerect = new PIXI.Rectangle(270, 0, 270, 450);
    hageusa.frame = hagerect;
    hage = new PIXI.Sprite(hageusa);
    hage.position.set(520, 0);
    //大きいうさぎ
    var B_usa = PIXI.utils.TextureCache["images/hapirabi100.png"];
    var rect = new PIXI.Rectangle(0, 0, 270, 450);
    B_usa.frame = rect;
    mainUsa = new PIXI.Sprite(B_usa);
    mainUsa.position.set(520, 0);
    //プレイヤー
    //var player = PIXI.utils.TextureCache["images/usa.png"];
    var frames = [];
    var pattern = [0, 1, 0, 2];
    for (var i = 0; i < pattern.length; i++) {
      var usarect = new PIXI.Rectangle(pattern[i] * 48, 0, 48, 48);
      var texture = new PIXI.Texture(PIXI.utils.TextureCache["images/usa.png"]);
      texture.frame = usarect;
      frames.push(texture);
    }
    usa = new PIXI.extras.AnimatedSprite(frames);
    usa.animationSpeed = 0.1;
    usa.play();
    usa.position.set(x, y);

    //汗
    var a = PIXI.utils.TextureCache["images/ase.png"];
    var arect = new PIXI.Rectangle(0, 0, 270, 450);
    a.frame = arect;
    ase = new PIXI.Sprite(a);
    ase.position.set(520, 0);

    //スコア
    score = new PIXI.Text(b, {fill: "#000000"});
    score.position.x = 0;
    score.position.y = 10;

    title = new PIXI.Sprite(PIXI.loader.resources["images/title.png"].texture);
    stage.addChild(player);
    stage.addChild(usa);
    stage.addChild(mainUsa);
    stage.addChild(ase);

    stageinit();
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
    renderer.render(stage);
  }

  function render() {

    switch (gameMode) {
      case "title":
        titleRender();
        break;
      case "game":
        gameRender();
        gameKey();
        //  gamestag();
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
