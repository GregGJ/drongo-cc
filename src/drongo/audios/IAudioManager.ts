import { ResURL } from "../res/core/ResURL";
import { IAudioChannel } from "./IAudioChannel";


/**
 * 音频管理器
 */
export interface IAudioManager {
    /**
     * 总音量
     */
    volume: number;

    /**
     * 音乐音量
     */
    musicVolume: number;

    /**
     * 声音音量
     */
    soundVolume: number;

    mute: boolean;

    muteMusic: boolean;

    muteSound: boolean;

    /**
     * 播放音乐
     * @param value 
     */
    PlayMusic(url: ResURL, volume: number, speed: number): void;

    /**
     * 停止音乐
     */
    StopMusic(): void;

    /**
     * 暂停
     */
    PauseMusic(): void;

    /**
     * 继续播放
     */
    ResumeMusic(): void;

    /**
     * 播放声音
     * @param value
     */
    PlaySound(url: ResURL, playedCallBack: Function, volume: number, speed: number, loop: boolean): void;

    /**
     * 获取正在播放指定音频的轨道
     * @param url
     */
    GetPlaying(url: ResURL): IAudioChannel;
}