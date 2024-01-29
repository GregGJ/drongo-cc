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


    private static __configPath: (sheet: string) => ResURL;
    static set configPath(value: (sheet: string) => ResURL) {
        this.__configPath = value;
    }

    /**
     * 路径转化器
     */
    static get configPath(): (sheet: string) => ResURL {
        if (this.__configPath == null) {
            throw new Error("配置表路径函数未设置！");
        }
        return this.__configPath;
    }

    /**
     * 注册存取器
     * @param sheet 
     * @param accessors 
     */
    static Register(sheet: string, accessors?: IConfigAccessor): void {
        this.impl.Register(sheet, accessors);
    }


    /**
     * 加载配置文件
     * @param sheet 
     * @param callback 
     */
    static Load(sheet: string | Array<string>, callback: (err: Error) => void): void {
        this.impl.Load(sheet, callback);
    }

    /**
     * 卸载配置
     * @param sheets 
     */
    static Unload(sheets:string|Array<string>):void{
        this.impl.Unload(sheets);
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