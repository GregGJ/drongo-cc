import { IEventDispatcher } from "../events/IEventDispatcher";

/**
 * 任务接口
 */
export interface ITask extends IEventDispatcher {

    /**
     * 开始(请在完成后派发Event.COMPLETE事件),例外可以派发PROGRESS和ERROR
     * @param data 
     */
    Start(data?: any): void;

    /**
     * 销毁
     */
    Destroy(): void;
}