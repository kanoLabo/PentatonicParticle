/// <reference path="../typings/preloadjs/preloadjs.d.ts" />
/// <reference path="../typings/tweenjs/tweenjs.d.ts" />
/// <reference path="../typings/easeljs/easeljs.d.ts" />
/// <reference path="../typings/soundjs/soundjs.d.ts" />

namespace project {
    /*
     * パーティクルモーションのクラス
     * */
    export class ParticleCreator {
        private _stage:createjs.Stage;  // ステージ
        private _canvas:HTMLCanvasElement;  // ステージ

        private _mainLayer:MainLayer;   // メインのレイヤー

        public constructor() {
            // ステージを準備
            this._canvas = <HTMLCanvasElement> document.getElementById("myCanvas")
            this._stage = new createjs.Stage(this._canvas);

            // タッチ対応
            if (createjs.Touch.isSupported()) {
                createjs.Touch.enable(this._stage);
            }

            // Tickerを作成
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener("tick", (event) => this.tickeHandler(event));
            // メインのレイヤーを配置
            this._mainLayer = new MainLayer();
            this._stage.addChild(this._mainLayer);
            // リサイズイベント
            this.resizeHandler();
            window.addEventListener("resize", () => this.resizeHandler());
        }

        /*
         * Tick Handler
         * */
        private tickeHandler(event):void {
            if (!event.paused) {
                this._stage.update();
            }
        }

        /*
         * リサイズのイベント処理
         * */
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
     * */
    class MainLayer extends createjs.Container {
        private _isMouseDown:boolean;   // マウスが押されているかどうか
        private _particleEmitter:ParticleEmitter;   // パーティクル発生装置のインスタンス
        private _bg:createjs.Shape; // 背景
        private _cntTick:number = 0;

        public constructor() {
            super();
            this._bg = new createjs.Shape();
            this.drawBG(800, 600);
            this.addChild(this._bg);
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
         * */
        private mouseDownHandler(event):void {
            this._isMouseDown = true;
        }

        /*
         * マウスを離した時の処理
         * */
        private mouseUpHandler(event):void {
            this._isMouseDown = false;
        }

        /*
         * Tickイベントで実行される処理
         * */
        private tickHandler(event):void {

            // マウスの座標
            var mouseX:number = this.getStage().mouseX;
            var mouseY:number = this.getStage().mouseY;
            // パーティクル発生装置の座標を更新
            this._particleEmitter.update(mouseX, mouseY);

            if (this._isMouseDown) {
                // マウスを押している場合にパーティクル発生命令
                this._particleEmitter.emitParticle();

                // 5フレームに1回処理
                if (this._cntTick++ % 7 == 0) {
                    var soundID:string = "se_" + Math.floor(Math.random() * 21);
                    createjs.Sound.play(soundID, {pan: 0.01});
                }
            }
        }
    }

    /*
     * パーティクル発生装置
     * */
    class ParticleEmitter extends createjs.Container {
        // パーティクルの発生座標。発生装置そのものの座標ではない。
        private _emitX:number;
        private _emitY:number;
        // 発生座標に近づく速度
        private _vx:number;
        private _vy:number;
        // アニメーション中のパーティクルを格納する配列
        private _animationParticles:Particle[] = [];
        // パーティクルのオブジェクトプール。アニメーションがされていないパーティクルがここに待機している。
        private _particlePool:Particle[] = [];

        public constructor() {
            super();
            this._emitX = 0;
            this._emitY = 0;
            this._vx = 0;
            this._vy = 0;
        }

        /*
         * MainLayerのtickイベント毎に実行される処理
         * */
        public update(goalX:number, goalY:number) {
            // 発生装置はgoalに徐々に近づいていく。
            var dx:number = goalX - this._emitX;
            var dy:number = goalY - this._emitY;
            var d:number = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));  // 斜め方向の移動距離
            var rad:number = Math.atan2(dy, dx);    // 移動角度
            this._vx = Math.cos(rad) * d * 0.1; // 速度の更新
            this._vy = Math.sin(rad) * d * 0.1; // 速度の更新
            this._emitX += this._vx;
            this._emitY += this._vy;
            // アニメーション中のパーティクルの状態を更新
            this.updateParticles();
        }

        /*
         *　パーティクルを発生させる
         * */
        public emitParticle():void {
            for(var i:number = 0; i < 2; i++)
            {
                var particle:Particle = this.getParticle();
                particle.init(this._emitX, this._emitY, this._vx, this._vy);
                this.addChild(particle);
                // アニメーション中のパーティクルとして設定
                this._animationParticles.push(particle);
            }
        }

