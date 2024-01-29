import { ITicker } from "../../ticker/ITicker";
import { IResource } from "./IResource";
import { ResRef } from "./ResRef";


/**
 * 资源管理器接口
 */
export interface IResManager extends ITicker {

    /**
     * 添加一个资源
     * @param value 
     */
    AddRes(value: IResource): void;

    /**
     * 获取资源(内部接口)
     * @param key 
     */
    _getRes(key:string):IResource;
    
    /**
     * 是否包含该资源
     * @param key 
     */
    HasRes(key: string): boolean;

    /**
     * 添加并返回一个资源引用
     * @param key 
     * @param refKey 
     */
    AddResRef(key: string, refKey?: string): ResRef;

    /**
     * 删除一个资源引用
     * @param value 
     */
    RemoveResRef(value: ResRef): void;

    /**
     * 资源清理
     */
    GC(ignoreTime?: boolean): void;

    /**
     * 资源列表
     */
    readonly resList: Array<IResource>;
}