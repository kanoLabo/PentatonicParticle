/// <reference path="../typings/tweenjs/tweenjs.d.ts" />
/// <reference path="../typings/easeljs/easeljs.d.ts" />
/// <reference path="trace.ts" />

namespace project {

    /*
     * 三角関数を重ねあわせてノイズ表現
     */
    export class TrigonometricNoise {
        private _stage:createjs.Stage;  // ステージ
        private _canvas:HTMLCanvasElement;  // ステージ
        private _mainLayer:MainLayer;   // メインのレイヤー

        constructor() {
            // ステージを準備
            this._canvas = <HTMLCanvasElement> document.getElementById("myCanvas")
            this._stage = new createjs.Stage(this._canvas);

            // メインのレイヤーを配置
            this._mainLayer = new MainLayer();
            this._stage.addChild(this._mainLayer);

            // Tickerを作成
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener("tick", (event) => this.tickHandler(event));

            // リサイズイベント
            this.resizeHandler();
            window.addEventListener("resize", () => this.resizeHandler());
        }

        /*
         * Tick Handler
         */
        private tickHandler(event):void {
            if (!event.paused) {
                this._mainLayer.update();
                this._stage.update();
            }
        }

        /*
         * リサイズのイベント処理
         */
        private resizeHandler():void {
            var windowWidth:number = window.innerWidth;
            var windowHeight:number = window.innerHeight;
            // ステージのサイズをwindowのサイズに変更
            this._canvas.width = windowWidth;
            this._canvas.height = windowHeight;
            // メインレイヤーにリサイズイベントを通知
            this._mainLayer.resizeHandler(windowWidth, windowHeight);
        }
    }

    /*
     * メインのレイヤー
     */
    class MainLayer extends createjs.Container {
        private POINT_DIF:number = 4;
        private STROKE_WAIT:number = 1.1;

        private LINE_NUM:number = 4;
        private STOP_TIME:number = 200;
        private SIZE:number = 80;

        private _time:number = 0;
        private _goalX:number = 0;
        private _middlePoint:number;
        private _bg:createjs.Shape; // 背景
        private _lineGraphics:createjs.Graphics[] = [];
        private _lineColors:string[] = ["ff3f95", "a244f1", "19ec32", "1a29f5"];
        private _pulse:boolean = true;

        public constructor() {
            super();

            this._bg = new createjs.Shape();
            this.drawBG(800, 600);
            this.addChild(this._bg);

            for (let i:number = 0; i < this.LINE_NUM; i++) {
                let shape:createjs.Shape = new createjs.Shape();
                shape.compositeOperation = "lighter";
                this._lineGraphics[i] = shape.graphics;
                this.addChild(shape);
            }
        }

        public update():void {
            let amp:number;

            if (this._pulse)
                amp = this.SIZE * Math.sin(this._time) + Math.random() * this.SIZE / 2;
            else
                amp = 0;

            for (let i:number = 0; i < this.LINE_NUM; i++) {
                let graphic:createjs.Graphics = this._lineGraphics[i];
                graphic.clear();
                graphic.setStrokeStyle(this.STROKE_WAIT);
                graphic.beginStroke("#" + this._lineColors[i]);

                for (let point:number = 0; point < this._goalX; point += Math.PI / 2) {
                    var targetX:number = point * this.POINT_DIF;
                    var targetY:number = this._middlePoint + amp * Math.random() * this.getPositionY(point, i);
                    graphic.lineTo(targetX, targetY);
                }

                graphic.endStroke();
            }

            this._time += 10 * Math.PI / 180;
            this._pulse = this._time < Math.PI;

            if (this._time > this.STOP_TIME * Math.PI / 180) {
                if (Math.random() > 0.92)
                    this._time = 0;
            }
        }

        /*
         * ノイズ縦位置
         */
        private getPositionY(point:number, lineIndex:number):number {
            switch (lineIndex) {
                case 0:
                    return Math.cos(point * point);
                    break;
                case 1:
                    return Math.cos(point * point) * Math.cos(point);
                    break;
                case 2:
                    return Math.sin(point * point);
                    break;
                case 3:
                    return Math.sin(point * point) * Math.sin(point);
                    break;
            }
        }

        /*
         * 指定の大きさの背景を描画
         */
        private drawBG(bgWidth:number, bgHeight:number):void {
            this._bg.graphics.clear();
            this._bg.graphics.beginLinearGradientFill(["#270259", "#100125"], [0, 1], 0, 0, 0, bgHeight)
                .drawRect(0, 0, bgWidth, bgHeight)
                .endFill();
        }

        public resizeHandler(windowWidth:number, windowHeight:number):void {
            this._goalX = windowWidth / this.POINT_DIF;
            this._middlePoint = windowHeight / 2;
            this.drawBG(windowWidth, windowHeight);
        }
    }
}

window.addEventListener("load", (event)=> {
    new project.TrigonometricNoise();
});
