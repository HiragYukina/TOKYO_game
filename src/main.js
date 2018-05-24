import {createStore} from "./engine/store.js"
import {TileMap} from "./tilemap.js"

let canvas
let ctx
let gamemode = "game"

const tilemap = new TileMap

const INITIAL_STATE = {
  key: {
    left: false,
    right: false,
    up: false,
    down: false
  },

  camera: {
    x: 500,
    y: 1000
  }
}

const UPDATE = Symbol("update")
const KEY = Symbol("key")

const reducerKey = (state, action) => {
  const key = state.key
  switch (action.key) {
    case "ArrowLeft":
      return {
        ...key,
        left: action.state
      }
      break
    case "ArrowRight":
      return {
        ...key,
        right: action.state
      }
      break
    case "ArrowUp":
      return {
        ...key,
        up: action.state
      }
      break
    case "ArrowDown":
      return {
        ...key,
        down: action.state
      }
  }
}

const reducerCamera = (state, action) => {
  const key = state.key
  const camera = state.camera

  return {
    x: ((x, left, right) => {
      if (left && !right) {
        return x - 10
      } else if (!left && right) {
        return x + 10
      } else {
        return x
      }
    })(camera.x, key.left, key.right),

    y: ((y, up, down) => {
      if (up && !down) {
        return y - 10
      } else if (!up && down) {
        return y + 10
      } else {
        return y
      }
    })(camera.y, key.up, key.down),
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE:
      return {
        ...state,
        camera: reducerCamera(state, action)
      }
      break
    case KEY:
      return {
        ...state,
        key: reducerKey(state, action)
      }
      break
    default:
      return state
      break
  }
}

const store = createStore(reducer, INITIAL_STATE)

const updateAction = (time) => {
  return {
    type: UPDATE,
    time
  }
}

const keyAction = (key, state) => {
  return {
    type: KEY,
    key, state
  }
}

/**
 * 初期化
 */
const init = () => {
  //キャンパス要素
  canvas = document.getElementById("maincanvas")
  ctx = canvas.getContext("2d")

  // タイルマップの読み込み
  tilemap.load("./images/hapirabi_map.json").then(() => {
    update(store, 0)
  })
}

//HTML読み込み完了
window.addEventListener("DOMContentLoaded", init)


/**
 * 更新
 */
function update(store, time) {
  store.dispatch(updateAction(time))
  requestAnimationFrame(time => update(store, time))

  // 描画
  render(store.getState())
}


/**
 * 描画
 */
function render(state) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  switch (gamemode) {
    case "game":
      tilemap.render(ctx, state.camera)
      break;
  }

}

addEventListener("keydown", e => onKeyDown(store, e))
addEventListener("keyup", e => onKeyUp(store, e))

const onKeyDown = (store, e) => {
  store.dispatch(keyAction(e.key, true))
}

const onKeyUp = (store, e) => {
  store.dispatch(keyAction(e.key, false))
}