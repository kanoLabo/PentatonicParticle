/// <reference path="param.ts" />
var project;
(function (project) {
    /*
     * AudioSprite用のSoundManifestをつくるためのタスク
     */
    var CreateAudioSpriteManifestTask = (function () {
        function CreateAudioSpriteManifestTask() {
            this.AUDIO_FILE = "150901.ogg";
        }
        CreateAudioSpriteManifestTask.prototype.getSoundManifest = function () {
            var soundManifest = this.createSoundManifest();
            return soundManifest;
        };
        /*
         * Soundファイル用マニフェストを作成する
         */
        CreateAudioSpriteManifestTask.prototype.createSoundManifest = function () {
            var audioSpriteData = this.prepareSE();
            var manifest = [
                {
                    src: project.Param.SOUNDS_FOLDER + this.AUDIO_FILE,
                    data: {
                        channels: project.Param.SOUNDS_CHANNEL,
                        audioSprite: audioSpriteData
                    }
                }
            ];
            return manifest;
        };
        /*
         * SEデータを準備する
         */
        CreateAudioSpriteManifestTask.prototype.prepareSE = function () {
            var allSEData = [];
            for (var i = 0; i < project.Param.SE_NUM; i++) {
                var seData = {
                    id: "se_" + i,
                    startTime: project.Param.SE_STEP * i,
                    duration: project.Param.SE_DURATION
                };
                allSEData[i] = seData;
            }
            allSEData[project.Param.SE_NUM] = {
                id: project.Param.BGM_ID,
                startTime: project.Param.SE_STEP * project.Param.SE_NUM,
                duration: project.Param.BGM_DURATION
            };
            return allSEData;
        };
        return CreateAudioSpriteManifestTask;
    })();
    project.CreateAudioSpriteManifestTask = CreateAudioSpriteManifestTask;
})(project || (project = {}));
//# sourceMappingURL=createAudioSpriteManifestTask.js.map