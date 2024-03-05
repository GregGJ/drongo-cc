import { EventDispatcher } from "../../events/EventDispatcher";
import { ModelEvent } from "../ModelEvent";
import { SerializationMode } from "../SerializationMode";
import { IValue } from "../core/IValue";



/**
 * 值抽象类
 */
export class BaseValue extends EventDispatcher implements IValue {

    protected data: any;

    constructor() {
        super();
    }

    GetValue(): any {
        return this.data;
    }
    
    SetValue(value: any): void {
        if (this.CheckValue(value)) {
            var oldValue: any = this.data;
            this.data = value;
            this.SendEvent(this.data, oldValue);
        }
    }

    protected SendEvent(newValue: any, oldValue: any): void {
        if (this.HasEvent(ModelEvent.VALUE_CHANGED)) {
            this.Emit(ModelEvent.VALUE_CHANGED, ModelEvent.Create(newValue, oldValue));
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
    Encode(type: Number, data?: any): any {
        switch (type) {
            case SerializationMode.JSON:
                return this.data;

            default:
                throw new Error("未知序列化类型:" + type);
        }
    }

    Equality(value: IValue): boolean {
        if (this.data == value.GetValue()) {
            return true;
        }
        return false;
    }
}