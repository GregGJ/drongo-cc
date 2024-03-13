import { DEvent } from "../events/DEvent";
import { EventDispatcher } from "../events/EventDispatcher";
import { ITask } from "./ITask";



/**
 * 任务序列（并行）
 */
export class TaskSequence extends EventDispatcher implements ITask {

    private __taskList: Array<ITask> = new Array<ITask>();
    private __index: number = 0;

    constructor() {
        super();
    }

    AddTask(value: ITask): void {
        if (this.__taskList.indexOf(value) >= 0) {
            throw new Error("重复添加！");
        }
        this.__taskList.push(value);
    }

    RemoveTask(value: ITask): void {
        let index: number = this.__taskList.indexOf(value);
        if (index < 0) {
            throw new Error("找不到要删除的内容!");
        }
        this.__taskList.splice(index, 1);
    }

    Start(data?: any): void {
        for (let index = 0; index < this.__taskList.length; index++) {
            const element = this.__taskList[index];
            element.On(DEvent.COMPLETE, this.__subTaskEventHandler, this);
            element.On(DEvent.ERROR, this.__subTaskEventHandler, this);
            element.On(DEvent.PROGRESS, this.__subTaskEventHandler, this);
            element.Start();
        }
    }

    private __subTaskEventHandler(type: string, target: ITask, data?: any): void {
        if (type == DEvent.PROGRESS) {
            this.Emit(DEvent.PROGRESS, this.__index / this.__taskList.length);
            return;
        }
        target.OffAllEvent();
        if (type == DEvent.ERROR) {
            this.Emit(DEvent.ERROR, data);
            return;
        }
        this.__index++;
        if (this.__index < this.__taskList.length) {
            return;
        }
        target.Destroy();
        //完成
        this.Emit(DEvent.COMPLETE);
    }

    Destroy(): void {
        super.Destroy();
        this.__taskList.length = 0;
        this.__index = 0;
    }
}