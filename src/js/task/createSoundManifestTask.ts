/// <reference path="../param.ts" />

namespace project {
    /*
     * 各オーディオファイル用のSoundManifestをつくるためのタスク
     */
    export class CreateSoundManifestTask {
        public getSoundManifest():Object[] {
            let soundManifest:Object[] = this.createSoundManifest();
            return soundManifest;
        }

        /*
         * Soundファイル用マニフェストを作成する
         */
        private createSoundManifest():Object[] {
            let manifest:Object[] = [];

            for (let i:number = 0; i < Param.SE_NUM; i++) {
                let seData:Object = {
                    id: "se_" + i,
                    src: Param.SOUNDS_FOLDER + "se_" + i + ".ogg"
                };
                manifest[i] = seData;
            }

            manifest[Param.SE_NUM] = {
                id: Param.BGM_ID,
                src: Param.SOUNDS_FOLDER + "bgm.ogg",
                duration: Param.BGM_DURATION
            };

            return manifest;
        }
    }
}