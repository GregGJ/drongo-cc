import { ResRef } from "./ResRef";
import { ResURL } from "./ResURL";
import { ILoader } from "./ILoader";



export interface IRes {

    /**
     * 设置加载器
     * @param key 
     * @param loader 
     */
    SetResLoader(key: any, loader: new () => ILoader): void;

    /**
     * 获取加载器
     * @param key 
     */
    GetResLoader(key: any): new () => ILoader;

    /**
    * 获取资源
    * @param url 
    * @param refKey 
    * @param progress 
    */
    GetResRef(url: ResURL, refKey: string, progress?: (progress: number) => void): Promise<ResRef>;

    /**
     * 获取资源列表
     * @param urls 
     * @param refKey 
     * @param progress 
     */
    GetResRefList(urls: Array<ResURL>, refKey: string, progress?: (progress: number) => void): Promise<Array<ResRef>>

    /**
     * 获取资源列表按照URL存放到字典中
     * @param urls 
     * @param refKey 
     * @param result 
     * @param progress 
     */
    GetResRefMap(urls: Array<ResURL>, refKey: string, result?: Map<string, ResRef>, progress?: (progress: number) => void): Promise<Map<string, ResRef>>

}