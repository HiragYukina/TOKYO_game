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

  // テスト用のカーソルキー入力によるカメラ移動処理
  if (keyState.up) {
    camera.y -= 10
  } else if (keyState.down) {
    camera.y += 10
  }
  if (keyState.left) {
    camera.x -= 10
  } else if (keyState.right) {
    camera.x += 10
  }

  // 描画
  render()
}


/**
 * 描画
 */
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  switch (gamemode) {
    case "game":
      tilemap.render(ctx, camera)
      playerKey();
      break;
  }

}


/**
 * 簡易的なカーソルキーの処理
 */
var keyState = {
  up: false,
  down: false,
  left: false,
  right: false
}
addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      keyState.up = true
      break
    case "ArrowDown":
      keyState.down = true
      break
    case "ArrowLeft":
      keyState.left = true
      break
    case "ArrowRight":
      keyState.right = true
      break
  } 
})
addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowUp":
      keyState.up = false 
      break
    case "ArrowDown":
      keyState.down = false
      break
    case "ArrowLeft":
      keyState.left = false
      break
    case "ArrowRight":
      keyState.right = false
      break
  } 
})