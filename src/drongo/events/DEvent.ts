


import { EventDispatcher } from "./EventDispatcher";
import { IEventDispatcher } from "./IEventDispatcher";


export class DEvent {

    static readonly START: string = "start";
    static readonly PROGRESS: string = "progress";
    static readonly COMPLETE: string = "complete";
    static readonly ERROR: string = "error";


    static readonly SHOW: string = "show";
    static readonly HIDE: string = "hide";


    static readonly ADD: string = "add";
    static readonly REMOVE: string = "remove";
    static readonly UPDATE: string = "update";
    static readonly CLEAR: string = "clear";

    static readonly State_Changed: string = "stateChanged";


    /**事件通道 */
    private static channels: Map<string, EventDispatcher> = new Map<string, EventDispatcher>();

    /**
     * 获取事件通道
     * @param key 
     * @returns 
     */
    static GetChannel(key: string = "main"): EventDispatcher {
        return this.channels.get(key);
    }

    /**
     * 派发事件
     * @param eventType 
     * @param data 
     * @param channel   通道
     */
    static Emit(eventType: string, data?: any, channel: string = "main"): void {
        if (!this.channels.has(channel)) {
            return;
        }
        let eventChannel: EventDispatcher = this.channels.get(channel);
        eventChannel.Emit(eventType, data);
    }

    /**
     * 添加事件监听
     * @param type 
     * @param handler 
     * @param caller    
     * @param priority  优先级
     * @param channel   事件通道
     */
    static On(type: string, handler: (type: string, target?: any, ...arg: any[]) => void, caller: any, priority: number = 0, channel: string = "main"): void {
        let eventChannel: EventDispatcher;
        if (!this.channels.has(channel)) {
            eventChannel = new EventDispatcher();
            this.channels.set(channel, eventChannel);
        } else {
            eventChannel = this.channels.get(channel);
        }
        eventChannel.On(type, handler, caller, priority);
    }

    /**
     * 删除事件监听
     * @param type 
     * @param handler 
     * @param caller 
     * @param channel 
     * @returns 
     */
    static Off(type: string, handler: (type: string, target?: any, ...arg: any[]) => void, caller: any, channel: string = "main"): void {
        let eventChannel: EventDispatcher;
        if (!this.channels.has(channel)) {
            return;
        } else {
            eventChannel = this.channels.get(channel);
        }
        eventChannel.Off(type, handler, caller);
    }

    /**
     * 删除指定对象上的所有事件监听
     * @param caller 
     * @param channel
     * @returns 
     */
    static OffByCaller(caller: any, channel: string = "main"): void {
        let eventChannel: EventDispatcher;
        if (!this.channels.has(channel)) {
            return;
        } else {
            eventChannel = this.channels.get(channel);
        }
        eventChannel.OffByCaller(caller);
    }

    /**
     * 删除指定通道上的所有事件监听
     * @param channel 
     * @returns 
     */
    static OffAll(channel: string = "main"): void {
        let eventChannel: EventDispatcher;
        if (!this.channels.has(channel)) {
            return;
        } else {
            eventChannel = this.channels.get(channel);
        }
        eventChannel.OffAllEvent();
    }
    //===========================
    // 实例
    //===========================
    /**
     * 事件类型
     */
    type: string;
    /**
     * 事件派发者
     */
    target: IEventDispatcher;
    /**
     * 停止派发
     */
    propagationStopped:boolean=false;
    /**
     * 错误对象
     */
    error:Error;
    /**
     * 进度
     */
    progress:number;
    /**
     * 事件数据
     */
    data: any;

    constructor(type:string,target:IEventDispatcher){

    }
}