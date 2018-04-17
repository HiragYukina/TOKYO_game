//HTML読み込み完了
window.addEventListener("DOMContentLoaded", init)

//初期化
function init() {
  //キャンパス要素
  canvas = document.getElementById("maincanvas")
  ctx = canvas.getContext("2d")
  //マップタイル読み込み
  image = new Image()
  image.src = "images/map1.png"
  image.addEventListener("load", function() {
    //chromeのバグ回避
    let backcanvas = document.createElement("canvas")
    backcanvas.width = 960
    backcanvas.height = 720
    const backctx = backcanvas.getContext("2d")
    backctx.drawImage(image, 0, 0)
    image = backcanvas
  })

  //マップ
  //読み込み
  mapload(function(event) {
    loadmap(event);
    requestAnimationFrame(updata)
  })
}

function mapload(onload) {
  //JSON読み込み
  var map = new XMLHttpRequest

  map.addEventListener("load", onload, false)
  map.open("GET", "images/hapirabi_map.json", true)
  map.send(null)
}
function loadmap(event) {
  var loadmap = event.target
  var mainmap = JSON.parse(loadmap.responseText)

  //レイヤー抽出
  layers = mainmap.layers
  //マップの横幅
  map.width = mainmap.width
  //マップ高さ
  map.height = mainmap.height
  //タイル
  tile.width = mainmap.tilewidth
  tile.height = mainmap.tileheight

  //マップの最大・最小
  widthMax = map.width * tile.width
  heightMax = map.height * tile.height
}

function renderMap() {

  const screenLeft = camera.x - screenWidth / 2
  const screenTop = camera.y - screenHeight / 2
  //描画開始位置
  const startTileX = Math.floor(screenLeft / tile.width)
  const startTiley = Math.floor(screenTop / tile.height)
  //タイル数
  const tileX = screenWidth / tile.width
  const tileY = screenHeight / tile.height
  for (var i = 0; i < layers.length; i++) {
    for (var y = 0; y < tileY; y++) {
      for (var x = 0; x < tileX; x++) {
        const index = startTileX + x + (startTiley + y) * map.width

        let id = layers[i].data[index] - 1
        let sx = (id % 20) * tile.width
        let sy = Math.floor(id / 15) * tile.height
        const dx = x * tile.width - screenLeft % tile.width
        const dy = y * tile.height - screenTop % tile.height
        //         タイル画像、トリミング　ｘ、ｙ、  タイル幅ｘ、ｙ、描画開始位置　ｘ、ｙ　タイル幅　　　　　　　描画タイルｘ、ｙ、
        ctx.drawImage(image, sx, sy, tile.width, tile.height, dx, dy, tile.width, tile.height);

      }
    }
  }

}

function updata() {
  requestAnimationFrame(updata)
  render()
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  switch (gamemode) {
    case "game":
      renderMap();
      playerKey();
      break;
  }

}
