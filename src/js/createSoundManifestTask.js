/// <reference path="param.ts" />
var project;
(function (project) {
    /*
    * 各オーディオファイル用のSoundManifestをつくるためのタスク
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
         */
        CreateSoundManifestTask.prototype.createSoundManifest = function () {
            var manifest = [];
            for (var i = 0; i < project.Param.SE_NUM; i++) {
                var seData = {
                    id: "se_" + i,
                    src: project.Param.SOUNDS_FOLDER + "se_" + i + ".ogg"
                };
                manifest[i] = seData;
            }
            manifest[project.Param.SE_NUM] = {
                id: project.Param.BGM_ID,
                src: project.Param.SOUNDS_FOLDER + "bgm.ogg",
                duration: project.Param.BGM_DURATION
            };
            return manifest;
        };
        return CreateSoundManifestTask;
    })();
    project.CreateSoundManifestTask = CreateSoundManifestTask;
})(project || (project = {}));
//# sourceMappingURL=createSoundManifestTask.js.map