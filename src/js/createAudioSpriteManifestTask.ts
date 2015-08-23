namespace project {

    /*
    *
    * AudioSpriteのためのSoundManifestをつくるためのタスク
    *
    */
    export class CreateAudioSpriteManifestTask
    {
        constructor()
        {
        }

        public getSoundManifest():Object[] {
            let soundManifest:Object[] = this.createSoundManifest();
            return soundManifest;
        }

        /*
         * Soundファイル用マニフェストを作成する
         * */
        private createSoundManifest():Object[] {
            let audioSpriteData:Object[] = this.prepareSE();
            let manifest:Object[] = [
                {
                    src: "sounds/150821_1_01.ogg",
                    data: {
                        channels: 50,
                        audioSprite: audioSpriteData
                    }
                }
            ];
            return manifest;
        }

        /*
         * SEデータを準備する
         * */
        private prepareSE():Object[] {
            let allSEData:Object[] = [];
            const SE_STEP:number = 4000;
            const SE_DURATION:number = 2600;

            for (let i:number = 0; i < 11; i++) {
                let seData:Object = {
                    id: "se_" + i,
                    startTime: SE_STEP * i,
                    duration: SE_DURATION
                };
                allSEData[i] = seData;
            }
            return allSEData;
        }
    }
}