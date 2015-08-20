/// <reference path="../typings/preloadjs/preloadjs.d.ts" />
/// <reference path="../typings/tweenjs/tweenjs.d.ts" />
/// <reference path="../typings/easeljs/easeljs.d.ts" />
/// <reference path="../typings/soundjs/soundjs.d.ts" />
createjs.Sound.initializeDefaultPlugins();
var project;
(function (project) {
    var Main = (function () {
        function Main() {
            var _this = this;
            project.trace("Active Plugin is", createjs.Sound.activePlugin.toString());
            var assetsPath = "./sounds/";
            var soundManifest = this.createSoundManifest();
            createjs.Sound.alternateExtensions = ["mp3"]; // add other extensions to try loading if the src file extension is not supported
            createjs.Sound.addEventListener("fileload", function () { return _this.startTicker(); });
            createjs.Sound.registerSounds(soundManifest, assetsPath);
        }
        /*
         * Soundファイル用マニフェストを作成する
         * */
        Main.prototype.createSoundManifest = function () {
            var audioSpriteData = this.prepareSE();
            var manifest = [
                {
                    src: "150820_1_01.ogg",
                    data: {
                        channels: 5,
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
            var SE_STEP = 500;
            var SE_DURATION = 300;
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
        /*
        * Tickerを開始
        * */
        Main.prototype.startTicker = function () {
            var _this = this;
            setInterval(function () { return _this.tick(); }, 100);
        };
        Main.prototype.tick = function () {
            var soundID = "se_" + Math.floor(Math.random() * 11);
            createjs.Sound.play(soundID);
        };
        return Main;
    })();
    project.Main = Main;
})(project || (project = {}));
var project;
(function (project) {
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
    project.trace = trace;
})(project || (project = {}));
window.addEventListener("load", function (event) {
    new project.Main();
});
//# sourceMappingURL=main.js.map