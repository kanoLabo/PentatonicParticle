/// <reference path="../param.ts" />
namespace project {

    /*
     * AudioSprite用のSoundManifestをつくるためのタスク
     */
    export class CreateAudioSpriteManifestTask {
        private AUDIO_FILE:string = "150903.ogg";

        public getSoundManifest():Object[] {
            let soundManifest:Object[] = this.createSoundManifest();
            return soundManifest;
        }

        /*
         * Soundファイル用マニフェストを作成する
         */
        private createSoundManifest():Object[] {
            let audioSpriteData:Object[] = this.prepareSE();
            let manifest:Object[] = [
                {
                    src: Param.SOUNDS_FOLDER + this.AUDIO_FILE,
                    data: {
                        channels: Param.SOUNDS_CHANNEL,
                        audioSprite: audioSpriteData
                    }
                }
            ];
            return manifest;
        }

        /*
         * SEデータを準備する
         */
        private prepareSE():Object[] {
            let allSEData:Object[] = [];

            for (let i:number = 0; i < Param.SE_NUM; i++) {
                let seData:Object = {
                    id: "se_" + i,
                    startTime: Param.SE_STEP * i,
                    duration: Param.SE_DURATION
                };
                allSEData[i] = seData;
            }

            allSEData[Param.SE_NUM] = {
                id: Param.BGM_ID,
                startTime: Param.SE_STEP * Param.SE_NUM,
                duration: Param.BGM_DURATION
            }

            return allSEData;
        }
    }
}