import { Handler } from "../utils/Handler";
import { BinderUtils } from "./BinderUtils";

/**
 * 属性与属性数据
 */
export interface PropertyBindInfo {
    /**
     * 数据源对象
     */
    source: any;
    /**
     * 数据源属性名
     */
    property: string | Array<string>;
    /**
     * 目标对象
     */
    targetOrCallback: any | Function;
    /**
     * 目标属性名
     */
    targetPropertyOrCaller: string | any;
}

/**
 * 方法与方法绑定信息
 */
export interface FunctionHookInfo {
    source: any;
    functionName: string;
    preHandler: Handler;
    laterHandler: Handler;
}

/**
 * 绑定工具类
 */
export class BindingUtils {

    /**属性绑定记录 */
    private __bindRecords: Array<PropertyBindInfo>;
    /**方法绑定记录 */
    private __hookRecords: Array<FunctionHookInfo>;

    constructor() {
        this.__bindRecords = [];
        this.__hookRecords = [];
    }

    /**
     * 数据绑定
     * @param source 
     * @param property 
     * @param targetOrCallBack 
     * @param tPropertyKeyOrCaller 
     */
    private __bind(source: any, property: string | Array<string>, targetOrCallBack: any | Function, tPropertyKeyOrCaller: string | any): void {
        for (let index = 0; index < this.__bindRecords.length; index++) {
            const element = this.__bindRecords[index];
            if (element.source == source &&
                element.property == property &&
                element.targetOrCallback == targetOrCallBack &&
                element.targetPropertyOrCaller == tPropertyKeyOrCaller) {
                //重复绑定
                throw new Error("重复绑定：" + source + property + targetOrCallBack + tPropertyKeyOrCaller);
            }
        }
        this.__bindRecords.push({
            source: source,
            property: property,
            targetOrCallback: targetOrCallBack,
            targetPropertyOrCaller: tPropertyKeyOrCaller
        });
        BinderUtils.Bind(this, source, property, targetOrCallBack, tPropertyKeyOrCaller);
    }

    /**
     * 取消绑定
     * @param source 
     * @param property 
     * @param targetOrCallBack 
     * @param tPropertyKeyOrCaller
     */
    private __unbind(source: any, property?: string | Array<string>, targetOrCallBack?: any | Function, tPropertyKeyOrCaller?: string | any): void {
        for (let index = 0; index < this.__bindRecords.length; index++) {
            const element = this.__bindRecords[index];
            if (element.source == source &&
                element.property == property &&
                element.targetOrCallback == targetOrCallBack &&
                element.targetPropertyOrCaller == tPropertyKeyOrCaller) {
                this.__bindRecords.splice(index, 1);
            }
        }
        BinderUtils.Unbind(this, source, property, targetOrCallBack, tPropertyKeyOrCaller);
    }

    /**
     * 添加函数钩子
     * @param source 
     * @param functionName 
     * @param preHandles 
     * @param laterHandlers
     */
    private __addHook(source: any, functionName: string, preHandle: Handler, laterHandler?: Handler): void {
        for (let index = 0; index < this.__hookRecords.length; index++) {
            const element = this.__hookRecords[index];
            if (element.source == source &&
                element.functionName == functionName &&
                preHandle.Equal(element.preHandler) &&
                laterHandler.Equal(element.laterHandler)) {
                //重复绑定
                throw new Error("重复绑定：" + source + " " + functionName);
            }
        }
        //记录
        this.__hookRecords.push({ source: source, functionName: functionName, preHandler: preHandle, laterHandler: laterHandler });
        BinderUtils.AddHook(this, source, functionName, preHandle, laterHandler);
    }

    /**
     * 删除函数钩子
     * @param source
     * @param functionName
     * @param preHandle
     * @param laterHandler
     */
    private __removeHook(source: any, functionName?: string, preHandle?: Handler, laterHandler?: Handler): void {
        for (let index = 0; index < this.__hookRecords.length; index++) {
            const element = this.__hookRecords[index];
            if (element.source == source &&
                element.functionName == functionName &&
                preHandle.Equal(element.preHandler) &&
                laterHandler.Equal(element.laterHandler)) {
                this.__hookRecords.splice(index, 1);
            }
        }
        BinderUtils.RemoveHook(this, source, functionName, preHandle, laterHandler);
    }

    /**
     * 属性和属性的绑定
     * @param source            数据源
     * @param property          数据源属性名
     * @param target            目标对象
     * @param targetProperty    目标对象属性名
     */
    BindAA(source: any, property: string, target: any, targetProperty: string): void {
        this.__bind(source, property, target, targetProperty);
    }

    /**
     * 取消属性和属性的绑定
     * @param source 
     * @param property 
     * @param target 
     * @param targetProperty 
     */
    UnbindAA(source: any, property: string, target: any, targetProperty: string): void {
        this.__unbind(source, property, target, targetProperty);
    }

    /**
     * 属性和函数的绑定
     * @param source 
     * @param property 
     * @param callBack 
     * @param caller 
     */
    BindAM(source: any, property: string | Array<string>, callBack: (prepertys: Array<string>) => void, caller: any): void {
        this.__bind(source, property, callBack, caller);
    }

    /**
     * 取消属性和函数的绑定
     * @param source 
     * @param propertys 
     * @param callBack 
     * @param caller 
     */
    UnbidAM(source: any, propertys: string | Array<string>, callBack: (prepertys: Array<string>) => void, caller: any): void {
        this.__unbind(source, propertys, callBack, caller);
    }


    /**
     * 函数和函数的绑定
     * @param source        
     * @param functionName  目标函数
     * @param preHandle     该函数将在目标函数调用前调用
     * @param laterHandler  该函数将在目标函数调用后调用
     */
    BindMM(source: any, functionName: string, preHandle: Handler, laterHandler?: Handler): void {
        this.__addHook(source, functionName, preHandle, laterHandler);
    }

    /**
     * 取消方法和方法的绑定关系
     * @param source 
     * @param functionName 
     * @param preHandle 
     * @param laterHandler 
     */
    UnbindMM(source: any, functionName: string, preHandle: Handler, laterHandler: Handler): void {
        this.__removeHook(source, functionName, preHandle, laterHandler);
    }

    //根据记录添加绑定
    BindByRecords(): void {
        //bind
        for (let index = 0; index < this.__bindRecords.length; index++) {
            const element = this.__bindRecords[index];
            BinderUtils.Bind(this, element.source, element.property, element.targetOrCallback, element.targetPropertyOrCaller);
        }
        //addHook
        for (let index = 0; index < this.__hookRecords.length; index++) {
            const element = this.__hookRecords[index];
            BinderUtils.AddHook(this, element.source, element.functionName, element.preHandler, element.laterHandler);
        }
    }

    //根据记录删除绑定
    UnbindByRecords(): void {
        //unbind
        for (let index = 0; index < this.__bindRecords.length; index++) {
            const element = this.__bindRecords[index];
            BinderUtils.Unbind(this, element.source, element.property, element.targetOrCallback, element.targetPropertyOrCaller);
        }
        //removeHook
        for (let index = 0; index < this.__hookRecords.length; index++) {
            const element = this.__hookRecords[index];
            BinderUtils.RemoveHook(this, element.source, element.functionName, element.preHandler, element.laterHandler);
        }
    }

    /**
     * 销毁
     */
    Destroy(): void {
        if (this.__hookRecords) {
            this.__hookRecords.length = 0;
            this.__hookRecords = null;
        }
        if (this.__bindRecords) {
            this.__bindRecords.length = 0;
            this.__bindRecords = null;
        }
    }
}