import { DEvent } from "../events/DEvent";
import { EventDispatcher } from "../events/EventDispatcher";
import { ITask } from "./ITask";


/**
 * 任务队列
 */
export class TaskQueue extends EventDispatcher implements ITask {

    private __taskList: Array<ITask>;
    private __index: number = 0;
    private __data: any;
    constructor() {
        super();
        this.__taskList = [];
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
            throw new Error("未找到要删除的内容！");
        }
        this.__taskList.splice(index, 1);
    }

    Start(data?: any): void {
        this.__index = 0;
        this.__data = data;
        this.__tryNext();
    }

    private __tryNext(): void {
        if (this.__index < this.__taskList.length) {
            let task: ITask = this.__taskList[this.__index];
            task.On(DEvent.COMPLETE, this.__subTaskEventHandler, this);
            task.On(DEvent.PROGRESS, this.__subTaskEventHandler, this);
            task.On(DEvent.ERROR, this.__subTaskEventHandler, this);
            task.Start(this.__data);
        } else {
            //结束
            this.Emit(DEvent.COMPLETE);
        }
    }

    private __subTaskEventHandler(key: string, target: ITask, data?: any): void {
        if (key == DEvent.PROGRESS) {
            let dataValue: number = Number(data) == undefined ? 0 : Number(data);
            let progress: number = (this.__index + dataValue) / this.__taskList.length;
            this.Emit(DEvent.PROGRESS, progress);
            return;
        }
        target.OffAllEvent();
        if (key == DEvent.ERROR) {
            this.Emit(DEvent.ERROR, data);
            return;
        }
        target.Destroy();
        this.__index++;
        this.__tryNext();
    }

    Destroy(): void {
        super.Destroy();
        this.__taskList.length = 0;
        this.__index = 0;
        this.__data = null;
    }
}