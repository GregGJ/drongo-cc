import { assetManager, Component, Node } from "cc";
import { IGUIInfo } from "./IGUIInfo";
import { IGUIMediator } from "../core/IGUIMediator";
import { ResRef } from "../../res/core/ResRef";
import { ResURL, URL2Key } from "../../res/core/ResURL";
import { Timer } from "../../timer/Timer";
import { Drongo } from "../../../drongo";
import { Res } from "../../res/Res";
import { LoadingView } from "../core/loadingView/LoadingView";
import { IViewCreator } from "../core/IViewCreator";
import { ServiceManager } from "../../services/ServiceManager";
import { GUIManager } from "../GUIManager";
import { Event } from "../../events/Event";
import { LayerManager } from "../core/layer/LayerManager";
import { ILayer } from "../core/layer/ILayer";
import { IService } from "../../services/IService";



enum LoadState {
    Null,
    Loading,
    Loaded
}

/**
 * GUI代理，将资源加载和Mediator逻辑隔离开
 */
export class GUIProxy {

    /**用于Creator创建器的统一帮助节点 */
    private static createNode: Node = new Node("createHelpNode");

    info?: IGUIInfo;

    /**GUI中介*/
    mediator?: IGUIMediator;

    /**关闭时间*/
    closeTime: number = 0;

    /**UI层次*/
    zIndex: number = 0;

    /**数据 */
    data: any;

    /**资源引用*/
    private __resRef: ResRef | null = null;

    /**是否在显示中*/
    private __showing: boolean = false;

    /**加载状态 */
    private __loadState: LoadState = LoadState.Null;

    private __uiURL: ResURL;

    private __startTime: number;

    constructor(info: IGUIInfo) {
        this.info = info;
        if (!this.info) {
            throw new Error("UI信息不能为空！");
        }
    }

    /**
     * 加载代码包
     */
    private __loadCodeBundle(): void {
        this.__startTime = Timer.currentTime;
        this.__loadState = LoadState.Loading;
        if (!assetManager.getBundle(this.info.bundleName)) {
            assetManager.loadBundle(this.info.bundleName, this.__codeBundleLoaded.bind(this));
        } else {
            this.__codeBundleLoaded();
        }
    }

    /**
     * 代码包加载完成
     */
    private __codeBundleLoaded(): void {
        this.__uiURL = { url: this.info.packageName, type: "fgui", bundle: Drongo.UIBundle };
        this.__loadAssets();
    }

    //加载UI资源
    private __loadAssets(): void {
        Res.GetResRef(this.__uiURL, this.info.key, this.__loadAssetProgress.bind(this)).then(
            this.__loadAssetComplete.bind(this),
            this.__loadAssetError.bind(this)
        );
    }

    private __loadAssetProgress(progress: number): void {
        LoadingView.ChangeData({ label: this.info.key + " asset loading...", progress: progress })
    }

    private __loadAssetError(err: any): void {
        if (err) {
            LoadingView.ChangeData({ label: err });
        }
    }

    private __loadAssetComplete(result: ResRef): void {
        let resKey: string = URL2Key(this.__uiURL);
        if (resKey != result.key) {
            result.Dispose();
            return;
        }
        //资源是否存在
        this.__resRef = result;
        if (!this.__resRef) {
            throw new Error("加载UI资源失败:" + this.info.packageName + " ");
        }
        this.__createUIMediator();
    }



    /**创建Mediator */
    private __createUIMediator(): void {
        let viewCreatorCom: Component = GUIProxy.createNode.addComponent(this.info.key + "ViewCreator");
        let viewCreator: IViewCreator = <unknown>viewCreatorCom as IViewCreator;
        if (!viewCreator) {
            throw new Error(this.info.key + "ViewCreator类不存在或未实现IViewCreator!");
        }
        this.mediator = viewCreator.createMediator();
        //销毁组件
        viewCreatorCom.destroy();
        if (this.mediator.services) {
            this.__initServices();
        } else {
            this.__createUI();
        }
    }

