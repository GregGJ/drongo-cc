import { DEvent } from "../../events/DEvent";
import { EventDispatcher } from "../../events/EventDispatcher";
import { ChangedData } from "../ChangedData";
import { SerializationMode } from "../SerializationMode";
import { IValue } from "../core/IValue";



/**
 * 值抽象类
 */
export class BaseValue extends EventDispatcher implements IValue {

    value: any;

    constructor() {
        super();
    }

    GetValue(): any {
        return this.value;
    }
    
    SetValue(value: any): void {
        if (this.CheckValue(value)) {
            var oldValue: any = this.value;
            this.value = value;
            this.SendEvent(this.value, oldValue);
        }
    }

    protected SendEvent(newValue: any, oldValue: any): void {
        if (this.HasEvent(DEvent.VALUE_CHANGED)) {
            this.Emit(DEvent.VALUE_CHANGED, ChangedData.Create(newValue, oldValue));
        }
    }

    /**
     * 检测值是否合法
     * @param value 
     */
    protected CheckValue(value: any): boolean {
        return false;
    }

    /**
     * 反序列化
     * @param type 
     * @param data 
     */
    Decode(type: Number, data: any): void {
        switch (type) {
            case SerializationMode.JSON:
                this.SetValue(data);
                break;

            default:
                throw new Error("未知序列化类型:" + type);
        }
    }

    /**
     * 序列化
     * @param type 
     * @param data 
     * @returns 
     */
    Encode(type: number, data?: any): any {
        switch (type) {
            case SerializationMode.JSON:
                return this.value;

            default:
                throw new Error("未知序列化类型:" + type);
        }
    }

    Equality(value: IValue): boolean {
        if (this.value == value.GetValue()) {
            return true;
        }
        return false;
    }
}