/**
 * アセット管理
 */

var Asset = {};

/**
 * 登録済みのアセットデータ
 *
 * [
 *   {
 *     type: "アセット種類",
 *     name: "アセット名",
 *     src: "アセットのファイルパス",
 *     tag: ["タグ1", "タグ2", ...],
 *   },
 *   :
 * ]
 */
Asset.assets = [];

/**
 * 画像リソース
 */
Asset.images = {};

/**
 * 効果音リソース
 */
Asset.sounds = {};

/**
 * アセットデータの登録
 *
 * @param {Array} assets アセット情報の配列
 * [
 *   {
 *     type: "アセット種類",
 *     name: "アセット名",
 *     src: "アセットのファイルパス",
 *     tag: ["タグ1", "タグ2", ...]
 *   },
 *   :
 * ]
 */
Asset.register = function(assets) {

  if (assets.constructor.name !== 'Array') {
    console.warn('Asset.register: アセット情報としてArray以外のパラメータが渡された' + assets);
    return;
  }
  Asset.assets = Asset.assets.concat(assets);

};

/**
 * JSONのファイルパスからのアセットデータの登録
 *
 * @param {String} src JSONのファイルパス
 * @param {Function} onload 登録完了時のコールバック関数
 */
Asset.registerByJsonFile = function(src, onload) {

  var xhr = new XMLHttpRequest();
  xhr.open('GET', src, true);
  xhr.responseType = 'text';
  xhr.addEventListener('loadend', function() {
    if (xhr.status == 200) {
      Asset.register(JSON.parse(xhr.response));
      if (onload && typeof onload === 'function') {
        onload();
      }
    } else {
      console.error('アセットデータのJSONファイルの読み込みに失敗: ' + src + ' ' + xhr.status + ' ' + xhr.statusText);
    }
  });
  xhr.send();

};

/**
 * アセットの読み込み
 *
 * @param {String} name アセット名
 * @param {Function} onload 読み込み完了時に呼ばれるコールバック関数
 */
Asset.load = function(name, onload) {

  var asset = Asset.assets.find(function(asset) {
    return asset.name === name;
  });

  switch (asset.type) {
    case 'image':
      Asset._loadImage(asset, onload);
      break;
    case 'sound':
      Asset._loadSound(asset, onload);
      break;
  }

};

/**
 * 画像の読み込み
 */
Asset._loadImage = function(asset, onload) {
  var image = new Image();
  image.src = asset.src;
  Asset.images[asset.name] = image;
  image.onload = onload;
}

/**
 * 効果音の読み込み
 */
Asset._loadSound = function(asset, onload) {
  var request = new XMLHttpRequest();
  request.open('GET', asset.src, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    Audio.ctx.decodeAudioData(request.response, function(buffer) {
      Asset.sounds[asset.name] = buffer;
      onload();
    }, function() {
      throw new Error('効果音の読み込みに失敗: ' + asset.name + ' ' + asset.src);
    });
  };
  request.send();
};

/**
 * タグからのアセット読み込み
 *
 * @param {String} tag 読み込むタグ
 * @param {Function} onload 読み込み完了時に呼ばれるコールバック関数
 */
Asset.loadByTag = function(tag, onload) {

  var assets = Asset.assets.filter(function(asset) {
    return asset.tag.includes(tag);
  });
  var total = assets.length;
  var loaded = 0;

  for (var i = 0; i < assets.length; i++) {
    Asset.load(assets[i].name, function() {
      loaded++;
      if (loaded >= total && onload && typeof onload === 'function') {
        onload();
      }
    });
  }

};

/**
 * タグの配列からのアセットの読み込み
 *
 * @param {Array} tags 読み込むタグの配列
 * @param {Function} onload 読み込み完了時に呼ばれるコールバック関数
 */
Asset.loadByTags = function(tags, onload) {

  var total = tags.length;
  var loaded = 0;
  for (var i = 0; i < tags.length; i++) {
    Asset.loadByTag(tags[i], function() {
      loaded++;
      if (loaded >= total && onload && typeof onload === 'function') {
        onload();
      }
    });
  }

};

/**
 * 登録されている全てのアセットを読み込む
 *
 * @param {Function} onload 読み込み完了時に呼ばれるコールバック関数
 */
Asset.loadAll = function(onload) {

  var total = Asset.assets.length;
  var loaded = 0;
  for (var i = 0; i < total; i++) {
    Asset.load(Asset.assets[i].name, function() {
      loaded++;
      if (loaded >= total && onload && typeof onload === 'function') {
        onload();
      }
    });
  }

};

/**
 * 読み込んだアセットの破棄
 */
Asset.unload = function(name) {

  var asset = Asset.assets.find(function(asset) {
    return asset.name === name;
  });
  if (!asset) {
    return;
  }

  var type = asset.type;
  switch (type) {
    case 'image':
      Asset._unloadImage(asset.name);
      break;
    case 'sound':
      Asset._unloadSound(asset.name);
      break;
  }

};

/**
 * 画像アセットの破棄
 *
 * @param {String} name アセット名
 */
Asset._unloadImage = function(name) {

  if (Asset.images.hasOwnProperty(name)) {
    delete Asset.images[name];
  }

};

/**
 * 音声アセットの破棄
 */
Asset._unloadSound = function(name) {

  if (Asset.sounds.hasOwnProperty(name)) {
    delete Asset.sounds[name];
  }

}
