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
            for (var i = 0; i < 11; i++) {
                var seData = {
                    id: "se_" + i,
                    src: "sounds/se_" + i + ".ogg"
                };
                manifest[i] = seData;
            }
            return manifest;
        };
        return CreateSoundManifestTask;
    })();
    project.CreateSoundManifestTask = CreateSoundManifestTask;
})(project || (project = {}));
//# sourceMappingURL=createSoundManifestTask.js.map