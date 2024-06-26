import { assetManager, Component, Node } from "cc";
import { Drongo } from "../../../drongo";
import { ConfigManager } from "../../configs/ConfigManager";
import { DEvent } from "../../events/DEvent";
import { ResRef } from "../../res/core/ResRef";
import { ResURL } from "../../res/core/ResURL";
import { Res } from "../../res/Res";
import { ServiceManager } from "../../services/ServiceManager";
import { IGUIMediator } from "../core/IGUIMediator";
import { IViewCreator } from "../core/IViewCreator";
import { ILayer } from "../core/layer/ILayer";
import { LayerManager } from "../core/layer/LayerManager";
import { LoadingView } from "../core/loadingView/LoadingView";
import { GUIManager } from "../GUIManager";
import { IGUIInfo } from "./IGUIInfo";
import { EventDispatcher } from "../../events/EventDispatcher";
import { GComponent } from "../../../drongo-cc";



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

    /**数据 */
    data: any;

    /**引用的资源 */
    urls: Array<ResURL>;
    assets: Array<ResRef>;

    /**是否在显示中*/
    private __showing: boolean = false;

    /**加载状态 */
    private __loadState: LoadState = LoadState.Null;

    constructor(info: IGUIInfo) {
        this.info = info;
        if (!this.info) {
            throw new Error("UI信息不能为空！");
        }
        this.urls = [];
    }

    /**
     * 加载代码包
     */
    private __loadCodeBundle(): void {
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
        this.urls.push({ url: this.info.packageName, type: "fgui", bundle: Drongo.UIBundle });
        //创建Mediator
        let viewCreatorCom: Component = GUIProxy.createNode.addComponent(this.info.key + "ViewCreator");
        let viewCreator: IViewCreator = <unknown>viewCreatorCom as IViewCreator;
        if (!viewCreator) {
            throw new Error(this.info.key + "ViewCreator类不存在或未实现IViewCreator!");
        }
        this.mediator = viewCreator.createMediator();
        //进度界面
        if (this.mediator.showLoadingView) {
            LoadingView.Show();
        }
        //销毁组件
        viewCreatorCom.destroy();
        //配置表
        if (this.mediator.configs && this.mediator.configs.length > 0) {
            for (let index = 0; index < this.mediator.configs.length; index++) {
                const sheet = this.mediator.configs[index];
                const url = ConfigManager.Sheet2URL(sheet);
                this.urls.push(url);
            }
        }
        //依赖的资源
        if (this.mediator.assets && this.mediator.assets.length > 0) {
            for (let index = 0; index < this.mediator.assets.length; index++) {
                const url = this.mediator.assets[index];
                this.urls.push(url);
            }
        }
        this.__loadAssets();
    }

    //加载UI资源
    private __loadAssets(): void {
        Res.GetResRefList(this.urls, this.info.key,
            (p_progress: number) => {
                let progress: number = 0;
                if (this.mediator.services && this.mediator.services.length > 0) {
                    progress = p_progress * 0.5 * this.mediator.loadingViewTotalRatio;
                } else {
                    progress = p_progress * 0.9 * this.mediator.loadingViewTotalRatio;
                }
                LoadingView.ChangeData({ label: this.info.key + " Res Loading...", progress: progress })
            }).then(
                (result: Array<ResRef>) => {
                    this.assets = result;
                    this.__initServices();
                }, (err) => {
                    LoadingView.ChangeData({ label: this.info.key + " Res Load Err:" + err });
                });
    }

    /**
    * 初始化服务
    */
    private __initServices(): void {
        if (this.mediator.services == null) {
            this.__createUI();
            return;
        }
        ServiceManager.Load(this.mediator.services,
            (p_progress: number) => {
                let progress: number = 0;
                if (this.mediator.configs && this.mediator.configs.length > 0) {
                    progress = 0.5 + p_progress * 0.4 * this.mediator.loadingViewTotalRatio;
                } else {
                    progress = p_progress * 0.9 * this.mediator.loadingViewTotalRatio;
                }
                LoadingView.ChangeData({ label: this.info.key + " Services Init...", progress: 0.5 + progress * 0.4 });
            }, (err: Error) => {
                if (err) {
                    throw err;
                }
                for (let index = 0; index < this.mediator.services.length; index++) {
                    const service = this.mediator.services[index];
                    const proxy = ServiceManager.GetServiceProxy(service);
                    proxy.AddRef();
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
        LoadingView.ChangeData({ progress: this.mediator.loadingViewTotalRatio });
        this.__loadState = LoadState.Loaded;
        this.mediator!.Init();
        this.mediator.inited = true;
        if (this.__showing) {
            this.__show();
        }
    }

    private __addToLayer(): void {
        this.layer.AddChildAt(this.mediator!.viewComponent, this.getLayerChildCount());
        this.mediator!.viewComponent!.visible = true;
    }

    Tick(dt: number): void {
        if (this.__loadState == LoadState.Loaded) {
            if (this.mediator) {
                this.mediator.Tick(dt);
            }
        }
    }

    Show(data?: any): void {
        this.__showing = true;
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
            //进度界面
            if (this.mediator!.showLoadingView && this.mediator!.closeLoadingView) {
                LoadingView.Hide();
            }
            this.mediator!.Show(this.data);
            this.data = null;
            //如果界面已经被关闭(这是有可能的！);
            if (!GUIManager.IsOpen(this.info.key)) {
                return;
            }
            if (this.mediator.PlayShowAnimation) {
                this.mediator.PlayShowAnimation(this.__showAnimationPlayed.bind(this));
            } else {
                EventDispatcher.Global.Emit(DEvent.SHOW, this.info!.key);
            }
        }
    }

    private __showAnimationPlayed(): void {
        EventDispatcher.Global.Emit(DEvent.SHOW, this.info!.key);
    }

    Hide(): void {
        if (this.__loadState == LoadState.Loading) {
            this.__loadState = LoadState.Null;
        } else if (this.__loadState == LoadState.Loaded) {
            //如果在显示中
            if (this.__showing) {
                if (this.mediator.PlayHideAnimation) {
                    this.mediator.PlayHideAnimation(this.__hideAnimationPlayed.bind(this));
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
        EventDispatcher.Global.Emit(DEvent.HIDE, this.info!.key);
    }

    Destroy(): void {
        console.log("UI销毁=>" + this.info?.key);
        for (let index = 0; index < this.assets.length; index++) {
            const ref = this.assets[index];
            ref.Dispose();
        }
        this.assets.length = 0;
        this.assets = null;
        this.mediator!.Destroy();
        this.mediator = undefined;
        this.info = undefined;
        this.data = null;
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
