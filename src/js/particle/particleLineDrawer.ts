/// <reference path="../../typings/easeljs/easeljs.d.ts" />

namespace project.particle {

    /*
     * 軌跡を描く
     */
    export class LineDrawer extends createjs.Shape {
        private _linePoint:LinePointData[];

        public constructor() {
            super();
            this.compositeOperation = "lighter";
            this._linePoint = [];
        }

        public addLinePoint(emitX:number, emitY:number):void {
            let linePoint:LinePointData = new LinePointData(emitX, emitY);
            this._linePoint.push(linePoint);

        }

        public shiftLinePoint():void {
            this._linePoint.shift();

        }

        public update(particleColor:string):void {
            // Emitterの状態に応じて線を描く
            this.graphics.clear();
            let max = this._linePoint.length - 1;

            for (let i = 0; i < max; i++) {
                let p1 = this._linePoint[i];
                let p2 = this._linePoint[i + 1];
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
        }

    }

    class LinePointData {
        public x:number;
        public y:number;

        public constructor(emitX:number, emitY:number) {
            this.x = emitX;
            this.y = emitY;
        }
    }

}
