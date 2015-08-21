/// <reference path="../typings/preloadjs/preloadjs.d.ts" />
/// <reference path="../typings/tweenjs/tweenjs.d.ts" />
/// <reference path="../typings/easeljs/easeljs.d.ts" />
/// <reference path="../typings/soundjs/soundjs.d.ts" />

createjs.Sound.initializeDefaultPlugins();

namespace project {
    export class Main {
        constructor() {
            trace("Active Plugin is", createjs.Sound.activePlugin.toString());

            const assetsPath:string = "./sounds/";
            let soundManifest:Object[] = this.createSoundManifest();
            createjs.Sound.alternateExtensions = ["mp3"];	// add other extensions to try loading if the src file extension is not supported
            createjs.Sound.addEventListener("fileload", () => this.startTicker());
            createjs.Sound.registerSounds(soundManifest, assetsPath);
        }

        /*
         * Soundファイル用マニフェストを作成する
         * */
        private createSoundManifest():Object[] {
            let audioSpriteData:Object[] = this.prepareSE();
            let manifest:Object[] = [
                {
                    src: "150821_1_01.ogg",
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

        /*
        * Tickerを開始
        * */
        private startTicker():void {
            setInterval(() => this.tick(), 200);
        }

        private tick() {
            var soundID:string = "se_" + Math.floor(Math.random() * 11);
            createjs.Sound.play(soundID);
        }
    }
}


/** デバッグモードかどうか。本番公開時にはfalseにする */
let DEBUG_MODE:boolean = true;

/**
 * デバッグモードが有効で、console.log()が使える時に、
 * コンソールに文字列を出力します。
 * @param {string[]} ...args 出力したい文字列です。
 */
function trace(...args:string[]):void {
    if (DEBUG_MODE && this.console && typeof console.log != "undefined") {
        let str:string = "";
        if (args.length > 0)
            str = args.join(", ");

        console.log(str);
    }
}

window.addEventListener("load", (event)=> {
    new project.Main();
});
