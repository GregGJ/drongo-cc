import { Injector } from "../utils/Injector";
import { GUIState } from "./core/GUIState";
import { IGUIManager } from "./core/IGUIManager";
import { IGUIMediator } from "./core/IGUIMediator";
import { GUIManagerImpl } from "./gui/GUIManagerImpl";



/**
     * GUI 管理器
     */
export class GUIManager {

    static KEY: string = "drongo.GUIManager";

    /**
     * 在界面关闭后多长时间不使用则销毁(秒)
     */
    static GUI_GC_INTERVAL: number = 30;

    /**
     * 注册
     * @param info 
     * @returns 
     */
    static Register(info: { key: string }): void {
        return this.impl.Register(info);
    }

    /**
     * 注销
     * @param key 
     * @returns 
     */
    static Unregister(key: string): void {
        return this.impl.Unregister(key);
    }

    /**
     * 打开指定UI界面
     * @param key 
     * @param data 
     */
    static Open(key: string, data?: any): void {
        this.impl.Open(key, data);
    }

    /**
     * 关闭
     * @param key 
     * @param checkLayer 是否检查全屏记录
     */
    static Close(key: string, checkLayer: boolean = true): void {
        this.impl.Close(key, checkLayer);
    }

    /**
     * 关闭所有界面
     */
    static CloseAll(): void {
        this.impl.CloseAll();
    }

    /**
     * 获取界面状态
     * @param key 
     * @returns  0 未显示  1显示中
     */
    static GetGUIState(key: string): GUIState {
        return this.impl.GetGUIState(key);
    }

    /**
     * 是否已打开或再打开中
     * @param key 
     * @returns 
     */
    static IsOpen(key: string): boolean {
        return this.impl.IsOpen(key);
    }

    /**
     * 获取GUI中的某个组件
     * @param key    界面全局唯一KEY
     * @param path   组件名称/路径
     */
    static GetUIComponent(key: string, path: string): any {
        return this.impl.GetUIComponent(key, path);
    }

    /**
     * 获取界面的mediator
     */
    static GetMediatorByKey(key: string): IGUIMediator {
        return this.impl.GetMediatorByKey(key);
    }

    /**
     * 获得前一个打开的全屏界面
     * @param curLayerKey 当前打开的全屏界面 
     */
    static GetPrevLayer(): string {
        return this.impl.GetPrevLayer();
    }

    private static __impl: IGUIManager;
    private static get impl(): IGUIManager {
        if (this.__impl == null) {
            this.__impl = Injector.GetInject(this.KEY);
        }
        if (this.__impl == null) {
            this.__impl = new GUIManagerImpl();
        }
        return this.__impl;
    }
}