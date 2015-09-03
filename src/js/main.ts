/// <reference path="../typings/preloadjs/preloadjs.d.ts" />
/// <reference path="../typings/tweenjs/tweenjs.d.ts" />
/// <reference path="../typings/easeljs/easeljs.d.ts" />
/// <reference path="../typings/soundjs/soundjs.d.ts" />
/// <reference path="particleCreator.ts" />
/// <reference path="createAudioSpriteManifestTask.ts" />
/// <reference path="createSoundManifestTask.ts" />
/// <reference path="trace.ts" />

createjs.Sound.initializeDefaultPlugins();
declare var isAudioSprite:boolean;
namespace project {

    export class Main {
        constructor() {
            createjs.Sound.alternateExtensions = ["mp3"];	// add other extensions to try loading if the src file extension is not supported
        }

        public init():void {
            let soundManifest:Object[];

            if (isAudioSprite)
            {
                let createSoundManifestTask:project.CreateAudioSpriteManifestTask = new project.CreateAudioSpriteManifestTask();
                soundManifest = createSoundManifestTask.getSoundManifest();
            }
            else
            {
                let createSoundManifestTask:project.CreateSoundManifestTask = new project.CreateSoundManifestTask();
                soundManifest = createSoundManifestTask.getSoundManifest();
            }
            trace("isAudioSprite", isAudioSprite, "Plugin is", createjs.Sound.activePlugin.toString());

            this.startPreload(soundManifest);
        }

        /*
         * プリロードを開始する
         */
        private startPreload(soundManifest:Object[]):void {
            let queue:createjs.LoadQueue = new createjs.LoadQueue();
            queue.installPlugin(createjs.Sound);
            queue.addEventListener("complete", (event) => this.loadComplete(event));
            queue.setMaxConnections(1);
            queue.loadManifest(soundManifest);
        }

        private loadComplete(event):void {
            let particleCreator:project.ParticleCreator = new project.ParticleCreator();
            createjs.Sound.play(Param.BGM_ID, {loop: -1, pan: 0.01});
        }
    }
}

window.addEventListener("load", (event)=> {
    let main:project.Main = new project.Main();
    main.init();

});
