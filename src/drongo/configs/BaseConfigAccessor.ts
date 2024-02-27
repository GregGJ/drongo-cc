import { StringUtils } from "../utils/StringUtils";
import { IConfigAccessor } from "./core/IConfigAccessor";



/**
 * 配置存取器基类
 */
export class BaseConfigAccessor implements IConfigAccessor {

    protected $configs: Array<any> = [];

    protected $storages: Map<string, ConfigStorage>;

    constructor() {
        this.$storages = new Map<string, ConfigStorage>();
    }

    /**
     * 增加存储方式
     * @param keys 
     */
    protected AddStorage(keys: Array<string>): void {
        const key = StringUtils.PieceTogether(keys);
        if (this.$storages.has(key)) {
            throw new Error("重复添加配置表存储方式：" + key);
        }
        this.$storages.set(key, new ConfigStorage(keys));
    }

    Save(value: any): boolean {
        const index = this.$configs.indexOf(value);
        if (index >= 0) {
            return false;
        }
        this.$configs.push(value);
        for (let i of this.$storages.values()) {
            i.Save(value);
        }
        return true;
    }

    /**
     * 获取
     * @param keys 
     * @param values 
     * @returns 
     */
    Get<T>(keys?: Array<string>, values?: Array<any>): T | Array<T> {
        if (keys == null && values == null || keys.length == 0 && values.length == 0) {
            return this.$configs;
        }
        if (keys.length != values.length) {
            throw new Error("参数长度不一致!");
        }
        let sKey: string = StringUtils.PieceTogether(keys);
        if (this.$storages.has(sKey)) {
            const s = this.$storages.get(sKey);
            const vKey = StringUtils.PieceTogether(values);
            return s.Get<T>(vKey);
        }
    }

    Destroy(): void {
        this.$configs = null;
        for (const iterator of this.$storages.values()) {
            iterator.Destroy();
        }
        this.$storages = null;
    }
}

class ConfigStorage {

    key: string;
    keys: Array<string>;
    map: Map<string, any>;
    
    constructor(keys: Array<string>) {
        this.key = StringUtils.PieceTogether(keys);;
        this.keys = keys;
    }

    Save(value: any): void {
        let values: Array<any> = [];
        for (let index = 0; index < this.keys.length; index++) {
            const key = this.keys[index];
            values.push(value[key]);
        }
        const saveKey = StringUtils.PieceTogether(values);
        if (this.map.has(saveKey)) {
            throw new Error("配置表唯一Key存在重复内容:" + saveKey);
        }
        this.map.set(saveKey, value);
    }

    Get<T>(key: string): T {
        if (this.map.has(key)) {
            return this.map.get(key);
        }
        return null;
    }

    Destroy(): void {
        this.key = null;
        this.keys = null;
        this.map.clear();
        this.map = null;
    }
}