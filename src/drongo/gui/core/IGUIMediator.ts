import { ResURL } from "../../../drongo-cc";
import { IService } from "../../services/IService";
import { IViewComponent } from "./IViewComponent";



export interface IGUIMediator {

    info: any;
    /**
     * 依赖的配置
     */
    configs: Array<string>;
    /**依赖的资源*/
    assets: Array<ResURL>;
    /**
     * 依赖的服务
     */
    services: Array<{ new(): IService }>;
    /**
     * 是否显示进度条
     */
    showLoadingView: boolean;
    /**
     * 显示界面时是否关闭进度条
     */
    closeLoadingView: boolean;
    /**
     * 界面准备时汇报总比值
     */
    loadingViewTotalRatio:number;
    
    /**初始化完毕 */
    inited: boolean;

    /**
     * 显示节点
     */
    viewComponent: IViewComponent | null;

    /**
     * 播放显示动画
     * @param complete 
     */
    PlayShowAnimation?: (complete: () => void) => void;

    /**
     * 界面关闭时播放的动画
     * @param complete 
     */
    PlayHideAnimation?: (complete: () => void) => void;

    /**
     * 创建UI
     * @param info 
     * @param created 
     */
    CreateUI(info: any, created: Function): void;

    /**
     * 初始化
     */
    Init(): void;

    /**
     * 心跳
     * @param dt 
     */
    Tick(dt: number): void;

    /**
     * 显示(内部接口，请勿调用)
     * @param data 
     */
    Show(data?: any): void;

    /**
     * 当已经处在显示中 GUIManager.call时 则调用该方法而不调用showedUpdate
     * @param data 
     */
    ShowedUpdate(data?: any): void;

    /**
     * 隐藏(内部接口，请勿调用)
     * @param info 
     */
    Hide(): void;

    /**
     * 销毁
     */
    Destroy(): void;

    /**
     * 获取组件
     * @param path 
     */
    GetUIComponent(path: string): any;
}