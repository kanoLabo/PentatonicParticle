/// <reference path="../typings/preloadjs/preloadjs.d.ts" />
/// <reference path="../typings/tweenjs/tweenjs.d.ts" />
/// <reference path="../typings/easeljs/easeljs.d.ts" />
/// <reference path="../typings/soundjs/soundjs.d.ts" />
createjs.Sound.initializeDefaultPlugins();
var project;
(function (project) {
    var Main = (function () {
        function Main() {
            trace("Active Plugin is", createjs.Sound.activePlugin.toString());
            createjs.Sound.alternateExtensions = ["mp3"]; // add other extensions to try loading if the src file extension is not supported
        }
        Main.prototype.init = function () {
            var soundManifest = this.createSoundManifest();
            createjs.Sound.registerSounds(soundManifest);
            this.startPreload(soundManifest);
        };
        /*
         * プリロードを開始する
         * */
        Main.prototype.startPreload = function (soundManifest) {
            var _this = this;
            var queue = new createjs.LoadQueue();
            queue.installPlugin(createjs.Sound);
            queue.addEventListener("complete", function (event) { return _this.loadComplete(event); });
            queue.loadManifest(soundManifest);
        };
        /*
         * Soundファイル用マニフェストを作成する
         * */
        Main.prototype.createSoundManifest = function () {
            var audioSpriteData = this.prepareSE();
            var manifest = [
                {
                    src: "sounds/150821_1_01.ogg",
                    data: {
                        channels: 50,
                        audioSprite: audioSpriteData
                    }
                }
            ];
            return manifest;
        };
        /*
         * SEデータを準備する
         * */
        Main.prototype.prepareSE = function () {
            var allSEData = [];
            var SE_STEP = 4000;
            var SE_DURATION = 2600;
            for (var i = 0; i < 11; i++) {
                var seData = {
                    id: "se_" + i,
                    startTime: SE_STEP * i,
                    duration: SE_DURATION
                };
                allSEData[i] = seData;
            }
            return allSEData;
        };
        Main.prototype.loadComplete = function (event) {
            this.startTicker();
        };
        /*
         * Tickerを開始
         * */
        Main.prototype.startTicker = function () {
            var _this = this;
            setInterval(function () { return _this.tick(); }, 200);
        };
        Main.prototype.tick = function () {
            var soundID = "se_" + Math.floor(Math.random() * 11);
            createjs.Sound.play(soundID);
        };
        return Main;
    })();
    project.Main = Main;
})(project || (project = {}));
/** デバッグモードかどうか。本番公開時にはfalseにする */
var DEBUG_MODE = true;
/**
 * デバッグモードが有効で、console.log()が使える時に、
 * コンソールに文字列を出力します。
 * @param {string[]} ...args 出力したい文字列です。
 */
function trace() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    if (DEBUG_MODE && this.console && typeof console.log != "undefined") {
        var str = "";
        if (args.length > 0)
            str = args.join(", ");
        console.log(str);
    }
}
window.addEventListener("load", function (event) {
    var main = new project.Main();
    main.init();
});
//# sourceMappingURL=main.js.map