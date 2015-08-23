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
            let manifest:Object[] = [
            ];
            for (let i:number = 0; i < 11; i++) {
                let seData:Object = {
                    id: "se_" + i,
                    src: "sounds/se_" + i + ".ogg"
                };
                manifest[i] = seData;
            }
            return manifest;
        }
    }
}