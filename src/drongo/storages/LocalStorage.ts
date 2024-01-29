import { Injector } from "../utils/Injector";
import { ILocalStorage } from "./ILocalStorage";


/**
 * 本地数据缓存
 */
export class LocalStorage {

    static KEY: string = "drongo.LocalStorage";
    
    /**
     * 初始化
     * @param gameName 
     */
    static Init(gameName: string): void {
        this.impl.Init(gameName);
    }

    /**
     * 获取指定数据
     * @param key 
     * @returns 
     */
    static GetItem(key: string): any {
        this.impl.GetItem(key);
    }

    /**
     * 设置指定数据
     * @param key 
     * @param value 
     */
    static SetItem(key: string, value: any): void {
        this.impl.SetItem(key, value);
    }


    /**
     * 清理
     * @param key 
     */
    static ClearItem(key: string): void {
        this.impl.ClearItem(key);
    }

    /**
     * 清理所有
     */
    static ClearAll(): void {
        this.impl.ClearAll();
    }

    private static __impl: ILocalStorage;
    private static get impl(): ILocalStorage {
        if (this.__impl == null) {
            this.__impl = Injector.GetInject(this.KEY);
        }
        if (this.__impl == null) {
            throw new Error(this.KEY + "未注入!");
        }
        return this.__impl;
    }
}