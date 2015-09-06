/// <reference path="../../typings/easeljs/easeljs.d.ts" />
/// <reference path="../param.ts" />
/// <reference path="particleContainer.ts" />

namespace project.particle {
    /*
     * パーティクルモーションのクラス
     */
    export class ParticleCreator {
        private _stage:createjs.Stage;  // ステージ
        private _canvas:HTMLCanvasElement;  // ステージ

        private _mainLayer:ParticleContainer;   // メインのレイヤー

        public constructor() {
            // ステージを準備
            this._canvas = <HTMLCanvasElement> document.getElementById("myCanvas")
            this._stage = new createjs.Stage(this._canvas);

            // タッチ対応
            if (createjs.Touch.isSupported())
                createjs.Touch.enable(this._stage);

            // Tickerを作成
            createjs.Ticker.timingMode = createjs.Ticker.RAF;

            // メインのレイヤーを配置
            this._mainLayer = new ParticleContainer();
            this._stage.addChild(this._mainLayer);
            // リサイズイベント
            this.resizeHandler();
            window.addEventListener("resize", () => this.resizeHandler());
        }

        /*
         * 強制リサイズ処理
         */
        public forceResizeHandler():void {
            this.resizeHandler();
            if (this._stage)
                this._stage.update();
        }

        /*
         * アニメーションの開始
         */
        public start():void {
            createjs.Ticker.addEventListener("tick", (event) => this.tickeHandler(event));
        }

        /*
         * Tick Handler
         */
        private tickeHandler(event):void {
            if (!event.paused) {
                this._stage.update();
            }
        }

        /*
         * リサイズのイベント処理
         * */
        private resizeHandler():void {
            let windowWidth:number = window.innerWidth;
            let windowHeight:number = window.innerHeight;
            // ステージのサイズをwindowのサイズに変更
            this._canvas.width = windowWidth;
            this._canvas.height = windowHeight;
            // メインレイヤーにリサイズイベントを通知
            this._mainLayer.resizeHandler(windowWidth, windowHeight);
        }
    }
}