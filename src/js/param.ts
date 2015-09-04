namespace project {
    export class Param {
        /* SEの数 */
        static SE_NUM:number = 21;

        static SE_STEP:number = 4000;
        static SE_DURATION:number = 2600;
        static SOUNDS_CHANNEL:number = 50;

        /* 音ファイルのフォルダ */
        static SOUNDS_FOLDER:string = "sounds/";

        /* 音ファイルのフォルダ */
        static BGM_DURATION:number = 16 * 1000;

        /* BGのID */
        static BGM_ID:string = "bgm";

        /* iOSかどうか */
        static isIOS:boolean = false;

        /* Androidかどうか */
        static isAndroid:boolean = false;

        /* HTMLAudioかどうか */
        static isHTMLAudio:boolean = false;

        /* ローパフォーマンスモードかどうか */
        static lowPerformance:boolean = false;

        /* ローパフォーマンスモードかどうか */

    }
}