

/**
 * 事件分发器
 */
export interface IEventDispatcher {

    /**
     * 添加事件
     * @param key 
     * @param caller 
     * @param handler 
     * @param priority 优先级 数字越小优先级越高 
     */
    On(key: string, handler: (type: string, target?: any, ...arg: any[]) => void, caller: any, priority?: number): void;

    /**
     * 删除事件监听
     * @param key 
     * @param caller 
     * @param handler 
     */
    Off(key: string, handler: (type: string, target?: any, ...arg: any[]) => void, caller: any): void;

    /**
     * 删除指定对象所有的事件处理
     * @param caller 
     */
    OffByCaller(caller: any): void;

    /**
     * 删除所有事件监听
     */
    OffAllEvent(): void;

    /**
     * 派发事件
     * @param key 
     * @param data 
     */
    Emit(key: string, ...arg: any[]): void;

    /**
     * 是否有事件监听
     * @param key 
     */
    HasEvent(key: string): boolean;

    /**
     * 是否包含指定函数事件监听
     * @param key 
     * @param caller 
     * @param handler 
     */
    HasEventHandler(key: string, handler: (type: string, target?: any, ...arg: any[]) => void, caller: any): boolean;
}