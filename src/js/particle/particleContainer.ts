/// <reference path="../../typings/easeljs/easeljs.d.ts" />
/// <reference path="../../typings/soundjs/soundjs.d.ts" />
/// <reference path="../param.ts" />
/// <reference path="particleEmitter.ts" />
/// <reference path="particleLineDrawer.ts" />

namespace project.particle {

    /*
     * パーティクルを発生させるコンテナ
     * */
    export class ParticleContainer extends createjs.Container {
        private _isMouseDown:boolean;   // マウスが押されているかどうか
        private _particleEmitter:ParticleEmitter;   // パーティクル発生装置のインスタンス
        private _bg:createjs.Shape; // 背景
        private _lineDrawer:LineDrawer; // 背景
        private _tickCount:number = 0;
        private _particleTick:number = 0;
        private emitFrequency:number = 1;

        public constructor() {
            super();
            if (Param.lowPerformance)
                this.emitFrequency = 5;

            this._bg = new createjs.Shape();
            this.drawBG(800, 600);
            this.addChild(this._bg);
            this._lineDrawer = new LineDrawer();
            this.addChild(this._lineDrawer);

            this._particleEmitter = new ParticleEmitter();  // パーティクル発生装置のインスタンスを作成
            this.addChild(this._particleEmitter);

            this.addEventListener("tick", (event) => this.tickHandler(event));
            this.addEventListener("mousedown", (event) => this.mouseDownHandler(event));
            this.addEventListener("pressup", (event) => this.mouseUpHandler(event));
        }

        public resizeHandler(windowWidth:number, windowHeight:number):void {
            this.drawBG(windowWidth, windowHeight);
        }

        /*
         * 指定の大きさの背景を描画
         * */
        private drawBG(bgWidth:number, bgHeight:number):void {
            this._bg.graphics.clear();
            this._bg.graphics.beginLinearGradientFill(["#011c31", "#001121"], [0, 1], 0, 0, 0, bgHeight)
                .drawRect(0, 0, bgWidth, bgHeight)
                .endFill();
        }

        /*
         * マウスを押した時の処理
         */
        private mouseDownHandler(event):void {
            this._isMouseDown = true;
        }

        /*
         * マウスを離した時の処理
         */
        private mouseUpHandler(event):void {
            this._isMouseDown = false;
        }

        /*
         * Tickイベントで実行される処理
         * */
        private tickHandler(event):void {



            // マウスの座標
            let mouseX:number = this.getStage().mouseX;
            let mouseY:number = this.getStage().mouseY;
            // パーティクル発生装置の座標を更新
            this._particleEmitter.update(mouseX, mouseY);

            if (this._isMouseDown) {
                this._tickCount++;
                if (this._tickCount % this.emitFrequency == 0) {
                    // マウスを押している場合にパーティクル発生命令
                    this._particleEmitter.emitParticle();
                }

                this.playSE();


                this._lineDrawer.addLinePoint(
                    this._particleEmitter.emitX,
                    this._particleEmitter.emitY
                );
            }
            else {
                this._lineDrawer.shiftLinePoint();
            }

            this._tickCount++;
            this._lineDrawer.update(this._particleEmitter.particleColor);
        }

        /*
         * 効果音を鳴らす
         */
        private playSE():void {
            // 7フレームに1回処理
            if (this._particleTick++ % 7 == 0) {
                let soundID:string = "se_" + Math.floor(Math.random() * Param.SE_NUM);
                createjs.Sound.play(soundID, {pan: 0.01});
            }
        }
    }
}


