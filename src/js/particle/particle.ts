/// <reference path="../../typings/easeljs/easeljs.d.ts" />

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
            return 16 + Math.floor(60 * Math.random())
        else
            return 15 + Math.floor(50 * Math.random())
    }

    private getIconStr(isStar:boolean):string {
        // アイコンの Unicode を指定
        let iconUnicode = !isStar ? "f001" : "f005";

        // Unicode から文字コードに変換
        let iconInt = parseInt(iconUnicode, 16);
        // 文字コードから文字列に変換する
        let iconStr = String.fromCharCode(iconInt);
        // CreateJS のテキストを作成
        return iconStr;

    }


    /*
     * パーティクルの初期化
     * @param parentVX, parentVY :親コンテナの速度。パーティクルの速度に影響を与える。
     * */
    public init(emitX:number, emitY:number, parentVX:number, parentVY:number, particleColor:string):void {
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
            if (this._count >= this._life / 2)
                this.alpha = (1 - this._count / this._life);
        }
        else {
            // 寿命が来たらフラグを立てる
            this.isDead = true;
        }
    }
}