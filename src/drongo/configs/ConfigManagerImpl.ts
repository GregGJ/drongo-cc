import { Debuger } from "../debugers/Debuger";
import { Res } from "../res/Res";
import { ResURL } from "../res/core/ResURL";
import { ByteArray } from "../utils/ByteArray";
import { ConfigManager } from "./ConfigManager";
import { ConfigUtils } from "./ConfigUtils";
import { IConfigAccessor } from "./core/IConfigAccessor";
import { IConfigManager } from "./core/IConfigManager";



export class ConfigManagerImpl implements IConfigManager {

    /**
     * 存取器
     */
    private __accessors: Map<string, IConfigAccessor>;

    /**
     * 标记配置表是否加载完成
     */
    private __loaded: Map<string, boolean>;

    constructor() {
        this.__accessors = new Map<string, IConfigAccessor>();
        this.__loaded = new Map<string, boolean>();
    }

    /**
     * 加载配置表
     * @param sheets 
     * @param callback 
     */
    Load(sheets: string | string[], callback: (err?: Error) => void): void {
        if (Array.isArray(sheets)) {
            let loadIndex: number = 0;
            let loadTotal: number = sheets.length;
            for (let index = 0; index < sheets.length; index++) {
                const sheet = sheets[index];
                this.__load(sheet, (err?: Error) => {
                    loadIndex++;
                    if (loadIndex >= loadTotal) {
                        if (callback) {
                            callback(err);
                        }
                    }
                })
            }
        } else {
            this.__load(sheets, callback);
        }
    }

    /**
     * 卸载配置表
     * @param sheets 
     */
    Unload(sheets: string | string[]): void {
        if (Array.isArray(sheets)) {
            for (let index = 0; index < sheets.length; index++) {
                const sheet = sheets[index];
                this.__unload(sheet);
            }
        } else {
            this.__unload(sheets);
        }
    }

    private __unload(sheet: string): void {
        if(this.__loaded.has(sheet)){
            this.__loaded.delete(sheet);
            if(this.__accessors.has(sheet)){
                let acc=this.__accessors.get(sheet);
                acc.Clear();
            }
        }
    }

    private __load(sheet: string, callback: (err?: Error) => void): void {
        if (this.__loaded.has(sheet)) {
            if (callback) {
                callback();
            }
            return;
        }
        if (!ConfigManager.configPath) {
            throw new Error("ConfigManager.configPath函数未设置！");
        }
        let url: ResURL = ConfigManager.configPath(sheet);
        Res.GetResRef(url, "ConfigManagerImpl").then(
            value => {
                if (!this.__loaded.has(sheet)) {
                    let buffer = value.content['_buffer'];
                    //解析
                    this.__parseConfig(sheet, buffer);
                    this.__loaded.set(sheet, true);
                    //原始资源可以销毁了
                    value.Dispose();
                }
                if (callback) callback();
            }, reason => {
                if (callback) callback(reason);
            });
    }

    private __parseConfig(sheet: string, buffer: ArrayBuffer): void {
        let byte: ByteArray = new ByteArray(buffer);
        //解析表头
        let len: number = byte.ReadUnsignedInt();
        let titleList: Array<string> = [];
        for (let index = 0; index < len; index++) {
            titleList.push(byte.ReadUTF());
        }
        //类型
        let typeList: Array<number> = [];
        len = byte.ReadUnsignedInt();
        for (let index = 0; index < len; index++) {
            typeList.push(byte.ReadByte());
        }
        //数据数量
        len = byte.ReadUnsignedInt();
        let data: any;
        let accessor: IConfigAccessor;
        for (let dataIndex = 0; dataIndex < len; dataIndex++) {
            data = ConfigUtils.ParseConfig(titleList, typeList, byte);
            //存取器
            accessor = this.__accessors.get(sheet);
            if (!accessor) {
                Debuger.Warn(Debuger.DRONGO,"配置表：" + sheet + "未注册存取器！");
                continue;
            }
            accessor.Save(data);
        }
    }

    /**
     * 注册存取器
     * @param sheet 
     * @param accessors 
     */
    Register(sheet: string, accessors?: IConfigAccessor): void {
        this.__accessors.set(sheet, accessors);
    }

    /**
     * 获取存取器
     * @param sheet 
     * @returns 
     */
    GetAccessor(sheet: string): IConfigAccessor {
        if (!this.__accessors.has(sheet)) {
            throw new Error("配置表：" + sheet + "未注册存取器");
        }
        return this.__accessors.get(sheet);
    }
}