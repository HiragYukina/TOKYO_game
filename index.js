var pixiTiled

var renderer = PIXI.autoDetectRenderer(1024, 768);
document.body.appendChild(renderer.view);

/**
 * Simply load a Tiled map in TMX format like a usual resource
 */
PIXI.loader.add('images/hapirabi_map.tmx').load(function() {
  /**
        *   PIXI.extras.TiledMap() is an extended PIXI.Container()
        *   so you can render it right away
        */
  var tileMap = new PIXI.extras.TiledMap("images/hapirabi_map.tmx");
  renderer.render(tileMap);
});
