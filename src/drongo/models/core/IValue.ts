import { IEventDispatcher } from "../../events/IEventDispatcher";
import { ISerialization } from "./ISerialization";


/**
 * 值接口
 */
export interface IValue extends IEventDispatcher, ISerialization {

    /**
     * 值对象（用于绑定）
     */
    value:any;

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