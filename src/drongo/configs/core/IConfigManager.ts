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
    Register(sheet: string, accessors: IConfigAccessor): void;

    /**
     * 获取已注册的存取器
     * @param sheet 
     */
    _GetAccessor(sheet: string): IConfigAccessor;

    /**
     * 获取配置存取器
     * @param sheet
     */
    GetAccessor(sheet: string): IConfigAccessor;
}