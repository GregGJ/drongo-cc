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
    Register(sheet: string, accessors?: IConfigAccessor): void;


    /**
     * 加载配置文件
     * @param sheet 
     * @param callback 
     */
    Load(sheet:string|Array<string>,callback:(err:Error)=>void):void;

    /**
     * 卸载配置文件
     * @param sheets
     */
    Unload(sheets:string|Array<string>):void;
    
    /**
     * 获取配置存取器
     * @param sheet
     */
    GetAccessor(sheet: string): IConfigAccessor;
}