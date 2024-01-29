import { Dictionary } from "../containers/Dictionary";
import { Debuger } from "./Debuger";
import { IDebuger } from "./IDebuger";



export class DebugerImpl implements IDebuger{

    private __logs: Dictionary<string, Array<string>> = new Dictionary<string, Array<string>>();


    private __debuger: Map<string, boolean> = new Map<string, boolean>();

    /**
     * 设置过滤
     * @param key 
     * @param isOpen 
     */
    Debug(key: string, isOpen: boolean) {
        this.__debuger.set(key, isOpen);
    }

    /**
     * 获取已保存的日志
     * @param type 
     * @returns 
     */
    GetLogs(type?: string): Array<string> {
        if (type == undefined || type == null) {
            type = "all";
        }
        if (this.__logs.Has(type)) {
            return this.__logs.Get(type);
        }
        return null;
    }

    private __save(type: string, logType: string, msg: string): string {
        let list: Array<string>;
        if (!this.__logs.Has(type)) {
            list = [];
            this.__logs.Set(type, list);
        } else {
            list = this.__logs.Get(type);
        }
        let data: string = "[" + type + "]" + logType + ":" + msg;
        if (list.length >= Debuger.MaxCount) {
            list.unshift();//删除最顶上的那条
        }
        list.push(data);
        //保存到all
        if (!this.__logs.Has("all")) {
            list = [];
            this.__logs.Set("all", list);
        } else {
            list = this.__logs.Get("all");
        }
        if (list.length >= Debuger.MaxCount) {
            list.unshift();//删除最顶上的那条
        }
        list.push(data);
        return data;
    }

    Log(type: string, msg: any): void {
        let data = this.__save(type, "Log", msg);
        let isAll = this.__debuger.has("all") ? this.__debuger.get("all") : false;
        let isOpen = this.__debuger.has(type) ? this.__debuger.get(type) : false;
        if (isAll || isOpen) {
            console.log(data);
        }
    }

    Err(type: string, msg: any) {
        let data = this.__save(type, "Error", msg);
        let isAll = this.__debuger.has("all") ? this.__debuger.get("all") : false;
        let isOpen = this.__debuger.has(type) ? this.__debuger.get(type) : false;
        if (isAll || isOpen) {
            console.error(data);
        }
    }

    Warn(type: string, msg: any) {
        let data = this.__save(type, "Warn", msg);
        let isAll = this.__debuger.has("all") ? this.__debuger.get("all") : false;
        let isOpen = this.__debuger.has(type) ? this.__debuger.get(type) : false;
        if (isAll || isOpen) {
            console.warn(data);
        }
    }

    Info(type: string, msg: any) {
        let data = this.__save(type, "Info", msg);
        let isAll = this.__debuger.has("all") ? this.__debuger.get("all") : false;
        let isOpen = this.__debuger.has(type) ? this.__debuger.get(type) : false;
        if (isAll || isOpen) {
            console.info(data);
        }
    }
}