import { Injector } from "../utils/Injector";
import { IRes } from "./IRes";
import { ResRef } from "./ResRef";
import { ResURL } from "./ResURL";
import { ILoader } from "./ILoader";
import { ResImpl } from "../impls/ResImpl";



export class Res {

    static KEY: string = "drongo.Res"

    /**
     * 最大加载线程
     */
    static MAX_LOADER_THREAD: number = 5;

    /**
     * 设置资源加载器
     * @param key 
     * @param loader 
     */
    static SetResLoader(key: any, loader: new () => ILoader): void {
        this.impl.SetResLoader(key, loader);
    }

    /**
     * 获取资源加载器
     * @param key 
     * @returns 
     */
    static GetResLoader(key: any): new () => ILoader {
        return this.impl.GetResLoader(key);
    }

    /**
     * 获取资源
     * @param url 
     * @param refKey 
     * @param cb 
     * @param progress 
     */
    static GetResRef(url: ResURL, refKey: string, progress?: (progress: number) => void): Promise<ResRef> {
        return this.impl.GetResRef(url, refKey, progress);
    }

    /**
     * 获取资源列表
     * @param url 
     * @param refKey 
     * @param cb 
     * @param progress 
     */
    static GetResRefList(url: Array<ResURL>, refKey: string, progress?: (progress: number) => void): Promise<Array<ResRef>> {
        return this.impl.GetResRefList(url, refKey, progress);
    }

    /**
     * 获取资源列表并放入字典中
     * @param url 
     * @param refKey 
     * @param result 
     * @param cb 
     * @param progress 
     */
    static GetResRefMap(url: Array<ResURL>, refKey: string, result?: Map<string, ResRef>, progress?: (progress: number) => void): Promise<Map<string, ResRef>> {
        return this.impl.GetResRefMap(url, refKey, result, progress);
    }

    private static __impl: IRes;
    private static get impl(): IRes {
        if (this.__impl == null) {
            this.__impl = Injector.GetInject(this.KEY);
        }
        if (this.__impl == null) {
            this.__impl = new ResImpl();
        }
        return this.__impl;
    }
}