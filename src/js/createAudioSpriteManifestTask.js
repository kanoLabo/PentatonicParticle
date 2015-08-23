var project;
(function (project) {
    /*
    *
    * AudioSpriteのためのSoundManifestをつくるためのタスク
    *
    */
    var CreateAudioSpriteManifestTask = (function () {
        function CreateAudioSpriteManifestTask() {
        }
        CreateAudioSpriteManifestTask.prototype.getSoundManifest = function () {
            var soundManifest = this.createSoundManifest();
            return soundManifest;
        };
        /*
         * Soundファイル用マニフェストを作成する
         * */
        CreateAudioSpriteManifestTask.prototype.createSoundManifest = function () {
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
        CreateAudioSpriteManifestTask.prototype.prepareSE = function () {
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
        return CreateAudioSpriteManifestTask;
    })();
    project.CreateAudioSpriteManifestTask = CreateAudioSpriteManifestTask;
})(project || (project = {}));
//# sourceMappingURL=createAudioSpriteManifestTask.js.map