


import { TickerManager } from "../ticker/TickerManager";
import { IEventDispatcher } from "./IEventDispatcher";



/**
 * 事件分发器(只有一对多的情况下去使用)
 */
export class EventDispatcher implements IEventDispatcher {

    /**
    * 对象已经注册的处理器
    */
    private callerMap: Map<any, EventInfo[]> = new Map<any, EventInfo[]>();

    /**
     * 事件派发器上所监听的处理器
     */
    private keyMap: Map<string, EventInfo[]> = new Map<string, EventInfo[]>();

    /**
     * 需要派发的事件
     */
    private needEmit: Array<{ type: string, data: any }> = [];

    constructor() {

    }

    /**
     * 添加事件
     * @param key 
     * @param caller 
     * @param func 
     * @param priority 优先级（数字越小优先级越高）
     */
    On(key: string, handler: (type: string, target?: any, ...arg: any[]) => void, caller: any, priority: number = 0): void {
        let infoList: EventInfo[];
        let info: EventInfo;
        if (this.keyMap.has(key)) {
            infoList = this.keyMap.get(key)!;
            for (const iterator of infoList) {
                if (iterator.target == caller && iterator.handler == handler) {
                    console.error("重复添加同一个事件监听：" + key + " " + caller + " " + handler);
                    return;
                }
            }
        } else {
            infoList = [];
            this.keyMap.set(key, infoList);
        }
        info = new EventInfo(key, caller, handler);
        infoList.push(info);
        //按照优先级排序
        infoList.sort((a, b) => a.priority - priority);

        //处理器关联处理
        if (this.callerMap.has(caller)) {
            infoList = this.callerMap.get(caller)!;
            for (const iterator of infoList) {
                if (iterator.key == key && iterator.handler == handler) {
                    console.error("事件系统 处理器关联错误：" + key + " " + caller + " " + handler);
                }
            }
        } else {
            infoList = [];
            this.callerMap.set(caller, infoList);
        }
        infoList.push(info);
    }

    /**
     * 删除事件监听
     * @param key 
     * @param caller 
     * @param handler 
     */
    Off(key: string, handler: (type: string, target?: any, ...arg: any[]) => void, caller: any): void {
        if (this.keyMap.has(key) == false) {
            return;
        }
        let infoList: EventInfo[] = this.keyMap.get(key)!;
        let info: EventInfo;
        let deleteInfo: EventInfo | null = null;
        //删除
        for (let index = 0; index < infoList.length; index++) {
            info = infoList[index];
            if (info.target == caller && info.handler == handler) {
                deleteInfo = info;
                infoList.splice(index, 1);
                break;
            }
        }
        if (this.callerMap.has(caller)) {
            infoList = this.callerMap.get(caller)!;
            //删除
            for (let index = 0; index < infoList.length; index++) {
                info = infoList[index];
                if (info.key == key && info.handler == handler) {
                    deleteInfo = info;
                    infoList.splice(index, 1);
                    break;
                }
            }

        }
        //销毁处理器
        if (deleteInfo) {
            deleteInfo.Destroy();
        }

    }

    /**
     * 删除指定对象所有的事件处理
     * @param caller 
     */
    OffByCaller(caller: any): void {
        let infoList: EventInfo[] | undefined = this.callerMap.get(caller);
        if (infoList === undefined || infoList.length == 0) {
            return;
        }
        let info: EventInfo;
        //逐个删除
        while (infoList.length) {
            info = infoList[0];
            this.Off(info.key, info.handler, info.target);
        }
        //删除空列表
        this.callerMap.delete(caller);
    }

    /**
     * 删除所有事件监听
     */
    OffAllEvent(): void {
        this.keyMap.forEach(infoList => {
            infoList.forEach(info => {
                info.Destroy();
            });
        });
        this.keyMap.clear();
        this.callerMap.clear();
    }

    /**
     * 派发事件
     * @param type 
     * @param data 
     */
    Emit(type: string, ...data: any[]): void {
        this.needEmit.push({ type, data });
        TickerManager.CallNextFrame(this.__emit, this);
    }

    private __emit(): void {
        for (let index = 0; index < this.needEmit.length; index++) {
            const event = this.needEmit[index];
            if (this.keyMap.has(event.type) == false) {
                continue;
            }
            let infoList: EventInfo[] = this.keyMap.get(event.type)!;
            let info: EventInfo;
            for (let index = 0; index < infoList.length; index++) {
                info = infoList[index];
                info.handler.apply(info.target, [event.type, this, event.data]);
            }
        }
        this.needEmit.length = 0;
    }

    /**
     * 是否有事件监听
     * @param key 
     */
    HasEvent(key: string): boolean {
        return this.keyMap.has(key);
    }

    /**
     * 是否包含指定函数事件监听
     * @param key 
     * @param caller 
     * @param func 
     */
    HasEventHandler(key: string, handler: (type: string, target?: any, ...arg: any[]) => void, caller: any): boolean {
        if (this.keyMap.has(key) == false) {
            return false;
        }
        let infoList: EventInfo[] = this.keyMap.get(key)!;
        let info: EventInfo;
        for (let index = 0; index < infoList.length; index++) {
            info = infoList[index];
            if (info.target == caller && info.handler == handler) {
                return true;
            }
        }
        return false;
    }

    Destroy(): void {
        this.callerMap.clear();
        this.keyMap.clear();
    }
}


class EventInfo {
    key: string = "";
    target: any | null;
    handler: (type: string, target?: any, ...arg: any[]) => void;
    priority: number = 255;

    constructor(key: string, target: any, handler: (type: string, target?: any, ...arg: any[]) => void) {
        this.key = key;
        this.target = target;
        this.handler = handler;
    }

    Destroy() {
        this.key = null;
        this.target = null;
        this.handler = null;
        this.priority = 0;
    }
}