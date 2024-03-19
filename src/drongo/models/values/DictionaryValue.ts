import { Dictionary } from "../../containers/Dictionary";
import { DEvent } from "../../events/DEvent";
import { ChangedData } from "../ChangedData";
import { ModelFactory } from "../ModelFactory";
import { SerializationMode } from "../SerializationMode";
import { IProperty } from "../core/IProperty";
import { IValue } from "../core/IValue";
import { BaseValue } from "./BaseValue";


/**
 * 对象类型数据
 */
export class DictionaryValue extends BaseValue {

    constructor() {
        super();
        this.value = new Dictionary<string, IProperty>();
    }

    /**
     * 添加属性
     * @param value 
     */
    Add(value: IProperty): IValue {
        if (this.map.Has(value.key)) {
            throw new Error("重复添加相同KEY的属性！");
        }
        this.map.Set(value.key, value);
        if (this.HasEvent(DEvent.ADD_CHILD)) {
            this.Emit(DEvent.ADD_CHILD, ChangedData.Create(value, null, value.key));
        }
        value.On(DEvent.VALUE_CHANGED, this.ChildValueChanged, this);
        value.On(DEvent.CHILD_VALUE_CHANGED, this.ChildValueChanged, this);
        return value;
    }

    /**
     * 删除属性
     * @param value 
     */
    Remove(value: IProperty): void {
        this.RemoveByKey(value.key);
    }

    /**
     * 通过属性key删除并返回
     * @param key 
     */
    RemoveByKey(key: string): IValue {
        if (!this.map.Has(key)) {
            throw new Error("要删除的属性不在集合内!");
        }
        let result: IValue = this.map.Get(key);
        this.map.Delete(key);
        if (this.HasEvent(DEvent.REMOVE_CHILD)) {
            this.Emit(DEvent.REMOVE_CHILD, ChangedData.Create(null, result, key));
        }
        result.Off(DEvent.VALUE_CHANGED, this.ChildValueChanged, this);
        result.Off(DEvent.CHILD_VALUE_CHANGED, this.ChildValueChanged, this);
        return result;
    }

    /**
     * 查询是否存在
     * @param key 
     * @returns 
     */
    Has(key: string): boolean {
        return this.map.Has(key);
    }

    /**
     * 更新属性
     * @param key 
     * @param data 
     */
    Update(key: string, data: any): void {
        if (this.map.Has(key) == false) {
            throw new Error("要更新的属性不存在！" + key);
        }
        let value: IValue = this.map.Get(key);
        value.SetValue(data);
    }

    /**
     * 更新多项属性
     * @param keys 
     * @param values 
     */
    MultUpdate(keys: Array<string>, values: Array<any>): void {
        if (keys == null || values == null) {
            throw new Error("Keys和values不能为空！");
        }
        if (keys.length != values.length) {
            throw new Error("keys.length!=values.length");
        }
        let key: string;
        let value: any;
        for (let i: number = 0; i < keys.length; i++) {
            key = keys[i];
            value = values[i];
            this.Update(key, value);
        }
    }

    /**
     * 获取属性
     * @param key 
     */
    Get(key: string): IValue {
        return this.map.Get(key);
    }

    /**
     * 对比
     * @param value 
     */
    Equality(value: IValue): boolean {
        if (value instanceof DictionaryValue) {
            if (this.elements.length != value.elements.length) {
                return false;
            }
            let a: IValue;
            let b: IValue;
            for (let i: number = 0; i < this.elements.length; i++) {
                a = this.elements[i];
                b = value.elements[i];
                if (a.Equality(b) != false) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    /**
     * 清除
     */
    Clear(): void {
        this.map.Clear();
    }

    private ChildValueChanged(e: DEvent): void {
        if (this.HasEvent(DEvent.CHILD_VALUE_CHANGED)) {
            this.Emit(DEvent.CHILD_VALUE_CHANGED, e.data);
        }
    }

    get elements(): Array<IValue> {
        return this.map.elements;
    }

    private get map(): Dictionary<string, IValue> {
        return this.value;
    }

    /**
     * 反序列化
     * @param type 
     * @param data 
     */
    Decode(type: number, data: any): void {
        switch (type) {
            case SerializationMode.JSON:
                let item: any;
                let property: IProperty;
                for (const key in data) {
                    if (Object.prototype.hasOwnProperty.call(data, key)) {
                        item = data[key];
                        property = ModelFactory.CreateProperty(key, item);
                        property.key = key;
                        property.Decode(type, item);
                        this.Add(property);
                    }
                }
                break;

            default:
                break;
        }
    }

    /**
     * 序列化
     * @param type 
     * @param data 
     * @returns 
     */
    Encode(type: number, data: any = null): any {
        switch (type) {
            case SerializationMode.JSON:
                let result: any = {};
                let item: IProperty;
                for (let index = 0; index < this.elements.length; index++) {
                    item = this.elements[index] as IProperty;
                    result[item.key] = item.Encode(type, data);
                }
                return result;

            default:
                return null;
        }
    }
}