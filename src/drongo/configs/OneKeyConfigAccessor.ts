import { BaseConfigAccessor } from "./BaseConfigAccessor";



/**
 * 单key存储器默认key="id"
 */
export class OneKeyConfigAccessor extends BaseConfigAccessor {
    private __map: Map<any, any>;
    private __key: string;
    constructor(key?: string) {
        super();
        if (key == undefined) {
            key = "id";
        }
        this.__key = key;
        this.__map = new Map<any, any>();
    }

    Save(value: any): boolean {
        if (this.__map.has(value[this.__key])) {
            return false;
        }
        this.__map.set(value[this.__key], value);
        return super.Save(value);
    }

    Get<T>(key: any): T | null {
        if (!this.__map.has(key)) {
            return null;
        }
        return this.__map.get(key);
    }
}