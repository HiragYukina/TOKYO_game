/**
 * タイルマップ
 */
export class TileMap {

    /**
     * コンストラクタ
     */
    constructor() {
        this.layers = null
        this.width = null
        this.height = null
        this.tilewidth = null
        this.tileheight = null
        this.tilesets = null
    }

    /**
     * マップデータを読み込む
     * @param {String} src マップファイルのパス
     * @return {Promise}
     */
    load(src) {
        return new Promise((resolve, reject) => {
            fetch(src).then(response => {
                return response.json()
            }).then(json => {
                this._parse(json)

                // マップで使用している画像の読み込み
                Promise.all(this.tilesets.map(tileset => {
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
                            Asset.register([
                                {
                                    type: "image",
                                    name: filename,
                                    src: "images/" + filename
                                }
                            ])
                            Asset.load(filename, () => {
                                resolve()
                            })
                        })
                    })
                })).then(() => {
                    resolve()
                })
            })
        })
    }

    /**
     * マップの描画
     * @param {CanvasRenderingContext2D} ctx
     * @param {Camera} camera
     */
    render(ctx, camera) {
        const canvas = ctx.canvas
        const screenLeft = camera.x - canvas.width / 2
        const screenTop = camera.y - canvas.height / 2

        const startTileX = Math.floor(screenLeft / this.tilewidth)
        const startTileY = Math.floor(screenTop / this.tileheight)

        const tileScreenWidth = canvas.width / this.tilewidth
        const tileScreenHeight = canvas.height / this.tileheight

        for (let layerId = 0; layerId < this.layers.length; layerId++) {
            for (let y = 0; y < tileScreenHeight; y++) {
                for (let x = 0; x < tileScreenWidth; x++) {
                    const index = startTileX + x + (startTileY + y) * this.width

                    const id = this.layers[layerId].data[index] - 1
                    const sx = (id % 20) * this.tilewidth
                    const sy = Math.floor(id / 15) * this.tileheight
                    const dx = x * this.tilewidth - screenLeft % this.tilewidth
                    const dy = y * this.tileheight - screenTop % this.tileheight

                    let tilesetId = 0
                    while (true) {
                        if (tilesetId >= this.tilesets.length - 1 || this.tilesets[tilesetId + 1].firstgid < id) {
                            break
                        }
                        tilesetId++
                    }

                    const image = Asset.images[this.tilesets[tilesetId].imagePath]
                    ctx.drawImage(image, sx, sy, this.tilewidth, this.tileheight, dx, dy, this.tilewidth, this.tileheight)
                }
            }
        }
    }

    /**
     * マップデータの解析
     * @param {Object} data マップデータ
     */
    _parse(data) {
        this.layers = data.layers
        this.width = data.width
        this.height = data.height
        this.tilewidth = data.tilewidth
        this.tileheight = data.tileheight
        this.tilesets = data.tilesets
    }

}