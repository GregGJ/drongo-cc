import { Injector } from "../utils/Injector";
import { ResURL } from "../res/core/ResURL";
import { IAudioChannel } from "./IAudioChannel";
import { IAudioManager } from "./IAudioManager";
import { AudioManagerImpl } from "./AudioManagerImpl";



/**
 * 音频管理器
 */
export class AudioManager {

    /**
     * 全局唯一注入KEY
     */
    static KEY: string = "drongo.AudioManager";

    /**
     * 最大音频轨道数量
     */
    public static MAX_SOUND_CHANNEL_COUNT: number = 30;

    /**
     * 总音量
     */
    static get volume(): number {
        return this.impl.volume;
    }

    static set volume(value: number) {
        this.impl.volume = value;
    }

    /**
     * 音乐音量
     */
    static get musicVolume(): number {
        return this.impl.musicVolume;
    }

    static set musicVolume(value: number) {
        this.impl.musicVolume = value;
    }

    /**
     * 声音音量
     */
    static get soundVolume(): number {
        return this.impl.soundVolume;
    }

    static set soundVolume(value: number) {
        this.impl.soundVolume = value;
    }

    /**
     * 静音总开关
     */
    static get mute(): boolean {
        return this.impl.mute;
    }

    static set mute(value: boolean) {
        this.impl.mute = value;
    }

    /**
     * 音乐静音开关
     */
    static get muteMusic(): boolean {
        return this.impl.muteMusic;
    }

    static set muteMusic(value: boolean) {
        this.impl.muteMusic = value;
    }

    /**
     * 声音静音开关
     */
    static get muteSound(): boolean {
        return this.impl.muteSound;
    }

    static set muteSound(value: boolean) {
        this.impl.muteSound = value;
    }

    /**
     * 播放音乐
     * @param value
     */
    static PlayMusic(url: ResURL, volume: number = 1, speed: number = 1, loop: boolean = false): void {
        this.impl.PlayMusic(url, volume, speed, loop);
    }

    /**
     * 停止音乐
     */
    static StopMusic(): void {
        this.impl.StopMusic();
    }

    /**
     * 暂停
     */
    static PauseMusic(): void {
        this.impl.PauseMusic();
    }

    /**
     * 继续播放
     */
    static ResumeMusic(): void {
        this.impl.ResumeMusic();
    }

    /**
     * 播放声音
     * @param value
     */
    static PlaySound(url: ResURL, playedCallBack: Function, volume: number, speed: number, loop: boolean): void {
        this.impl.PlaySound(url, playedCallBack, volume, speed, loop);
    }

    /**
     * 获取正在播放指定音频的轨道
     * @param url
     */
    static GetPlaying(url: ResURL): IAudioChannel {
        return this.impl.GetPlaying(url);
    }

    private static __impl: IAudioManager;
    private static get impl(): IAudioManager {
        if (this.__impl == null) {
            this.__impl = Injector.GetInject(this.KEY);
        }
        if (this.__impl == null) {
            this.__impl = new AudioManagerImpl();
        }
        return this.__impl;
    }
}