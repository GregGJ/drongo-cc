import { Injector } from "../utils/Injector";
import { IResManager } from "./IResManager";
import { IResource } from "./IResource";
import { ResManagerImpl } from "../impls/ResManagerImpl";
import { ResRef } from "./ResRef";


/**
 * 资源管理器
 */
export class ResManager {

    static KEY: string = "drongo.ResManager";

    /**
     * 资源保留长时间GC
     */
    static GC_TIME: number = 15;

    /**
     * 自动清理
     */
    static AUTO_GC: boolean = true;

    /**
     * 添加一个资源
     * @param value
     */
    static AddRes(value: IResource): void {
        this.impl.AddRes(value);
    }

    /**
     * 是否包含该资源
     * @param key 
     */
    static HasRes(key: string): boolean {
        return this.impl.HasRes(key);
    }

    /**
     * 获取资源（内部接口）
     * @param key 
     * @returns 
     */
    static _getRes(key: string): IResource {
        return this.impl._getRes(key);
    }

    /**
     * 添加并返回一个资源引用
     * @param key 
     * @param refKey 
     */
    static AddResRef(key: string, refKey?: string): ResRef {
        return this.impl.AddResRef(key, refKey);
    }

    /**
     * 删除一个资源引用
     * @param value 
     */
    static RemoveResRef(value: ResRef): void {
        return this.impl.RemoveResRef(value);
    }

    /**
     * 资源清理
     */
    static GC(ignoreTime?: boolean): void {
        return this.impl.GC(ignoreTime);
    }

    /**
     * 资源列表
     * @returns 
     */
    static get resList(): Array<IResource> {
        return this.impl.resList;
    }

    private static __impl: IResManager;
    private static get impl(): IResManager {
        if (this.__impl == null) {
            this.__impl = Injector.GetInject(this.KEY);
        }
        if (this.__impl == null) {
            this.__impl = new ResManagerImpl();
        }
        return this.__impl;
    }
}