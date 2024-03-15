import { ResURL } from "../res/core/ResURL";
import { Injector } from "../utils/Injector";
import { ConfigManagerImpl } from "./ConfigManagerImpl";
import { IConfigAccessor } from "./core/IConfigAccessor";
import { IConfigManager } from "./core/IConfigManager";


/**
 * 配置表管理器
 */
export class ConfigManager {

    static KEY: string = "drongo.ConfigManager"

    /**配置表名转地址 */
    static Sheet2URL: (sheet: string) => ResURL;

    /**地址转配置表名 */
    static URL2Sheet: (url: ResURL) => string;

    /**
      * 注册存取器
      * @param sheet 
      * @param accessors 
      */
    static Register(sheet: string, accessors: new () => IConfigAccessor): void {
        this.impl.Register(sheet, accessors);
    }

    /**
     * 获取存取器类
     * @param sheet 
     * @returns 
     */
    static GetAccessorClass(sheet: string): new () => IConfigAccessor {
        return this.impl.GetAccessorClass(sheet);
    }

    /**
     * 获取配置存取器
     * @param sheet
     */
    static GetAccessor(sheet: string): IConfigAccessor {
        return this.impl.GetAccessor(sheet);
    }

    private static __impl: IConfigManager;
    private static get impl(): IConfigManager {
        if (this.__impl == null) {
            this.__impl = Injector.GetInject(this.KEY);
        }
        if (this.__impl == null) {
            this.__impl = new ConfigManagerImpl();
        }
        return this.__impl;
    }
}