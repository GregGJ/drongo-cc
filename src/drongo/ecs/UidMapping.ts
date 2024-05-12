import { Dictionary } from "../containers/Dictionary";


export class UidMapping<TKey, TValue> {

    private __keys: Dictionary<TKey, TValue>;
    private __values: Dictionary<TValue, TKey>;

    constructor() {
        this.__keys = new Dictionary<TKey, TValue>();
        this.__values = new Dictionary<TValue, TKey>();
    }

    Mapping(key: TKey, value: TValue): void {
        if (this.__keys.Has(key)) {
            throw new Error("重复映射:" + key + "|" + value);
        }
        this.__keys.Set(key, value);
        this.__values.Set(value, key);
    }

    Has(key: TKey): boolean {
        return this.__keys.Has(key);
    }

    Remove(key: TKey): void {
        if (!this.__keys.Has(key)) {
            throw new Error("数据不存在:" + key);
        }
        let v = this.__keys.Get(key);
        this.__keys.Delete(key);
        this.__values.Delete(v);
    }

    Clear(): void {
        this.__keys.Clear();
        this.__values.Clear();
    }

    GetValue(key:TKey):TValue{
        return this.__keys.Get(key);
    }

    GetKey(value:TValue):TKey{
        return this.__values.Get(value);
    }

    get elements():Array<TValue>{
        return this.__keys.elements;
    }

    Destroy(): void {
        this.__keys = null;
        this.__values = null;
    }
}