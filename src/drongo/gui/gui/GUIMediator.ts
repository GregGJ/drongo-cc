import { Color } from "cc";
import { BaseMediator } from "./BaseMediator";
import { IGUIInfo } from "./IGUIInfo";
import { SubGUIMediator } from "./SubGUIMediator";
import { IGUIMediator } from "../core/IGUIMediator";
import { IService } from "../../services/IService";
import { GComponent } from "../../../fairygui/GComponent";
import { GGraph } from "../../../fairygui/GGraph";
import { AsyncOperation } from "../../../fairygui/AsyncOperation";
import { UIPackage } from "../../../fairygui/UIPackage";
import { GObject } from "../../../fairygui/GObject";
import { Drongo } from "../../../drongo";
import { GUIManager } from "../GUIManager";


/**
 * UI中介者
 */
export class GUIMediator extends BaseMediator implements IGUIMediator {

    info: IGUIInfo | null = null;

    /**依赖的服务 */
    services: Array<{new():IService}>;

    /**根节点 */
    viewComponent: GComponent | null = null;

    /**遮罩 */
    private __mask: GGraph | null = null;

    /**创建UI完成回调*/
    private __createdCallBack: Function;

    /**子Mediator(用于代码拆分)*/
    protected $subMediators: Array<SubGUIMediator>;

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

    Destroy(): void {
        if (this.__mask) {
            this.__mask.offClick(this._maskClickHandler, this);
            this.__mask.dispose();
            this.__mask = null;
        }
        (<GComponent>this.viewComponent).dispose();
        this.info = null;
        if (this.$subMediators) {
            for (let index = 0; index < this.$subMediators.length; index++) {
                const element = this.$subMediators[index];
                element.Destroy();
            }
        }
    }
}
