/// <reference path="../../typings/soundjs/soundjs.d.ts" />
/// <reference path="../main.ts" />

namespace project {
    export class ProgressLoadingBarTask {
        private _main:Main;
        private _progressBarLayer:HTMLDivElement;
        private _progressBar:HTMLDivElement;

        constructor(main:Main) {
            this._main = main;
            this._progressBarLayer = <HTMLDivElement> document.getElementById("progressBarLayer");
            this._progressBar = <HTMLDivElement> document.getElementById("progressBar");
        }

        public update(progress:number):void {
            var percent:number = progress * 100;
            this._progressBar.style.width = percent + "%";
        }

        public completeHandler():void {
            setTimeout(() => {
                this._progressBar.style.opacity = "0";
                this._progressBarLayer.className = "on";
                this._progressBarLayer.addEventListener("click", () => this.playButtonTapHandler());

            }, 100);
        }

        private playButtonTapHandler():void {
            createjs.Sound.play(Param.BGM_ID, {loop: -1, pan: 0.01});
            this._progressBarLayer.className = "";
            setTimeout(() => {
                document.body.removeChild(this._progressBarLayer);
            }, 100);
            this._main.start();
        }
    }
}