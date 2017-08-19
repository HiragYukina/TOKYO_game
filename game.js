var speed = 3;
var f = 100,
  s = 100,
  x = 0;
var keystate = {
  "w": false,
  "d": false,
  "s": false,
  "a": false,
  "e": false
}
function gameRender() {
  stage.addChild(usa);
  stage.addChild(mainUsa);
  ber.drawRect(10, 10, f, 20);
  stage.addChild(ber);
  s_ber.drawRect(10, 30, s, 20);
  stage.addChild(s_ber);
}
function player() {
  x++;
  if (x == 10) {
    f -= 1 + (s % 5);
    x = 0;
    s--;
  }
}

//プレイヤー移動
function gameKey() {
  if (0 <= usa.position.x <= width) {
    if (keystate["w"]) {
      usa.position.y -= speed;
      player();
    }
    if (keystate["s"]) {
      usa.position.y += speed;
      player();
    }
    if (keystate["d"]) {
      usa.position.x += speed;
      player();
    }
    if (keystate["a"]) {
      usa.position.x -= speed;
      player();
    }
    if (keystate["e"]) {} else {}
  }
}

//キーイベント
window.addEventListener("keydown", function(e) {
  keystate[e.key] = true;
});
window.addEventListener("keyup", function(e) {
  keystate[e.key] = false;
});
