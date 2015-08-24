/// <reference path="../typings/preloadjs/preloadjs.d.ts" />
/// <reference path="../typings/tweenjs/tweenjs.d.ts" />
/// <reference path="../typings/easeljs/easeljs.d.ts" />
/// <reference path="../typings/soundjs/soundjs.d.ts" />
/// <reference path="particleCreator.ts" />
/// <reference path="createAudioSpriteManifestTask.ts" />
createjs.Sound.initializeDefaultPlugins();
var project;
(function (project) {
    var Main = (function () {
        function Main() {
            trace("Active Plugin is", createjs.Sound.activePlugin.toString());
            createjs.Sound.alternateExtensions = ["mp3"]; // add other extensions to try loading if the src file extension is not supported
        }
        Main.prototype.init = function () {
            var createSoundManifestTask = new project.CreateAudioSpriteManifestTask();
            var soundManifest = createSoundManifestTask.getSoundManifest();
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
        Main.prototype.loadComplete = function (event) {
            var particleCreator = new project.ParticleCreator();
            createjs.Sound.play("bgm", { loop: -1, pan: 0.01 });
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