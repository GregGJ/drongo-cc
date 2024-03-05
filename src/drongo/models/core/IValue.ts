import { IEventDispatcher } from "../../events/IEventDispatcher";
import { ISerialization } from "./ISerialization";


/**
 * 值接口
 */
export interface IValue extends IEventDispatcher, ISerialization {
    /**
     * 获取值
     */
    GetValue(): any;

    /**
     * 设置值
     * @param value 
     */
    SetValue(value: any): void;

    /**
     * 对比函数
     * @param value 
     */
    Equality(value: IValue): boolean;
}