        /*
         *　パーティクルのアニメーション
         * */
        private updateParticles():void {
            let windowWidth:number = window.innerWidth;
            let windowHeight:number = window.innerHeight;

            for (var i:number = 0; i < this._animationParticles.length; i++) {
                var particle:Particle = this._animationParticles[i];
                if (!particle.isDead) {
                    if (particle.y >= windowHeight) {
                        particle.vy *= -0.9;
                        particle.y = windowHeight;
                    } else if (particle.y <= 0) {
                        particle.vy *= -0.9;
                        particle.y = 0;
                    }
                    if (particle.x >= windowWidth) {
                        particle.vx *= -0.9;
                        particle.x = windowWidth;
                    } else if (particle.x <= 0) {
                        particle.vx *= -0.9;
                        particle.x = 0;
                    }

                    particle.update();
                }
                else {
                    // particleを取り除く
                    this.removeParticle(particle, i);
                }
            }
        }

        /*
         * オブジェクトプールからパーティクルを取得。
         * プールにパーティクルが無ければ新規作成
         * */
        private getParticle():Particle {
            if (this._particlePool.length > 0) {
                return this._particlePool.shift();
            }
            else {
                return new Particle();
            }
        }


        /*
         * パーティクルを取り除く。
         * */
        private removeParticle(particle:Particle, animationIndex:number):void {
            // Containerからパーティクルをremove
            this.removeChild(particle);
            // アニメーションのパーティクルから取り除く。
            this._animationParticles.splice(animationIndex, 1);
            if (this._particlePool.indexOf(particle) == -1) {
                // プールにパーティクルが無いことを確認して格納
                this._particlePool.push(particle);
            }
        }
    }

    /*
     * パーティクルのクラス
     * */
    class Particle extends createjs.Text {
        private _life:number;   // パーティクルの寿命
        private _count:number;  // パーティクルの年齢。時間経過とともに加算されていく。
        public vx:number; // 速度X
        public vy:number; // 速度Y
        public isDead:boolean;  // パーティクルが寿命を迎えたかどうか。
        private _isStar:boolean;  // ☆型パーティクルかどうか。

        public constructor() {
            super("", "12px FontAwesome");
            super("", 12 + Math.floor(50 * Math.random()) + "px FontAwesome");
            this._isStar = Math.random() > 0.8;
            let iconStr:string = this.getIconStr(this._isStar);
            this.text = iconStr;
            let iconSize:Number = this.getIconSize(this._isStar);
            this.font = iconSize + "px FontAwesome";

            // 加算で重ねる
            this.compositeOperation = "lighter";
            this.mouseEnabled = false;
        }

        private getIconSize(isStar:boolean):number {
            if (!isStar)
                return 12 + Math.floor(50 * Math.random())
            else
                return 8 + Math.floor(14 * Math.random())
        }

        private getIconStr(isStar:boolean):string {
            // アイコンの Unicode を指定
            var iconUnicode = !isStar ? "f001" : "f005";

            // Unicode から文字コードに変換
            var iconInt = parseInt(iconUnicode, 16);
            // 文字コードから文字列に変換する
            var iconStr = String.fromCharCode(iconInt);
            // CreateJS のテキストを作成
            return iconStr;

        }


        /*
         * パーティクルの初期化
         * @param parentVX, parentVY :親コンテナの速度。パーティクルの速度に影響を与える。
         * */
        public init(emitX:number, emitY:number, parentVX:number, parentVY:number):void {
            this.x = emitX;
            this.y = emitY;
            this._life = 70 + Math.random() * 20;
            this._count = 0;
            this.vx = parentVX + (Math.random() - 0.5) * 6;
            this.vy = parentVY - 6 - Math.random() * 6;
            this.isDead = false;
            this.alpha = 1;
            this.rotation = 50 * Math.PI * (Math.random() - 0.5);
            var colorHSL:string = createjs.Graphics.getHSL(
                new Date().getTime() / 20 + Math.random() * 60,
                90 + Math.random() * 10,
                50 + Math.random() * 10
            );
            this.color = colorHSL;
        }

        /*
         * パーティクルの時間経過処理。
         * _countがパーティクルの年齢。
         * _lifeを超えたら死亡する。
         *
         * */
        update():void {
            this._count++;
            if (this._count <= this._life) {
                this.x += this.vx;
                this.vy += 0.5;
                this.y += this.vy;

                // 死にそうになったら点滅を開始
                if (this._count >= this._life / 2) {
                    // this.alpha = 0.6 + Math.random() * 0.4;
                    this.alpha = (1 - this._count / this._life);
                }

            }
            else {
                // 寿命が来たらフラグを立てる
                this.isDead = true;
            }
        }
    }
}