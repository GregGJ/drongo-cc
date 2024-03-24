import { ITicker } from "../ticker/ITicker";
import { TickerManager } from "../ticker/TickerManager";
import { ICommand } from "./ICommand";


/**
 * 命令管理器
 */
export class CommandManager implements ITicker {

    private __map: Map<string, new () => ICommand>;
    private __running: Array<ICommand>;

    constructor() {
        this.__map = new Map<string, new () => ICommand>();
        this.__running = [];
        TickerManager.AddTicker(this);
    }

    Tick(dt: number): void {
        this.__running.forEach(value => {
            value.Tick(dt);
        })
    }

    /**
     * 注册
     * @param key 
     * @param cmd 
     */
    Register(key: string, cmd: new () => ICommand): void {
        if (this.__map.has(key)) {
            throw new Error("重复注册：" + key);
        }
        this.__map.set(key, cmd);
    }

    /**
     * 执行
     * @param key 
     * @param data 
     */
    Execute(key: string, data: any): void {
        if (!this.__map.has(key)) {
            throw new Error("未注册的命令:" + key);
        }
        let CMDClass = this.__map.get(key);
        let cmd = new CMDClass();
        cmd.Execute(data);
        this.__running.push(cmd);
    }

    /**
     * 删除
     * @param cmd 
     */
    Delete(cmd: ICommand): void {
        let index = this.__running.indexOf(cmd);
        if (index < 0) {
            throw new Error("找不到要删除的命令" + cmd);
        }
        this.__running.splice(index, 1);
    }

    Destroy(): void {
        this.__map.clear();
        this.__map = null;
    }
}