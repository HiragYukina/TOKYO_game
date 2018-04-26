//タイルマップ
//レイヤー
let layers
//マップサイズ
let map = {
  width: 0,
  height: 0
}
//マップ最大・最初
let widthMax
let heightMax
let widthMin
let heightMin
//タイルサイズ
let tile = {
  width: 0,
  height: 0
}

//キャンパス
let canvas
let ctx
let image
//カメラ
let camera = {
  x: 500,
  y: 500
}
//スクリーン
const screenWidth = 624
const screenHeight = 480

//ゲームモード
gamemode = "game"
