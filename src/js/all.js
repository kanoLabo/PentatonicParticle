var project;
(function (project) {
    var Param = (function () {
        function Param() {
        }
        /* SEの数 */
        Param.SE_NUM = 21;
        Param.SE_STEP = 4000;
        Param.SE_DURATION = 2600;
        Param.SOUNDS_CHANNEL = 50;
        /* 音ファイルのフォルダ */
        Param.SOUNDS_FOLDER = "sounds/";
        /* 音ファイルのフォルダ */
        Param.BGM_DURATION = 16 * 1000;
        /* BGのID */
        Param.BGM_ID = "bgm";
        /* iOSかどうか */
        Param.isIOS = false;
        /* Androidかどうか */
        Param.isAndroid = false;
        /* HTMLAudioかどうか */
        Param.isHTMLAudio = false;
        /* ローパフォーマンスモードかどうか */
        Param.lowPerformance = false;
        return Param;
    })();
    project.Param = Param;
})(project || (project = {}));
/// <reference path="../typings/preloadjs/preloadjs.d.ts" />
/// <reference path="../typings/tweenjs/tweenjs.d.ts" />
/// <reference path="../typings/easeljs/easeljs.d.ts" />
/// <reference path="../typings/soundjs/soundjs.d.ts" />
/// <reference path="param.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var project;
(function (project) {
    /*
     * パーティクルモーションのクラス
     */
    var ParticleCreator = (function () {
        function ParticleCreator() {
            var _this = this;
            // ステージを準備
            this._canvas = document.getElementById("myCanvas");
            this._stage = new createjs.Stage(this._canvas);
            // タッチ対応
            if (createjs.Touch.isSupported())
                createjs.Touch.enable(this._stage);
            // Tickerを作成
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            // メインのレイヤーを配置
            this._mainLayer = new MainLayer();
            this._stage.addChild(this._mainLayer);
            // リサイズイベント
            this.resizeHandler();
            window.addEventListener("resize", function () { return _this.resizeHandler(); });
        }
        /*
         * 強制リサイズ処理
         */
        ParticleCreator.prototype.forceResizeHandler = function () {
            this.resizeHandler();
            if (this._stage)
                this._stage.update();
        };
        /*
         * アニメーションの開始
         */
        ParticleCreator.prototype.start = function () {
            var _this = this;
            createjs.Ticker.addEventListener("tick", function (event) { return _this.tickeHandler(event); });
        };
        /*
         * Tick Handler
         */
        ParticleCreator.prototype.tickeHandler = function (event) {
            if (!event.paused) {
                this._stage.update();
            }
        };
        /*
         * リサイズのイベント処理
         * */
        ParticleCreator.prototype.resizeHandler = function () {
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;
            // ステージのサイズをwindowのサイズに変更
            this._canvas.width = windowWidth;
            this._canvas.height = windowHeight;
            // メインレイヤーにリサイズイベントを通知
            this._mainLayer.resizeHandler(windowWidth, windowHeight);
        };
        return ParticleCreator;
    })();
    project.ParticleCreator = ParticleCreator;
    /*
     * メインのレイヤー
     * */
    var MainLayer = (function (_super) {
        __extends(MainLayer, _super);
        function MainLayer() {
            var _this = this;
            _super.call(this);
            this._tickCount = 0;
            this._particleTick = 0;
            this.emitFrequency = 1;
            if (project.Param.lowPerformance)
                this.emitFrequency = 5;
            this._bg = new createjs.Shape();
            this.drawBG(800, 600);
            this.addChild(this._bg);
            this._lineDrawer = new LineDrawer();
            this.addChild(this._lineDrawer);
            this._particleEmitter = new ParticleEmitter(); // パーティクル発生装置のインスタンスを作成
            this.addChild(this._particleEmitter);
            this.addEventListener("tick", function (event) { return _this.tickHandler(event); });
            this.addEventListener("mousedown", function (event) { return _this.mouseDownHandler(event); });
            this.addEventListener("pressup", function (event) { return _this.mouseUpHandler(event); });
        }
        MainLayer.prototype.resizeHandler = function (windowWidth, windowHeight) {
            this.drawBG(windowWidth, windowHeight);
        };
        /*
         * 指定の大きさの背景を描画
         * */
        MainLayer.prototype.drawBG = function (bgWidth, bgHeight) {
            this._bg.graphics.clear();
            this._bg.graphics.beginLinearGradientFill(["#011c31", "#001121"], [0, 1], 0, 0, 0, bgHeight)
                .drawRect(0, 0, bgWidth, bgHeight)
                .endFill();
        };
        /*
         * マウスを押した時の処理
         */
        MainLayer.prototype.mouseDownHandler = function (event) {
            this._isMouseDown = true;
        };
        /*
         * マウスを離した時の処理
         */
        MainLayer.prototype.mouseUpHandler = function (event) {
            this._isMouseDown = false;
        };
        /*
         * Tickイベントで実行される処理
         * */
        MainLayer.prototype.tickHandler = function (event) {
            // マウスの座標
            var mouseX = this.getStage().mouseX;
            var mouseY = this.getStage().mouseY;
            // パーティクル発生装置の座標を更新
            this._particleEmitter.update(mouseX, mouseY);
            if (this._isMouseDown) {
                this._tickCount++;
                if (this._tickCount % this.emitFrequency == 0) {
                    // マウスを押している場合にパーティクル発生命令
                    this._particleEmitter.emitParticle();
                }
                this.playSE();
                this._lineDrawer.addLinePoint(this._particleEmitter.emitX, this._particleEmitter.emitY);
            }
            else {
                this._lineDrawer.shiftLinePoint();
            }
            this._tickCount++;
            this._lineDrawer.update(this._particleEmitter.particleColor);
        };
        /*
         * 効果音を鳴らす
         */
        MainLayer.prototype.playSE = function () {
            // 7フレームに1回処理
            if (this._particleTick++ % 7 == 0) {
                var soundID = "se_" + Math.floor(Math.random() * project.Param.SE_NUM);
                createjs.Sound.play(soundID, { pan: 0.01 });
            }
        };
        return MainLayer;
    })(createjs.Container);
    /*
     * 軌跡を描く
     */
    var LineDrawer = (function (_super) {
        __extends(LineDrawer, _super);
        function LineDrawer() {
            _super.call(this);
            this.compositeOperation = "lighter";
            this._linePoint = [];
        }
        LineDrawer.prototype.addLinePoint = function (emitX, emitY) {
            var linePoint = new LinePointData(emitX, emitY);
            this._linePoint.push(linePoint);
        };
        LineDrawer.prototype.shiftLinePoint = function () {
            this._linePoint.shift();
        };
        LineDrawer.prototype.update = function (particleColor) {
            // Emitterの状態に応じて線を描く
            this.graphics.clear();
            var max = this._linePoint.length - 1;
            for (var i = 0; i < max; i++) {
                var p1 = this._linePoint[i];
                var p2 = this._linePoint[i + 1];
                // Emitterの状態に応じて線を描く
                this.graphics
                    .setStrokeStyle(10, "round") // 線の太さ
                    .beginStroke(particleColor)
                    .moveTo(p1.x, p1.y)
                    .lineTo(p2.x, p2.y);
            }
            if (max > 18) {
                this._linePoint.shift();
            }
        };
        return LineDrawer;
    })(createjs.Shape);
    var LinePointData = (function () {
        function LinePointData(emitX, emitY) {
            this.x = emitX;
            this.y = emitY;
        }
        return LinePointData;
    })();
    /*
     * パーティクル発生装置
     */
    var ParticleEmitter = (function (_super) {
        __extends(ParticleEmitter, _super);
        function ParticleEmitter() {
            _super.call(this);
            // アニメーション中のパーティクルを格納する配列
            this._animationParticles = [];
            // パーティクルのオブジェクトプール。アニメーションがされていないパーティクルがここに待機している。
            this._particlePool = [];
            this.emitX = 0;
            this.emitY = 0;
            this.vx = 0;
            this.vy = 0;
        }
        /*
         * MainLayerのtickイベント毎に実行される処理
         * */
        ParticleEmitter.prototype.update = function (goalX, goalY) {
            // 発生装置はgoalに徐々に近づいていく。
            var dx = goalX - this.emitX;
            var dy = goalY - this.emitY;
            var d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)); // 斜め方向の移動距離
            var rad = Math.atan2(dy, dx); // 移動角度
            this.vx = Math.cos(rad) * d * 0.1; // 速度の更新
            this.vy = Math.sin(rad) * d * 0.1; // 速度の更新
            this.emitX += this.vx;
            this.emitY += this.vy;
            // アニメーション中のパーティクルの状態を更新
            this.updateParticles();
        };
        /*
         *　パーティクルを発生させる
         * */
        ParticleEmitter.prototype.emitParticle = function () {
            this.updateParticleColor();
            var particle = this.getParticle();
            particle.init(this.emitX, this.emitY, this.vx, this.vy, this.particleColor);
            this.addChild(particle);
            // アニメーション中のパーティクルとして設定
            this._animationParticles.push(particle);
        };
        ParticleEmitter.prototype.updateParticleColor = function () {
            var colorHSL = createjs.Graphics.getHSL(new Date().getTime() / 20 + Math.random() * 60, 90 + Math.random() * 10, 50 + Math.random() * 10);
            this.particleColor = colorHSL;
        };
        /*
         *　パーティクルのアニメーション
         * */
        ParticleEmitter.prototype.updateParticles = function () {
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;
            for (var i = 0; i < this._animationParticles.length; i++) {
                var particle = this._animationParticles[i];
                if (!particle.isDead) {
                    if (particle.y >= windowHeight) {
                        particle.vy *= -0.9;
                        particle.y = windowHeight;
                    }
                    else if (particle.y <= 0) {
                        particle.vy *= -0.9;
                        particle.y = 0;
                    }
                    if (particle.x >= windowWidth) {
                        particle.vx *= -0.9;
                        particle.x = windowWidth;
                    }
                    else if (particle.x <= 0) {
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
        };
        /*
         * オブジェクトプールからパーティクルを取得。
         * プールにパーティクルが無ければ新規作成
         * */
        ParticleEmitter.prototype.getParticle = function () {
            if (this._particlePool.length > 0) {
                return this._particlePool.shift();
            }
            else {
                return new Particle();
            }
        };
        /*
         * パーティクルを取り除く。
         * */
        ParticleEmitter.prototype.removeParticle = function (particle, animationIndex) {
            // Containerからパーティクルをremove
            this.removeChild(particle);
            // アニメーションのパーティクルから取り除く。
            this._animationParticles.splice(animationIndex, 1);
            if (this._particlePool.indexOf(particle) == -1) {
                // プールにパーティクルが無いことを確認して格納
                this._particlePool.push(particle);
            }
        };
        return ParticleEmitter;
    })(createjs.Container);
    /*
     * パーティクルのクラス
     * */
    var Particle = (function (_super) {
        __extends(Particle, _super);
        function Particle() {
            _super.call(this, "", "12px FontAwesome");
            this._isStar = Math.random() > 0.8;
            var iconStr = this.getIconStr(this._isStar);
            this.text = iconStr;
            var iconSize = this.getIconSize(this._isStar);
            this.font = iconSize + "px FontAwesome";
            // 加算で重ねる
            this.compositeOperation = "lighter";
            this.mouseEnabled = false;
        }
        Particle.prototype.getIconSize = function (isStar) {
            if (!isStar)
                return 16 + Math.floor(60 * Math.random());
            else
                return 15 + Math.floor(50 * Math.random());
        };
        Particle.prototype.getIconStr = function (isStar) {
            // アイコンの Unicode を指定
            var iconUnicode = !isStar ? "f001" : "f005";
            // Unicode から文字コードに変換
            var iconInt = parseInt(iconUnicode, 16);
            // 文字コードから文字列に変換する
            var iconStr = String.fromCharCode(iconInt);
            // CreateJS のテキストを作成
            return iconStr;
        };
        /*
         * パーティクルの初期化
         * @param parentVX, parentVY :親コンテナの速度。パーティクルの速度に影響を与える。
         * */
        Particle.prototype.init = function (emitX, emitY, parentVX, parentVY, particleColor) {
            this.x = emitX;
            this.y = emitY;
            this._life = 70 + Math.random() * 20;
            this._count = 0;
            this.vx = parentVX + (Math.random() - 0.5) * 6;
            this.vy = parentVY - 6 - Math.random() * 6;
            this.isDead = false;
            this.alpha = 1;
            this.rotation = 50 * Math.PI * (Math.random() - 0.5);
            this.color = particleColor;
        };
        /*
         * パーティクルの時間経過処理。
         * _countがパーティクルの年齢。
         * _lifeを超えたら死亡する。
         *
         * */
        Particle.prototype.update = function () {
            this._count++;
            if (this._count <= this._life) {
                this.x += this.vx;
                this.vy += 0.5;
                this.y += this.vy;
                // 死にそうになったら点滅を開始
                if (this._count >= this._life / 2)
                    this.alpha = (1 - this._count / this._life);
            }
            else {
                // 寿命が来たらフラグを立てる
                this.isDead = true;
            }
        };
        return Particle;
    })(createjs.Text);
})(project || (project = {}));
/// <reference path="param.ts" />
var project;
(function (project) {
    /*
     * AudioSprite用のSoundManifestをつくるためのタスク
     */
    var CreateAudioSpriteManifestTask = (function () {
        function CreateAudioSpriteManifestTask() {
            this.AUDIO_FILE = "150903.ogg";
        }
        CreateAudioSpriteManifestTask.prototype.getSoundManifest = function () {
            var soundManifest = this.createSoundManifest();
            return soundManifest;
        };
        /*
         * Soundファイル用マニフェストを作成する
         */
        CreateAudioSpriteManifestTask.prototype.createSoundManifest = function () {
            var audioSpriteData = this.prepareSE();
            var manifest = [
                {
                    src: project.Param.SOUNDS_FOLDER + this.AUDIO_FILE,
                    data: {
                        channels: project.Param.SOUNDS_CHANNEL,
                        audioSprite: audioSpriteData
                    }
                }
            ];
            return manifest;
        };
        /*
         * SEデータを準備する
         */
        CreateAudioSpriteManifestTask.prototype.prepareSE = function () {
            var allSEData = [];
            for (var i = 0; i < project.Param.SE_NUM; i++) {
                var seData = {
                    id: "se_" + i,
                    startTime: project.Param.SE_STEP * i,
                    duration: project.Param.SE_DURATION
                };
                allSEData[i] = seData;
            }
            allSEData[project.Param.SE_NUM] = {
                id: project.Param.BGM_ID,
                startTime: project.Param.SE_STEP * project.Param.SE_NUM,
                duration: project.Param.BGM_DURATION
            };
            return allSEData;
        };
        return CreateAudioSpriteManifestTask;
    })();
    project.CreateAudioSpriteManifestTask = CreateAudioSpriteManifestTask;
})(project || (project = {}));
/// <reference path="param.ts" />
var project;
(function (project) {
    /*
     * 各オーディオファイル用のSoundManifestをつくるためのタスク
     */
    var CreateSoundManifestTask = (function () {
        function CreateSoundManifestTask() {
        }
        CreateSoundManifestTask.prototype.getSoundManifest = function () {
            var soundManifest = this.createSoundManifest();
            return soundManifest;
        };
        /*
         * Soundファイル用マニフェストを作成する
         */
        CreateSoundManifestTask.prototype.createSoundManifest = function () {
            var manifest = [];
            for (var i = 0; i < project.Param.SE_NUM; i++) {
                var seData = {
                    id: "se_" + i,
                    src: project.Param.SOUNDS_FOLDER + "se_" + i + ".ogg"
                };
                manifest[i] = seData;
            }
            manifest[project.Param.SE_NUM] = {
                id: project.Param.BGM_ID,
                src: project.Param.SOUNDS_FOLDER + "bgm.ogg",
                duration: project.Param.BGM_DURATION
            };
            return manifest;
        };
        return CreateSoundManifestTask;
    })();
    project.CreateSoundManifestTask = CreateSoundManifestTask;
})(project || (project = {}));
/// <reference path="../typings/preloadjs/preloadjs.d.ts" />
/// <reference path="../typings/tweenjs/tweenjs.d.ts" />
/// <reference path="../typings/easeljs/easeljs.d.ts" />
/// <reference path="../typings/soundjs/soundjs.d.ts" />
/// <reference path="main.ts" />
var project;
(function (project) {
    var ProgressLoadingBarTask = (function () {
        function ProgressLoadingBarTask(main) {
            this._main = main;
            this._progressBarLayer = document.getElementById("progressBarLayer");
            this._progressBar = document.getElementById("progressBar");
        }
        ProgressLoadingBarTask.prototype.update = function (progress) {
            var percent = progress * 100;
            this._progressBar.style.width = percent + "%";
        };
        ProgressLoadingBarTask.prototype.completeHandler = function () {
            var _this = this;
            setTimeout(function () {
                _this._progressBar.style.opacity = "0";
                _this._progressBarLayer.className = "on";
                _this._progressBarLayer.addEventListener("click", function () { return _this.playButtonTapHandler(); });
            }, 100);
        };
        ProgressLoadingBarTask.prototype.playButtonTapHandler = function () {
            var _this = this;
            createjs.Sound.play(project.Param.BGM_ID, { loop: -1, pan: 0.01 });
            this._progressBarLayer.className = "";
            setTimeout(function () {
                document.body.removeChild(_this._progressBarLayer);
            }, 100);
            this._main.start();
        };
        return ProgressLoadingBarTask;
    })();
    project.ProgressLoadingBarTask = ProgressLoadingBarTask;
})(project || (project = {}));
var project;
(function (project) {
    /** デバッグモードかどうか。本番公開時にはfalseにする */
    var DEBUG_MODE = true;
    /**
     * デバッグモードが有効で、console.log()が使える時に、
     * コンソールに文字列を出力します。
     * @param {string[]} ...args 出力したい文字列です。
     */
    function trace() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (DEBUG_MODE && window.console && typeof window.console.log != "undefined") {
            var str = "";
            if (args.length > 0)
                str = args.join(", ");
            console.log(str);
        }
    }
    project.trace = trace;
})(project || (project = {}));
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
var project;
(function (project) {
    var Main = (function () {
        function Main() {
            this._particleCreator = new project.ParticleCreator();
            this._particleCreator.forceResizeHandler();
            this._loadingBarTask = new project.ProgressLoadingBarTask(this);
            createjs.Sound.alternateExtensions = ["mp3"];
            this.showContentsInfo();
        }
        Main.prototype.showContentsInfo = function () {
            this.checkDeviceInfo();
            this.checkLowPerformanceMode();
            var contentsInfo = document.getElementById("contentsInfo");
            var activePlugin = createjs.Sound.activePlugin.toString();
            if (activePlugin.indexOf("HTMLAudio"))
                project.Param.isHTMLAudio = true;
            contentsInfo.innerHTML = activePlugin;
        };
        Main.prototype.checkDeviceInfo = function () {
            var ua = navigator.userAgent;
            if (ua.indexOf("iPhone") > 0 || ua.indexOf("iPad") > 0 || ua.indexOf("iPod") > 0)
                project.Param.isIOS = true;
            else if (ua.indexOf("Android") > 0)
                project.Param.isAndroid = true;
        };
        Main.prototype.checkLowPerformanceMode = function () {
            var contentsInfo = document.getElementById("contentsInfo");
            var activePlugin = createjs.Sound.activePlugin.toString();
            if (activePlugin.indexOf("HTMLAudio") > 0)
                project.Param.isHTMLAudio = true;
            if (project.Param.isAndroid || project.Param.isIOS)
                project.Param.lowPerformance = true;
            if (project.Param.isHTMLAudio && isAudioSprite)
                alert("申し訳ありません。ご利用の環境では正常に動作いたしません。");
            var contentsInfoText = activePlugin;
            if (project.Param.lowPerformance)
                contentsInfoText += "<br>Low Performance Mode";
            contentsInfo.innerHTML = contentsInfoText;
        };
        Main.prototype.init = function () {
            var soundManifest;
            if (isAudioSprite) {
                var createSoundManifestTask = new project.CreateAudioSpriteManifestTask();
                soundManifest = createSoundManifestTask.getSoundManifest();
            }
            else {
                var createSoundManifestTask = new project.CreateSoundManifestTask();
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
        };
        /*
         * プリロードを開始する
         */
        Main.prototype.startPreload = function (soundManifest) {
            var _this = this;
            var queue = new createjs.LoadQueue();
            queue.installPlugin(createjs.Sound);
            queue.addEventListener("progress", function (event) { return _this.progressHandler(event); });
            queue.addEventListener("complete", function (event) { return _this.loadComplete(event); });
            queue.setMaxConnections(1);
            queue.loadManifest(soundManifest);
        };
        Main.prototype.progressHandler = function (event) {
            this._loadingBarTask.update(event.progress);
        };
        Main.prototype.loadComplete = function (event) {
            this._loadingBarTask.completeHandler();
        };
        Main.prototype.start = function () {
            this._particleCreator.start();
        };
        return Main;
    })();
    project.Main = Main;
})(project || (project = {}));
window.addEventListener("load", function (event) {
    var main = new project.Main();
    main.init();
});
//# sourceMappingURL=all.js.map