    /**
    * 初始化服务
    */
    private __initServices(): void {
        ServiceManager.InitService(this.mediator.services,
            (err: Error, services?: Array<IService>) => {
                if (err) {
                    throw err;
                }
                for (let index = 0; index < services.length; index++) {
                    const service = services[index];
                    service.AddRef();
                }
                this.__createUI();
            });
    }

    /**
     * 创建UI
     */
    private __createUI(): void {
        this.mediator!.CreateUI(this.info, this.__createUICallBack.bind(this));
    }

    /**
     * UI创建完成回调
     */
    private __createUICallBack(): void {
        this.__loadState = LoadState.Loaded;
        this.mediator!.Init();
        this.mediator.inited = true;
        if (this.__showing) {
            this.__show();
        }
    }

    private __addToLayer(): void {
        this.layer.AddChildAt(this.mediator!.viewComponent, this.zIndex);
        this.mediator!.viewComponent!.visible = true;
    }

    Tick(dt: number): void {
        if (this.__loadState == LoadState.Loading) {
            let currentTime = Timer.currentTime;
            if (currentTime - this.__startTime > 1) {
                LoadingView.Show();
            }
            return;
        }
        if (this.__loadState == LoadState.Loaded) {
            if (this.mediator) {
                this.mediator.Tick(dt);
            }
        }
    }

    Show(data?: any): void {
        this.__showing = true;
        this.zIndex = this.getLayerChildCount();
        this.data = data;
        this.__show();
    }

    ShowedUpdate(data: any): void {
        if (this.mediator && this.__showing) {
            this.mediator.ShowedUpdate(data);
        }
    }

    private __show(): void {
        if (this.__loadState == LoadState.Null) {
            this.__loadCodeBundle();
        } else if (this.__loadState == LoadState.Loading) {
            //加载中啥也不干
        } else {
            this.__addToLayer();
            LoadingView.Hide();
            this.mediator!.Show(this.data);
            this.data = null;
            //如果界面已经被关闭(这是有可能的！);
            if (!GUIManager.IsOpen(this.info.key)) {
                return;
            }
            if (this.mediator.PlayShowAnimation) {
                this.mediator.PlayShowAnimation(this.__showAnimationPlayed);
            } else {
                Event.Emit(Event.SHOW, this.info!.key);
            }
        }
    }

    private __showAnimationPlayed(): void {
        Event.Emit(Event.SHOW, this.info!.key);
    }

    Hide(): void {
        if (this.__loadState == LoadState.Loading) {
            this.__loadState = LoadState.Null;
        } else if (this.__loadState == LoadState.Loaded) {
            //如果在显示中
            if (this.__showing) {
                if (this.mediator.PlayHideAnimation) {
                    this.mediator.PlayHideAnimation(this.__hideAnimationPlayed);
                } else {
                    this.__hide();
                }
            }
        }
    }

    private __hideAnimationPlayed(): void {
        if (this.__showing) {
            this.__hide();
        }
    }

    private __hide(): void {
        this.mediator!.viewComponent!.visible = false;
        this.mediator!.Hide();
        this.__showing = false;
        Event.Emit(Event.HIDE, this.info!.key);
    }

    Destroy(): void {
        console.log("UI销毁=>" + this.info?.key);
        this.mediator!.Destroy();
        this.mediator = undefined;
        this.info = undefined;
        this.data = null;
        if (this.__resRef) {
            this.__resRef.Dispose();
            this.__resRef = null;
        }
    }

    private getLayerChildCount(): number {
        return this.layer.GetCount();
    }

    private get layer(): ILayer {
        let l: ILayer | undefined = LayerManager.GetLayer(this.info!.layer);
        if (l === undefined) {
            throw new Error("layer：" + this.info!.layer + "不存在！");
        }
        return l;
    }

    /**
     * 获取组件
     * @param path 
     */
    getComponent(path: string): any {
        if (!this.mediator) {
            return null;
        }
        return this.mediator.GetUIComponent(path);
    }
}
