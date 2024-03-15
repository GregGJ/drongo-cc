import { Asset, AssetManager, assetManager } from "cc";
import { EventDispatcher } from "../../events/EventDispatcher";
import { ILoader } from "../core/ILoader";
import { FullURL, ResURL, URL2Key } from "../core/ResURL";
import { DEvent } from "../../events/DEvent";
import { Resource } from "../res/Resource";
import { ResManager } from "../res/ResManager";


/**
 * 加载器CC实现
 */
export class CCLoaderImpl extends EventDispatcher implements ILoader {

    url: ResURL;

    constructor() {
        super();
    }

    Load(url: ResURL): void {
        this.url = url;
        if (typeof url == "string") {
            throw new Error("未实现！");
        }
        let bundle = assetManager.getBundle(url.bundle);
        if (!bundle) {
            let __this = this;
            assetManager.loadBundle(url.bundle, (err: Error, bundle: AssetManager.Bundle) => {
                if (err) {
                    this.Emit(DEvent.ERROR, url, err);
                    return;
                }
                this.__load(url, bundle);
            });
        } else {
            this.__load(url, bundle);
        }
    }

    private __load(url: ResURL, bundle: AssetManager.Bundle): void {
        if (typeof url == "string") {
            throw new Error("未实现！");
        }
        let __this = this;
        bundle.load(FullURL(url), url.type,
            (finished: number, total: number) => {
                const progress = finished / total;
                __this.Emit(DEvent.PROGRESS, url, undefined, progress);
            }, (err: Error, asset: Asset) => {
                if (err) {
                    __this.Emit(DEvent.ERROR, url, err);
                    return;
                }
                const urlKey = URL2Key(url);
                let res: Resource = new Resource();
                res.key = urlKey;
                res.content = asset;
                ResManager.AddRes(res);
                __this.Emit(DEvent.COMPLETE, url);
            });
    }


    Reset(): void {
        this.url = null;
    }
}