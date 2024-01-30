import { game } from "cc";
import { ITicker } from "../ticker/ITicker";
import { TickerManager } from "../ticker/TickerManager";
import { ITimer } from "./ITimer";



export class TimerImpl implements ITimer, ITicker {

    private __lastTime: number = 0;

    constructor() {
        this.Reset();
        TickerManager.AddTicker(this);
    }

    Reset(): void {
        //当前时间转秒
        this.__lastTime = game.totalTime / 1000;
    }

    Tick(dt: number): void {
        this.__lastTime += dt;
    }

    get currentTime(): number {
        return this.__lastTime;
    }

    get absTime(): number {
        this.Reset();
        return this.currentTime;
    }
}