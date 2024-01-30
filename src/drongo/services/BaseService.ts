import { ConfigManager } from "../configs/ConfigManager";
import { Res } from "../res/Res";
import { ResRef } from "../res/core/ResRef";
import { ResURL } from "../res/core/ResURL";
import { IService } from "./IService";

/**
 *  服务基类
 *  1.  如果有依赖的资源请在子类构造函数中给this.$configs和this.$assets进行赋值
 *  2.  重写$configAndAssetReady函数，并在完成初始化后调用this.initComplete()
 */
export class BaseService implements IService {

    /**名称 */
    name: string;
    /**
     * 依赖的配置表名称
     */
    protected $configs: Array<string>;
    protected $configRefs: Array<ResRef>;
    /**
     * 依赖的资源
     */
    protected $assets: Array<ResURL>;
    protected $assetRefs: Array<ResRef>;

    protected __initCallback: (err: Error, result: IService) => void;

    constructor() {

    }

    Init(callback: (err: Error, result: IService) => void): void {
        this.__initCallback = callback;
        if (this.$configs == null || this.$configs.length <= 0) {
            this.__configLoaded();
        } else {
            this.__loadConfigs();
        }
    }

    private __loadConfigs(): void {
        let urls: Array<ResURL> = [];
        for (let index = 0; index < this.$configs.length; index++) {
            const sheet = this.$configs[index];
            const url = ConfigManager.Sheet2URL(sheet);
            urls.push(url);
        }
        Res.GetResRefList(urls, this.name).then(
            (value) => {
                this.$configRefs = value;
                this.__configLoaded();
            }, (reason) => {
                throw new Error(this.name + "依赖的配置加载出错:" + reason);
            }
        )
    }

    private __configLoaded(): void {
        if (this.$assets == null || this.$assets.length <= 0) {
            this.$configAndAssetReady();
        } else {
            this.__loadAssets();
        }
    }

    private __loadAssets(): void {
        Res.GetResRefList(this.$assets, this.name).then(
            (value) => {
                this.$assetRefs = value;
                this.$configAndAssetReady();
            }, (reason) => {
                throw new Error(this.name + "依赖资源加载出错:" + reason);
            }
        );
    }

    /**
     * 依赖的配置与资源准备完毕
     */
    protected $configAndAssetReady(): void {

    }

    /**
     * 初始化完成时调用
     */
    protected $initComplete(): void {
        if (this.__initCallback) {
            this.__initCallback(null, this);
            this.__initCallback = null;
        }
    }

    Destroy(): void {
        this.name = undefined;
        this.__initCallback = null;
        this.$configs = null;
        this.$assets.length = 0;
        this.$assets = null;

        //配置资源引用
        for (let index = 0; index < this.$configRefs.length; index++) {
            const element = this.$configRefs[index];
            element.Dispose();
        }
        this.$configRefs = null;
        
        //将引用的资源释放
        for (let index = 0; index < this.$assetRefs.length; index++) {
            const element = this.$assetRefs[index];
            element.Dispose();
        }
        this.$assetRefs = null;
    }
}