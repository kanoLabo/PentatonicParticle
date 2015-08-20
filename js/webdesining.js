//タッチイベントが有効なブラウザの場合、
// CreateJSでタッチイベントを扱えるようにする
if (createjs.Touch.isSupported()){
    createjs.Touch.enable(stage);
}

// イベント登録
stage.on("stagemousemove", handleMouseMove, this);
createjs.Ticker.on("tick", handleTick, this);

// 変数宣言
var currentX = 0;
var currentY = 0;
var prevX = 0;
var prevY = 0;
var cntMelody = 0;
var cntTick = 0;

// マウスを動かした時
function handleMouseMove(event) {
    currentX = event.stageX;
    currentY = event.stageY;
}

// エンターフレームイベント
function handleTick(event) {

    // マウスの移動量を算出
    var mx = (currentX - prevX);
    var my = (currentY - prevY);

    // 小さい移動だったら関数は終了する
    if (Math.abs(mx) < 2 || Math.abs(my) < 2) { return; }

    // 音符のグラフィックを作成
    var note = new lib.Notes();
    var frame = Math.floor(6 * Math.random());
    note.gotoAndStop(frame);
    stage.addChild(note);

    // 5フレームに1回処理
    if (cntTick++ % 5 == 0) {
        if (mx > 0) {
            cntMelody++;
            if (cntMelody > 7){ cntMelody = 0; }
        } else {
            cntMelody--;
            if (cntMelody < 0){ cntMelody = 7; }
        }
        // 音を再生
        // ★ここに音を再生するコードを記述します
    }

    // マウス座標を記録
    prevX = currentX;
    prevY = currentY;

    // 音符のモーションの初期値を指定
    note.x = currentX;
    note.y = currentY;
    note.scaleX = note.scaleY = 0;

    // 音符のモーションの実装 (終点の値を指定)
    createjs.Tween
        .get(note)
        // 音符を2秒かけてアニメーションさせる
        .to({
            x: note.x + mx,
            y: note.y + my,
            scaleX: 1, scaleY: 1, alpha: 0
        }, 2000, createjs.Ease.cubicOut)
        // 音符を削除する
        .call(stage.removeChild, [note], stage);
}