import { GUIState } from "./GUIState";
import { IGUIMediator } from "./IGUIMediator";

/**
 * UI管理器接口
 */
export interface IGUIManager {

    /**
     * 注册
     * @param key 
     * @param mediatorClass 
     * @param data 
     */
    Register(info: { key: string }): void;

    /**
     * 注销
     * @param key 
     */
    Unregister(key: string): void;

    /**
     * 心跳
     * @param dt 
     */
    Tick(dt: number): void;

    /**
     * 打开
     * @param key 
     * @param data 
     */
    Open(key: string, data?: any): void;

    /**
     * 关闭
     * @param key 
     * @param checkLayer  是否检查全屏打开记录
     */
    Close(key: string,checkLayer:boolean): void;

    /**
     * 关闭所有
     * @param key 
     */
    CloseAll(): void;

    /**
     * 是否已打开
     * @param key 
     * @returns
     */
    GetGUIState(key: string): GUIState;

    /**
     * 获取GUI中的某个组件
     * @param key    界面全局唯一KEY
     * @param path   组件名称/路径
     */
    GetUIComponent(key: string, path: string): any;

    /**
     * 获取界面Mediator
     * @param key 界面全局唯一KEY
     */
    GetMediatorByKey(key:string):IGUIMediator;

    /**
     * 获得前一个打开的全屏界面
     */
    GetPrevLayer():string;
    
    /**
     * 是否已打开或打开中
     * @param key
     */
    IsOpen(key: string): boolean;
}