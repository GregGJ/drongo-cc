import { Handler } from "../utils/Handler";
import { FunctionHook } from "./FunctionHook";
import { PropertyBinder } from "./PropertyBinder";

/**
 * 绑定器工具类
 */
export class BinderUtils {

    constructor() {

    }

    /**
     * 绑定
     * @param group 
     * @param source 
     * @param property 
     * @param targetOrCallBack 
     * @param tPropertyOrCaller 
     */
    static Bind(group: any, source: any, property: string | Array<string>, targetOrCallBack: any | Function, tPropertyOrCaller: string | any): void {
        let binder: PropertyBinder = source["$PropertyBinder"];
        if (!binder) {
            binder = new PropertyBinder(source);
            source["$PropertyBinder"] = binder;
        }
        binder.Bind(group, property, targetOrCallBack, tPropertyOrCaller);
    }

    /**
     * 取消绑定
     * @param group 
     * @param source 
     * @param property 
     * @param targetOrCallBack 
     * @param tPropertyOrCaller 
     * @returns 
     */
    static Unbind(group: any, source: any, property?: string | Array<string>, targetOrCallBack?: any | Function, tPropertyOrCaller?: string | any): void {
        let binder: PropertyBinder = source["$PropertyBinder"];
        if (!binder) {
            return;
        }
        binder.Unbind(group, property, targetOrCallBack, tPropertyOrCaller);
    }


    /**
     * 添加函数钩子
     * @param group 
     * @param source 
     * @param functionName 
     * @param preHandler 
     * @param laterHandler 
     */
    static AddHook(group:any,source: any, functionName: string, preHandler:Handler, laterHandler:Handler): void {
        let hook: FunctionHook = source["$FunctionHook"];
        if (!hook) {
            hook = new FunctionHook(source);
            source["$FunctionHook"] = hook;
        }
        hook.AddHook(group,functionName, preHandler, laterHandler);
    }

    /**
     * 删除函数钩子
     * @param group 
     * @param source 
     * @param functionName 
     * @param preHandler 
     * @param laterHandler 
     * @returns 
     */
    static RemoveHook(group:any,source: any, functionName?: string, preHandler?:Handler, laterHandler?:Handler): void {
        let hook: FunctionHook = source["$FunctionHook"];
        if (!hook) {
            return;
        }
        hook.RemoveHook(group,functionName, preHandler, laterHandler);
    }
}