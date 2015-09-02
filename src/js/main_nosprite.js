/// <reference path="../typings/preloadjs/preloadjs.d.ts" />
/// <reference path="../typings/tweenjs/tweenjs.d.ts" />
/// <reference path="../typings/easeljs/easeljs.d.ts" />
/// <reference path="../typings/soundjs/soundjs.d.ts" />
/// <reference path="particleCreator.ts" />
/// <reference path="createSoundManifestTask.ts" />
/// <reference path="trace.ts" />
createjs.Sound.initializeDefaultPlugins();
var project;
(function (project) {
    var Main = (function () {
        function Main() {
            project.trace("Active Plugin is", createjs.Sound.activePlugin.toString());
            createjs.Sound.alternateExtensions = ["mp3"]; // add other extensions to try loading if the src file extension is not supported
        }
        Main.prototype.init = function () {
            var createSoundManifestTask = new project.CreateSoundManifestTask();
            var soundManifest = createSoundManifestTask.getSoundManifest();
            this.startPreload(soundManifest);
        };
        /*
         * プリロードを開始する
         */
        Main.prototype.startPreload = function (soundManifest) {
            var _this = this;
            var queue = new createjs.LoadQueue();
            queue.installPlugin(createjs.Sound);
            queue.addEventListener("complete", function (event) { return _this.loadComplete(event); });
            queue.setMaxConnections(1);
            queue.loadManifest(soundManifest);
        };
        Main.prototype.loadComplete = function (event) {
            var particleCreator = new project.ParticleCreator();
            createjs.Sound.play(project.Param.BGM_ID, { loop: -1, pan: 0.01 });
        };
        return Main;
    })();
    project.Main = Main;
})(project || (project = {}));
window.addEventListener("load", function (event) {
    var main = new project.Main();
    main.init();
});
//# sourceMappingURL=main_nosprite.js.map