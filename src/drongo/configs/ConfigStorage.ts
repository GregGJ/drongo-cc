import { Debuger } from "../debugers/Debuger";
import { StringUtils } from "../utils/StringUtils";


export class ConfigStorage {

    key: string;
    keys: Array<string>;
    map: Map<string, any>;

    constructor(keys: Array<string>) {
        this.key = StringUtils.PieceTogether(keys);;
        this.keys = keys;
        this.map = new Map<string, any>();
    }

    Save(value: any): void {
        let values: Array<any> = [];
        for (let index = 0; index < this.keys.length; index++) {
            const key = this.keys[index];
            values.push(value[key]);
        }
        const saveKey = StringUtils.PieceTogether(values);
        if (StringUtils.IsEmpty(saveKey)) {
            return;
        }
        if (this.map.has(saveKey)) {
            Debuger.Err(Debuger.DRONGO,"配置表唯一Key存在重复内容:" + saveKey)
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