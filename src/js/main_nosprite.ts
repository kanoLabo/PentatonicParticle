/// <reference path="../typings/preloadjs/preloadjs.d.ts" />
/// <reference path="../typings/tweenjs/tweenjs.d.ts" />
/// <reference path="../typings/easeljs/easeljs.d.ts" />
/// <reference path="../typings/soundjs/soundjs.d.ts" />
/// <reference path="particleCreator.ts" />
/// <reference path="createSoundManifestTask.ts" />

createjs.Sound.initializeDefaultPlugins();

namespace project {
    export class Main {
        constructor() {
            trace("Active Plugin is", createjs.Sound.activePlugin.toString());
            createjs.Sound.alternateExtensions = ["mp3"];	// add other extensions to try loading if the src file extension is not supported
        }

        public init():void {
            var createSoundManifestTask:project.CreateSoundManifestTask = new project.CreateSoundManifestTask();
            let soundManifest:Object[] = createSoundManifestTask.getSoundManifest();
            this.startPreload(soundManifest);
        }

        /*
         * プリロードを開始する
         * */
        private startPreload(soundManifest:Object[]):void {
            let queue:createjs.LoadQueue = new createjs.LoadQueue();
            queue.installPlugin(createjs.Sound);
            queue.addEventListener("complete", (event) => this.loadComplete(event));
            queue.loadManifest(soundManifest);
        }

        private loadComplete(event):void {
            var particleCreator:project.ParticleCreator = new project.ParticleCreator();
            createjs.Sound.play("bgm", {loop:-1, pan:0.01});
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
    var main:project.Main = new project.Main();
    main.init();

});
