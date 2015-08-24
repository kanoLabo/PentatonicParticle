namespace project {
    /*
    *
    * 各オーディオファイル用のSoundManifestをつくるためのタスク
    *
    */
    export class CreateSoundManifestTask
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
            let manifest:Object[] = [];
            const SE_NUM:number = 11;

            for (let i:number = 0; i < SE_NUM; i++) {
                let seData:Object = {
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
        }
    }
}