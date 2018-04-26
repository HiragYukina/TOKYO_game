import {TileMap} from "./tilemap.js"

const tilemap = new TileMap

/**
 * 初期化
 */
const init = () => {
  //キャンパス要素
  canvas = document.getElementById("maincanvas")
  ctx = canvas.getContext("2d")

  // タイルマップの読み込み
  tilemap.load("./images/hapirabi_map.json").then(() => {
    requestAnimationFrame(update)
  })
}

//HTML読み込み完了
window.addEventListener("DOMContentLoaded", init)


/**
 * 更新
 */
function update() {
  requestAnimationFrame(update)
  render()
}


/**
 * 描画
 */
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  switch (gamemode) {
    case "game":
      tilemap.render(ctx, {x: 0, y: 0})
      playerKey();
      break;
  }

}