import { Color } from "cc";
import { Drongo } from "../../../drongo";
import { AsyncOperation } from "../../../fairygui/AsyncOperation";
import { GComponent } from "../../../fairygui/GComponent";
import { GGraph } from "../../../fairygui/GGraph";
import { GObject } from "../../../fairygui/GObject";
import { UIPackage } from "../../../fairygui/UIPackage";
import { IService } from "../../services/IService";
import { ServiceManager } from "../../services/ServiceManager";
import { GUIManager } from "../GUIManager";
import { IGUIMediator } from "../core/IGUIMediator";
import { BaseMediator } from "./BaseMediator";
import { IGUIInfo } from "./IGUIInfo";
import { SubGUIMediator } from "./SubGUIMediator";


/**
 * UI中介者
 */
export class GUIMediator extends BaseMediator implements IGUIMediator {

    info: IGUIInfo | null = null;

    /**依赖的服务 */
    services: Array<{ new(): IService }>;
    /**依赖的配置表 */
    configs: Array<string>;
    /**是否显示进度界面 */
    showLoadingView: boolean = false;

    /**根节点 */
    viewComponent: GComponent | null = null;

    /**遮罩 */
    private __mask: GGraph | null = null;

    /**创建UI完成回调*/
    private __createdCallBack: Function;

    /**子Mediator(用于代码拆分)*/
    protected $subMediators: Array<SubGUIMediator>;

    /**
     * 播放显示动画
     * @param complete 
     */
    PlayShowAnimation?: (complete: Function) => void;

    /**
     * 界面关闭时播放的动画
     * @param complete 
     */
    PlayHideAnimation?: (complete: Function) => void;
    
    constructor() {
        super();
    }

    /**
     * 创建UI
     * @param info 
     * @param created 
     */
    CreateUI(info: any, created: Function): void {
        this.info = info;
        if (this.info == null) {
            throw new Error("GUI 信息不能为空");
        }
        this.__createdCallBack = created;
        this.__createUI(true);
    }

    private __asyncCreator: AsyncOperation
    private __createUI(async: boolean): void {
        let packageName: string = this.info.packageName;
        if (async) {
            this.__asyncCreator = new AsyncOperation();
            this.__asyncCreator.callback = this.__uiCreated.bind(this);
            this.__asyncCreator.createObject(packageName, this.info!.comName);
        } else {
            try {
                let ui: GObject = UIPackage.createObject(packageName, this.info!.comName);
                this.__uiCreated(ui);
            } catch (err) {
                throw new Error("创建界面失败：" + this.info!.packageName + " " + this.info!.comName);
            }
        }
    }

    private __uiCreated(ui: GObject): void {
        let uiCom: GComponent = ui.asCom;
        uiCom.makeFullScreen();
        //如果需要遮罩
        if (this.info!.modal) {
            this.ui = uiCom;
            this.viewComponent = new GComponent();
            this.viewComponent.makeFullScreen();

            this.__mask = new GGraph();
            this.__mask.makeFullScreen();

            this.__mask.drawRect(0, Color.BLACK, Drongo.MaskColor);

            this.viewComponent.addChild(this.__mask);
            if (this.info!.modalClose) {
                this.__mask.onClick(this._maskClickHandler, this);
            }
            this.viewComponent.addChild(this.ui!);
        } else {
            this.ui = this.viewComponent = uiCom;
        }
        this.ui.name = this.info.key;
        if (this.__createdCallBack) {
            this.__createdCallBack();
            this.__createdCallBack = null;
        }
    }

    protected _maskClickHandler(): void {
        GUIManager.Close(this.info.key);
    }

    Init(): void {

    }

    Show(data?: any): void {
        super.Show(data);
        if (this.$subMediators) {
            for (let index = 0; index < this.$subMediators.length; index++) {
                const element = this.$subMediators[index];
                element.Show(data);
            }
        }
    }

    ShowedUpdate(data?: any): void {
        super.ShowedUpdate(data);
        if (this.$subMediators) {
            for (let index = 0; index < this.$subMediators.length; index++) {
                const element = this.$subMediators[index];
                element.ShowedUpdate(data);
            }
        }
    }

    Hide(): void {
        super.Hide();
        if (this.$subMediators) {
            for (let index = 0; index < this.$subMediators.length; index++) {
                const element = this.$subMediators[index];
                element.Hide();
            }
        }
    }

    /**
     * 关闭
     * @param checkLayer 是否检查全屏层记录
     */
    Close(checkLayer: boolean = true): void {
        GUIManager.Close(this.info.key, checkLayer);
    }

    Tick(dt: number): void {
        if (this.$subMediators) {
            for (let index = 0; index < this.$subMediators.length; index++) {
                const element = this.$subMediators[index];
                element.Tick(dt);
            }
        }
    }

    /**
     * 获取服务
     * @param clazz 
     * @returns 
     */
    GetService(clazz: { new(): IService }): IService {
        return ServiceManager.GetService(clazz);
    }

    Destroy(): void {
        super.Destroy();
        if (this.__mask) {
            this.__mask.offClick(this._maskClickHandler, this);
            this.__mask.dispose();
            this.__mask = null;
        }
        (<GComponent>this.viewComponent).dispose();
        this.info = null;
        //子界面逻辑类
        if (this.$subMediators) {
            for (let index = 0; index < this.$subMediators.length; index++) {
                const element = this.$subMediators[index];
                element.Destroy();
            }
        }
        //依赖的配置
        this.configs = null;
        if (this.services) {
            for (let index = 0; index < this.services.length; index++) {
                const element = this.services[index];
                ServiceManager.Dispose(element);
            }
            this.services = null;
        }
    }
}
