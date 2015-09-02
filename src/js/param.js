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
        return Param;
    })();
    project.Param = Param;
})(project || (project = {}));
//# sourceMappingURL=param.js.map