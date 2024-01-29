import { IEventDispatcher } from "../events/IEventDispatcher";

/**
 * 任务接口
 */
export interface ITask extends IEventDispatcher {

    /**
     * 开始
     * @param data 
     */
    Start(data?: any): void;

    /**
     * 销毁
     */
    Destroy(): void;
}