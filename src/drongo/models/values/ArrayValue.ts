import { ModelEvent } from "../ModelEvent";
import { ModelFactory } from "../ModelFactory";
import { SerializationMode } from "../SerializationMode";
import { IValue } from "../core/IValue";
import { BaseValue } from "./BaseValue";



/**
 * 数组型数值
 */
export class ArrayValue extends BaseValue {

    constructor() {
        super();
        this.value = [];
    }

    protected CheckValue(value: any): boolean {
        if (value != null && Array.isArray(value)) {
            return true;
        }
        return false;
    }

    /**
     * 添加到指定位置
     * @param index 
     * @param value 
     */
    AddAt(index: number, value: IValue): void {
        if (index < this.elements.length - 1) {
            this.elements.splice(index, 0, value);
            if (this.HasEvent(ModelEvent.ADD_CHILD)) {
                this.Emit(ModelEvent.ADD_CHILD, ModelEvent.Create(index));
            }
            value.On(ModelEvent.VALUE_CHANGED, this.ChildValueChanged, this);
            value.On(ModelEvent.CHILD_VALUE_CHANGED, this.ChildValueChanged, this);
        } else {
            throw new Error("索引" + index + " 超出可添加范围:" + (this.elements.length - 1));
        }
    }

    /**
     * 删除
     * @param value 
     */
    Remove(value: IValue): void {
        let index = this.elements.indexOf(value);
        this.RemoveAt(index);
    }

    /**
     * 通过索引删除并返回元素
     * @param index 
     */
    RemoveAt(index: number): IValue {
        if (index < 0 || index > this.elements.length - 1) {
            throw new Error("要删除的索引超出数组边界！");
        }
        let result: IValue = this.elements[index];
        this.elements.splice(index, 1);
        if (this.HasEvent(ModelEvent.REMOVE_CHILD)) {
            this.Emit(ModelEvent.REMOVE_CHILD, ModelEvent.Create(index));
        }
        result.Off(ModelEvent.VALUE_CHANGED, this.ChildValueChanged, this);
        result.Off(ModelEvent.CHILD_VALUE_CHANGED, this.ChildValueChanged, this);
        return result;
    }


    /**
     * 添加到末尾
     * @param value 
     */
    Push(value: IValue): void {
        let index: number = this.elements.indexOf(value);
        if (index >= 0) {
            throw new Error("重复添加！");
        }
        index = this.elements.length;
        this.elements.push(value);
        if (this.HasEvent(ModelEvent.ADD_CHILD)) {
            this.Emit(ModelEvent.ADD_CHILD, ModelEvent.Create(index));
        }
        value.On(ModelEvent.VALUE_CHANGED, this.ChildValueChanged, this);
        value.On(ModelEvent.CHILD_VALUE_CHANGED, this.ChildValueChanged, this);
    }

    /**
     * 添加到头部
     * @param value 
     */
    Unshift(value: IValue): void {
        let index: number = this.elements.indexOf(value);
        if (index >= 0) {
            throw new Error("重复添加！");
        }
        this.elements.unshift(value);
        if (this.HasEvent(ModelEvent.ADD_CHILD)) {
            this.Emit(ModelEvent.ADD_CHILD, ModelEvent.Create(0));
        }
        value.On(ModelEvent.VALUE_CHANGED, this.ChildValueChanged, this);
        value.On(ModelEvent.CHILD_VALUE_CHANGED, this.ChildValueChanged, this);
    }

    /**
     * 删除并返回第一个元素
     */
    Shift(): IValue {
        if (this.elements.length == 0) {
            throw new Error("数组为空！");
        }
        let result: IValue = this.elements.shift();
        if (this.HasEvent(ModelEvent.REMOVE_CHILD)) {
            this.Emit(ModelEvent.REMOVE_CHILD, ModelEvent.Create(0));
        }
        result.Off(ModelEvent.VALUE_CHANGED, this.ChildValueChanged, this);
        result.Off(ModelEvent.CHILD_VALUE_CHANGED, this.ChildValueChanged, this);
        return result;
    }

    /**
    * 删除并返回最后一个元素
    */
    Pop(): IValue {
        if (this.elements.length == 0) {
            throw new Error("数组为空！");
        }
        let index: number = this.elements.length - 1;
        let result: IValue = this.elements.pop();
        if (this.HasEvent(ModelEvent.REMOVE_CHILD)) {
            this.Emit(ModelEvent.REMOVE_CHILD, ModelEvent.Create(index));
        }
        result.Off(ModelEvent.VALUE_CHANGED, this.ChildValueChanged, this);
        result.Off(ModelEvent.CHILD_VALUE_CHANGED, this.ChildValueChanged, this);
        return result;
    }

    /**
     * 通过索引获取元素
     * @param index 
     */
    GetAt(index: number): IValue {
        return this.elements[index];
    }

    /**
     * 获取索引值
     * @param value 
     */
    GetChildIndex(value: IValue): number {
        return this.elements.indexOf(value);
    }

    /**
     * 检测时候包含该内容
     * @param value 
     */
    Contain(value: IValue): boolean {
        for (let index = 0; index < this.elements.length; index++) {
            const element = this.elements[index];
            if (element.Equality(value)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 对比
     * @param value 
     */
    Equality(value: IValue): boolean {
        if (value instanceof ArrayValue) {
            if (this.elements == value.elements) {
                return true;
            }
            if (this.elements.length != value.elements.length) {
                return false;
            }
            let a: IValue, b: IValue;
            for (let index = 0; index < this.length; index++) {
                a = this.elements[index];
                b = value.elements[index];
                if (a.Equality(b) == false) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }


    private ChildValueChanged(data: any): void {
        if (this.HasEvent(ModelEvent.CHILD_VALUE_CHANGED)) {
            this.Emit(ModelEvent.CHILD_VALUE_CHANGED, data);
        }
    }

    /**
     * 清除
     */
    Clear(): void {
        this.elements.length=0;
    }

    /**
     * 列表长度
     */
    get length(): number {
        return this.elements.length;
    }

    /**
     * 内容
     */
    get elements(): Array<IValue> {
        return this.value;
    }

    /**
     * 反序列化
     * @param type 
     * @param data 
     */
    Decode(type: Number, data: any): void {
        switch (type) {
            case SerializationMode.JSON:
                let item: any;
                let value: IValue;
                for (let i: number = 0; i < data.length; i++) {
                    item = data[i];
                    value = ModelFactory.CreateValue(item);
                    value.Decode(type, item);
                    this.Push(value);
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
     */
    Encode(type: number, data?: any): any {
        switch (type) {
            case SerializationMode.JSON:
                let result = [];
                let item: IValue;
                for (var i: number = 0; i < this.elements.length; i++) {
                    item = this.elements[i];
                    result.push(item.Encode(type, data));
                }
                return result;

            default:
                return null;
        }
    }
}