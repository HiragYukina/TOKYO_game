var speed = 3;
var x = width / 3,
  y = height / 2;
var b = 0,
  s = 0;
var keystate = {
  "w": false,
  "d": false,
  "s": false,
  "a": false,
  "e": false
}
function gameRender() {}
//プレイヤー移動
function gameKey() {
  if (keystate["w"]) {
    player.position.y += 2;
  }
  if (keystate["s"]) {
    player.position.y -= 2;
  }
  if (keystate["d"]) {
    mainUsa.alpha = 0.5;
    ase.alpha = 0.5;
    player.position.x -= 2;
  }
  if (keystate["a"]) {
    player.position.x += 2;
  }

  if (keystate["d"] == false) {
    if (mainUsa) {
      mainUsa.alpha = 1;
    }
  }
  if (keystate["e"]) {
    stage.addChild(hage);
    stage.removeChild(mainUsa);
  }

}

//キーイベント
window.addEventListener("keydown", function(e) {
  keystate[e.key] = true;
});
window.addEventListener("keyup", function(e) {
  keystate[e.key] = false;
});
