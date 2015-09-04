/// <reference path="../typings/preloadjs/preloadjs.d.ts" />
/// <reference path="../typings/tweenjs/tweenjs.d.ts" />
/// <reference path="../typings/easeljs/easeljs.d.ts" />
/// <reference path="../typings/soundjs/soundjs.d.ts" />
/// <reference path="particleCreator.ts" />
/// <reference path="createAudioSpriteManifestTask.ts" />
/// <reference path="createSoundManifestTask.ts" />
/// <reference path="progressLoadingBarTask.ts" />
/// <reference path="trace.ts" />

createjs.Sound.initializeDefaultPlugins();
declare var isAudioSprite:boolean;
namespace project {

    export class Main {
        private _particleCreator:ParticleCreator;
        private _loadingBarTask:ProgressLoadingBarTask;

        constructor() {
            this._particleCreator = new ParticleCreator();
            this._particleCreator.forceResizeHandler();

            this._loadingBarTask = new ProgressLoadingBarTask(this);

            createjs.Sound.alternateExtensions = ["mp3"];
        }

        public init():void {
            let soundManifest:Object[];

            if (isAudioSprite) {
                let createSoundManifestTask:project.CreateAudioSpriteManifestTask = new project.CreateAudioSpriteManifestTask();
                soundManifest = createSoundManifestTask.getSoundManifest();
            }
            else {
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
            queue.addEventListener("progress", (event) => this.progressHandler(<createjs.Event> event))
            queue.addEventListener("complete", (event) => this.loadComplete(<createjs.Event> event));
            queue.setMaxConnections(1);
            queue.loadManifest(soundManifest);
        }

        private progressHandler(event:createjs.Event):void {
            this._loadingBarTask.update(event.progress);
        }

        private loadComplete(event:createjs.Event):void {
            this._loadingBarTask.completeHandler();
        }

        public start():void
        {
            this._particleCreator.start();
        }
    }
}

window.addEventListener("load", (event)=> {
    let main:project.Main = new project.Main();
    main.init();

});
