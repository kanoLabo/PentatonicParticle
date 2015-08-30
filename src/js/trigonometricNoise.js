/// <reference path="../typings/tweenjs/tweenjs.d.ts" />
/// <reference path="../typings/easeljs/easeljs.d.ts" />
/// <reference path="trace.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var project;
(function (project) {
    /*
     * 三角関数を重ねあわせてノイズ表現
     */
    var TrigonometricNoise = (function () {
        function TrigonometricNoise() {
            var _this = this;
            // ステージを準備
            this._canvas = document.getElementById("myCanvas");
            this._stage = new createjs.Stage(this._canvas);
            // メインのレイヤーを配置
            this._mainLayer = new MainLayer();
            this._stage.addChild(this._mainLayer);
            // Tickerを作成
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener("tick", function (event) { return _this.tickHandler(event); });
            // リサイズイベント
            this.resizeHandler();
            window.addEventListener("resize", function () { return _this.resizeHandler(); });
        }
        /*
         * Tick Handler
         */
        TrigonometricNoise.prototype.tickHandler = function (event) {
            if (!event.paused) {
                this._mainLayer.update();
                this._stage.update();
            }
        };
        /*
         * リサイズのイベント処理
         */
        TrigonometricNoise.prototype.resizeHandler = function () {
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;
            // ステージのサイズをwindowのサイズに変更
            this._canvas.width = windowWidth;
            this._canvas.height = windowHeight;
            // メインレイヤーにリサイズイベントを通知
            this._mainLayer.resizeHandler(windowWidth, windowHeight);
        };
        return TrigonometricNoise;
    })();
    project.TrigonometricNoise = TrigonometricNoise;
    /*
     * メインのレイヤー
     */
    var MainLayer = (function (_super) {
        __extends(MainLayer, _super);
        function MainLayer() {
            _super.call(this);
            this.POINT_DIF = 4;
            this.STROKE_WAIT = 1.1;
            this.LINE_NUM = 4;
            this.STOP_TIME = 200;
            this.SIZE = 80;
            this._time = 0;
            this._goalX = 0;
            this._lineGraphics = [];
            this._lineColors = ["ff3f95", "a244f1", "19ec32", "1a29f5"];
            this._pulse = true;
            this._bg = new createjs.Shape();
            this.drawBG(800, 600);
            this.addChild(this._bg);
            for (var i = 0; i < this.LINE_NUM; i++) {
                var shape = new createjs.Shape();
                shape.compositeOperation = "lighter";
                this._lineGraphics[i] = shape.graphics;
                this.addChild(shape);
            }
        }
        MainLayer.prototype.update = function () {
            var amp;
            if (this._pulse)
                amp = this.SIZE * Math.sin(this._time) + Math.random() * this.SIZE / 2;
            else
                amp = 0;
            for (var i = 0; i < this.LINE_NUM; i++) {
                var graphic = this._lineGraphics[i];
                graphic.clear();
                graphic.setStrokeStyle(this.STROKE_WAIT);
                graphic.beginStroke("#" + this._lineColors[i]);
                for (var point = 0; point < this._goalX; point += Math.PI / 2) {
                    var targetX = point * this.POINT_DIF;
                    var targetY = this._middlePoint + amp * Math.random() * this.getPositionY(point, i);
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
        };
        /*
         * ノイズ縦位置
         */
        MainLayer.prototype.getPositionY = function (point, lineIndex) {
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
        };
        /*
         * 指定の大きさの背景を描画
         */
        MainLayer.prototype.drawBG = function (bgWidth, bgHeight) {
            this._bg.graphics.clear();
            this._bg.graphics.beginLinearGradientFill(["#270259", "#100125"], [0, 1], 0, 0, 0, bgHeight)
                .drawRect(0, 0, bgWidth, bgHeight)
                .endFill();
        };
        MainLayer.prototype.resizeHandler = function (windowWidth, windowHeight) {
            this._goalX = windowWidth / this.POINT_DIF;
            this._middlePoint = windowHeight / 2;
            this.drawBG(windowWidth, windowHeight);
        };
        return MainLayer;
    })(createjs.Container);
})(project || (project = {}));
window.addEventListener("load", function (event) {
    new project.TrigonometricNoise();
});
//# sourceMappingURL=trigonometricNoise.js.map