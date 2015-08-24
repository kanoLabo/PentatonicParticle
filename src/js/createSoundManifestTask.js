var project;
(function (project) {
    /*
    *
    * 各オーディオファイル用のSoundManifestをつくるためのタスク
    *
    */
    var CreateSoundManifestTask = (function () {
        function CreateSoundManifestTask() {
        }
        CreateSoundManifestTask.prototype.getSoundManifest = function () {
            var soundManifest = this.createSoundManifest();
            return soundManifest;
        };
        /*
         * Soundファイル用マニフェストを作成する
         * */
        CreateSoundManifestTask.prototype.createSoundManifest = function () {
            var manifest = [];
            var SE_NUM = 11;
            for (var i = 0; i < SE_NUM; i++) {
                var seData = {
                    id: "se_" + i,
                    src: "sounds/se_" + i + ".ogg"
                };
                manifest[i] = seData;
            }
            manifest[SE_NUM] = {
                id: "bgm",
                src: "sounds/bgm.ogg",
                duration: 16 * 1000
            };
            return manifest;
        };
        return CreateSoundManifestTask;
    })();
    project.CreateSoundManifestTask = CreateSoundManifestTask;
})(project || (project = {}));
//# sourceMappingURL=createSoundManifestTask.js.map