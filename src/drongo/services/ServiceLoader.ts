import { ConfigManager, Event, Res, ResRef, ResURL, StringUtils } from "../../drongo-cc";
import { EventDispatcher } from "../events/EventDispatcher";
import { IService } from "./IService";
import { ServiceProxy } from "./ServiceProxy";



export class ServiceLoader extends EventDispatcher {

    serviceClass: new () => IService;

    service: IService;

    refs: Array<ResRef>;

    Load(serviceClass: new () => IService): void {
        this.serviceClass = serviceClass;
        this.service = new this.serviceClass();
        this.service.name = StringUtils.GetClassName(this.serviceClass);

        //配置表
        let urls: Array<ResURL> = [];
        if (this.service.configs != undefined && this.service.configs.length > 0) {
            for (let index = 0; index < this.service.configs.length; index++) {
                const sheet = this.service.configs[index];
                const url = ConfigManager.Sheet2URL(sheet);
                urls.push(url);
            }
        }
        //其他资源
        if (this.service.assets != undefined && this.service.assets.length > 0) {
            for (let index = 0; index < this.service.assets.length; index++) {
                const url = this.service.assets[index];
                urls.push(url);
            }
        }
        if (urls.length == 0) {
            this.__assetReady();
            return;
        }
        //加载
        Res.GetResRefList(urls, this.service.name,
            (progress: number) => {
                this.Emit(Event.PROGRESS, { service: this.serviceClass, progress });
            }).then(
                (value) => {
                    this.refs = value;
                    this.__assetReady();
                }, (reason) => {
                    this.Emit(Event.ERROR, { service: this.serviceClass, err: new Error(this.service.name + "依赖资源加载出错:" + reason) })
                }
            );
    }

    /**
     * 依赖的配置与资源准备完毕
     */
    protected __assetReady(): void {
        this.service.Init();
        let proxy = new ServiceProxy(this.service, this.refs);
        this.Emit(Event.COMPLETE, { service: this.serviceClass, proxy });
    }

    Reset(): void {
        this.serviceClass = null;
        this.service = null;
        this.refs = null;
    }
}