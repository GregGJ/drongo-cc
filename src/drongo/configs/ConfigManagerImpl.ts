import { URL2Key } from "../res/core/ResURL";
import { ResManager } from "../res/res/ResManager";
import { BaseConfigAccessor } from "./BaseConfigAccessor";
import { ConfigManager } from "./ConfigManager";
import { IConfigAccessor } from "./core/IConfigAccessor";
import { IConfigManager } from "./core/IConfigManager";



export class ConfigManagerImpl implements IConfigManager {

    /**
     * 存取器
     */
    private __accessors: Map<string, new () => IConfigAccessor>;

    constructor() {
        this.__accessors = new Map<string, new () => IConfigAccessor>();
    }

    /**
     * 注册存取器
     * @param sheet 
     * @param accessor
     */
    Register(sheet: string, accessor: new () => IConfigAccessor): void {
        this.__accessors.set(sheet, accessor);
    }

    /**
     * 获取存取器类
     * @param sheet 
     * @returns 
     */
    GetAccessorClass(sheet: string): new () => IConfigAccessor {
        if (!this.__accessors.has(sheet)) {
            return BaseConfigAccessor;
        }
        return this.__accessors.get(sheet);
    }

    /**
     * 获取存取器
     * @param sheet 
     * @returns 
     */
    GetAccessor(sheet: string): IConfigAccessor {
        const url = ConfigManager.Sheet2URL(sheet);
        const urlKey = URL2Key(url);
        if (!ResManager.HasRes(urlKey)) {
            throw new Error(sheet + "未加载!");
        }
        let res = ResManager._getRes(urlKey);
        return res.content;
    }
}