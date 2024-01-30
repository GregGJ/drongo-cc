import { IConfigAccessor } from "./IConfigAccessor";




/**
 * 配置管理器接口
 */
export interface IConfigManager {
    
    /**
     * 注册存取器
     * @param sheet 
     * @param accessors 
     */
    Register(sheet: string, accessors: new()=>IConfigAccessor): void;
    
    /**
     * 获取存取器类
     * @param sheet 
     */
    GetAccessorClass(sheet:string):new()=>IConfigAccessor;
    
    /**
     * 获取配置存取器
     * @param sheet
     */
    GetAccessor(sheet: string): IConfigAccessor;
}