import { GComponent } from "../../../fairygui/GComponent";
import { BindingUtils } from "../../bindings/BindingUtils";
import { Handler } from "../../utils/Handler";





/**
 * 基础UIMediator类
 */
export class BaseMediator {

    /**UI组件 */
    ui: GComponent | null = null;

    /**初始化完毕*/
    inited: boolean = false;

    /**外部传参*/
    data: any;

    /**需要注册和删除的事件*/
    private __bindEvents: Array<{ target: any, eventType: string, handler: Function, caller: any }> = [];

    private __bindingUtils: BindingUtils;

    constructor() {
        this.__bindingUtils = new BindingUtils();
    }

    Init(): void {

    }

    Tick(dt: number): void {

    }

    Show(data: any): void {
        this.data = data;
        this._addBindedEvents();
        this.__bindingUtils.BindByRecords();
    }

    ShowedUpdate(data?: any): void {
        this.data = data;
    }

    Hide(): void {
        this._removeBindedEvents();
        this.__bindingUtils.UnbindByRecords();
    }

    Destroy(): void {
        this.__bindEvents.length = 0;
        this.__bindEvents = null;
        this.__bindingUtils.Destroy();
        this.__bindingUtils = null;
    }

    /**
     * 根据名称或路径获取组件
     * @param path 
     * @returns 
     */
    GetUIComponent(path: string): any {
        let paths: Array<string> = path.split("/");
        let ui: any = this.ui;
        let index: number = 0;
        let uiName: string;
        while (ui && index < paths.length) {
            uiName = paths[index];
            //兼容m_写法
            if (uiName.startsWith("m_")) {
                uiName = uiName.replace("m_", "");
            }
            ui = ui.getChild(uiName);
            index++;
        }
        return ui;
    }

    /**
     * 属性和属性的绑定
     */
    BindAA(source: any, property: string, target: any, tProperty: string): void {
        this.__bindingUtils.BindAA(source, property, target, tProperty);
    }

    /**
     * 取消属性和属性的绑定
     * @param source 
     * @param property 
     * @param target 
     * @param tProperty 
     */
    UnbindAA(source: any, property: string, target: any, tProperty: string): void {
        this.__bindingUtils.UnbindAA(source, property, target, tProperty);
    }

    /**
     * 属性和函数的绑定
     * @param source 
     * @param property 
     * @param callBack 
     * @param caller 
     */
    BindAM(source: any, property: string | Array<string>, callBack: (prepertys: Array<string>) => void, caller: any): void {
        this.__bindingUtils.BindAM(source, property, callBack, caller);
    }

    /**
     * 取消属性和函数的绑定
     * @param source 
     * @param propertys 
     * @param callBack 
     * @param caller 
     */
    UnbidAM(source: any, propertys: string | Array<string>, callBack: (prepertys: Array<string>) => void, caller: any): void {
        this.__bindingUtils.UnbidAM(source, propertys, callBack, caller);
    }


    /**
     * 函数和函数的绑定
     * @param source        
     * @param functionName  目标函数
     * @param preHandle     该函数将在目标函数调用前调用
     * @param laterHandler  该函数将在目标函数调用后调用
     */
    BindMM(source: any, functionName: string, preHandle: Handler, laterHandler?: Handler): void {
        this.__bindingUtils.BindMM(source, functionName, preHandle, laterHandler);
    }

    /**
     * 取消方法和方法的绑定关系
     * @param source 
     * @param functionName 
     * @param preHandle 
     * @param laterHandler 
     */
    UnbindMM(source: any, functionName: string, preHandle: Handler, laterHandler: Handler): void {
        this.__bindingUtils.UnbindMM(source, functionName, preHandle, laterHandler);
    }

    /**
     * 绑定事件
     * @param target 
     * @param type 
     * @param handler 
     * @param caller 
     */
    BindEvent(target: any, type: string, handler: Function, caller: any): void {
        for (let index = 0; index < this.__bindEvents.length; index++) {
            const element = this.__bindEvents[index];
            if (element.target == target && element.eventType == type && element.handler == handler && element.caller == caller) {
                throw new Error("重复绑定UI事件：" + target + type + handler + caller);
            }
        }
        if (!this.inited) {
            this.__bindEvents.push({ target: target, eventType: type, handler: handler, caller: caller });
        } else {
            target.on(type, handler, caller);
        }
    }

    /**
     * 取消事件绑定
     * @param target 
     * @param type 
     * @param handler 
     * @param caller 
     */
    UnbindEvent(target: any, type: string, handler: Function, caller: any): void {
        for (let index = 0; index < this.__bindEvents.length; index++) {
            const element = this.__bindEvents[index];
            if (element.target == target && element.eventType == type && element.handler == handler && element.caller == caller) {
                this.__bindEvents.splice(index, 1);
                if (this.inited) {
                    target.off(type, handler, caller);
                }
            }
        }
    }

    /**
     * 按照绑定记录添加事件
     */
    _addBindedEvents(): void {
        if (this.__bindEvents.length == 0) {
            return;
        }
        for (let index = 0; index < this.__bindEvents.length; index++) {
            const eventInfo = this.__bindEvents[index];
            eventInfo.target.on(eventInfo.eventType, eventInfo.handler, eventInfo.caller);
        }
    }

    /**
     * 删除已绑定事件
     */
    _removeBindedEvents(): void {
        if (this.__bindEvents.length == 0) {
            return;
        }

        for (let index = 0; index < this.__bindEvents.length; index++) {
            const eventInfo = this.__bindEvents[index];
            eventInfo.target.off(eventInfo.eventType, eventInfo.handler, eventInfo.caller);
        }
    }
}