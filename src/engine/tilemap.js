export const Tilemap = {
    /**
     * タイルマップの作成
     * @param {String} src
     * 
     * @return {TileMap}
     */
    create(src) {
        return new Promise((resolve, reject) => {
            fetch(src).then(response => {
                return response.json()
            }).then(tilemap => {
                // マップで使用している画像の読み込み
                Promise.all(tilemap.tilesets.map(tileset => {
                    const sourcePath = "images/" + tileset.source.match(/([^\/]+?)?$/)[0]
                    return new Promise((resolve, reject) => {
                        fetch(sourcePath).then(response => {
                            return response.text()
                        }).then(text => {
                            const parser = new DOMParser
                            const xml = parser.parseFromString(text, "text/xml")
                            const imageElement = xml.querySelector("image")
                            const path = imageElement.getAttribute("source")
                            const filename = path.match(/([^\/]+?)?$/)[0]
                            tileset.imagePath = filename

                            const tilesetElement = xml.querySelector("tileset")
                            tileset.columns = parseInt(tilesetElement.getAttribute("columns"))

                            Asset.register([{
                                type: "image",
                                name: filename,
                                src: "images/" + filename
                            }])
                            Asset.load(filename, () => {
                                resolve()
                            })
                        })
                    })
                })).then(() => {
                    resolve(tilemap)
                })
            })
        })
    },

    /**
     * マップの描画
     * @param {CanvasRenderingContext2D} ctx
     * @param {TileMap} timemap
     * @param {Camera} camera
     */
    render(ctx, tilemap, camera) {
        const canvas = ctx.canvas
        const screenLeft = camera.x - canvas.width / 2
        const screenTop = camera.y - canvas.height / 2
        const offsetX = (() => {
            if (screenLeft >= 0) {
                return screenLeft % tilemap.tilewidth
            } else {
                return this.tilewidth - 1 - (Math.abs(screenLeft + 1) % tilemap.tilewidth)
            }
        })()
        const offsetY = screenTop >= 0 ? screenTop % tilemap.tileheight : tilemap.tileheight - 1 - (Math.abs(screenTop + 1) % tilemap.tileheight)

        const startTileX = Math.floor(screenLeft / tilemap.tilewidth)
        const startTileY = Math.floor(screenTop / tilemap.tileheight)

        const tileScreenWidth = canvas.width / tilemap.tilewidth
        const tileScreenHeight = canvas.height / tilemap.tileheight

        for (let layerId = 0; layerId < tilemap.layers.length; layerId++) {
            for (let y = 0; y < tileScreenHeight + 1; y++) {
                for (let x = 0; x < tileScreenWidth + 1; x++) {

                    const index = startTileX + x + (startTileY + y) * tilemap.width
                    if (index < 0) {
                        continue
                    }

                    const layer = tilemap.layers[layerId]
                    const id = layer.data[index] - 1
                    if (id == -1) {
                        continue;
                    }

                    const dx = x * tilemap.tilewidth - offsetX
                    const dy = y * tilemap.tileheight - offsetY

                    let tilesetId = 0
                    while (true) {
                        if (tilesetId >= tilemap.tilesets.length - 1 || tilemap.tilesets[tilesetId + 1].firstgid < id) {
                            break
                        }
                        tilesetId++
                    }

                    const tileset = tilemap.tilesets[tilesetId]
                    if (startTileX + x < 0 || startTileX + x > layer.width - 1 || startTileY + y < 0 || startTileY + y > layer.height - 1) {
                        continue
                    } 

                    const sx = (id % tileset.columns) * tilemap.tilewidth
                    const sy = Math.floor(id / tileset.columns) * tilemap.tileheight

                    const image = Asset.images[tilemap.tilesets[tilesetId].imagePath]
                    ctx.drawImage(image, sx, sy, tilemap.tilewidth, tilemap.tileheight, dx, dy, tilemap.tilewidth, tilemap.tileheight)
                }
            }
        }
    }
}