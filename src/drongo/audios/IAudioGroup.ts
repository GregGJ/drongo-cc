import { ResURL } from "../res/core/ResURL";
import { IAudioChannel } from "./IAudioChannel";



/**
 * 音频组
 */
export interface IAudioGroup {
    key: number;

    volume: number;

    mute: boolean;

    CalculateVolume(): void;

    CalculateMute(): void;

    Tick(dt: number): void;
    
    Play(url: ResURL, playedCallBack: Function, volume: number, speed: number, loop: boolean): void;

    GetPlayingChannel(url: ResURL): IAudioChannel;

    StopAll(): void;
}