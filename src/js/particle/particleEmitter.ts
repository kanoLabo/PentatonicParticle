/// <reference path="../../typings/easeljs/easeljs.d.ts" />
/// <reference path="particle.ts" />

namespace project.particle {
    /*
     * パーティクル発生装置
     */
    export class ParticleEmitter extends createjs.Container {
        // パーティクルの発生座標。発生装置そのものの座標ではない。
        public emitX:number;
        public emitY:number;
        // 発生座標に近づく速度
        public vx:number;
        public vy:number;

        public particleColor:string;

        // アニメーション中のパーティクルを格納する配列
        private _animationParticles:Particle[] = [];
        // パーティクルのオブジェクトプール。アニメーションがされていないパーティクルがここに待機している。
        private _particlePool:Particle[] = [];


        public constructor() {
            super();
            this.emitX = 0;
            this.emitY = 0;
            this.vx = 0;
            this.vy = 0;
        }

        /*
         * MainLayerのtickイベント毎に実行される処理
         * */
        public update(goalX:number, goalY:number) {
            // 発生装置はgoalに徐々に近づいていく。
            let dx:number = goalX - this.emitX;
            let dy:number = goalY - this.emitY;
            let d:number = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));  // 斜め方向の移動距離
            let rad:number = Math.atan2(dy, dx);    // 移動角度
            this.vx = Math.cos(rad) * d * 0.1; // 速度の更新
            this.vy = Math.sin(rad) * d * 0.1; // 速度の更新
            this.emitX += this.vx;
            this.emitY += this.vy;
            // アニメーション中のパーティクルの状態を更新
            this.updateParticles();
        }

        /*
         *　パーティクルを発生させる
         * */
        public emitParticle():void {

            this.updateParticleColor();
            let particle:Particle = this.getParticle();
            particle.init(this.emitX, this.emitY, this.vx, this.vy, this.particleColor);
            this.addChild(particle);
            // アニメーション中のパーティクルとして設定
            this._animationParticles.push(particle);
        }


        private updateParticleColor():void {
            let colorHSL:string = createjs.Graphics.getHSL(
                new Date().getTime() / 20 + Math.random() * 60,
                90 + Math.random() * 10,
                50 + Math.random() * 10
            );
            this.particleColor = colorHSL;
        }

        /*
         *　パーティクルのアニメーション
         * */
        private updateParticles():void {
            let windowWidth:number = window.innerWidth;
            let windowHeight:number = window.innerHeight;

            for (let i:number = 0; i < this._animationParticles.length; i++) {
                let particle:Particle = this._animationParticles[i];
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
}
