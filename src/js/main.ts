/// <reference path="task/createAudioSpriteManifestTask.ts" />
/// <reference path="task/createSoundManifestTask.ts" />
/// <reference path="task/progressLoadingBarTask.ts" />
/// <reference path="particle/particleCreator.ts" />
/// <reference path="trace.ts" />

createjs.Sound.initializeDefaultPlugins();
declare var isAudioSprite:boolean;
declare var WebFont:any;

namespace project {

    export class Main {
        private _particleCreator:particle.ParticleCreator;
        private _loadingBarTask:ProgressLoadingBarTask;

        constructor() {
            this._particleCreator = new particle.ParticleCreator();
            this._particleCreator.forceResizeHandler();
            this._loadingBarTask = new ProgressLoadingBarTask(this);
            createjs.Sound.alternateExtensions = ["mp3"];

            this.showContentsInfo();
        }

        private showContentsInfo():void
        {
            this.checkDeviceInfo();
            this.checkLowPerformanceMode();
            let contentsInfo:HTMLDivElement = <HTMLDivElement> document.getElementById("contentsInfo");
            let activePlugin:string = createjs.Sound.activePlugin.toString();
            if (activePlugin.indexOf("HTMLAudio"))
                Param.isHTMLAudio = true;
            contentsInfo.innerHTML = activePlugin;
        }

        private checkDeviceInfo():void
        {
            var ua:string = navigator.userAgent;
            if (ua.indexOf("iPhone") > 0 || ua.indexOf("iPad") > 0 || ua.indexOf("iPod") > 0)
                Param.isIOS = true;
            else if (ua.indexOf("Android") > 0)
                Param.isAndroid = true;
        }

        private checkLowPerformanceMode():void
        {
            let contentsInfo:HTMLDivElement = <HTMLDivElement> document.getElementById("contentsInfo");
            let activePlugin:string = createjs.Sound.activePlugin.toString();
            if (activePlugin.indexOf("HTMLAudio") > 0)
                Param.isHTMLAudio = true;

            if (Param.isAndroid || Param.isIOS)
                Param.lowPerformance = true;

            if (Param.isHTMLAudio && isAudioSprite)
                alert("申し訳ありません。ご利用の環境では正常に動作いたしません。");

            let contentsInfoText:string = activePlugin;
            if (Param.lowPerformance)
                contentsInfoText += "<br>Low Performance Mode";
            contentsInfo.innerHTML = contentsInfoText;

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

            // Webフォントのプリロード。非同期
            WebFont.load({
                custom: {
                    // フォントファミリーを指定
                    families: ['FontAwesome'],
                    // CSS の URL を指定
                    urls: [
                        'css/style.css'
                    ]
                }
            });
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
