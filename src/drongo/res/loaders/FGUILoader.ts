import { AssetManager, assetManager } from "cc";
import { ILoader } from "../core/ILoader";
import { EventDispatcher } from "../../events/EventDispatcher";
import { ResURL, URL2Key } from "../core/ResURL";
import { DEvent } from "../../events/DEvent";
import { UIPackage } from "../../../fairygui/UIPackage";
import { ResManager } from "../res/ResManager";
import { FGUIResource } from "../res/FGUIResource";


export class FGUILoader extends EventDispatcher implements ILoader {

    url: ResURL;

    constructor() {
        super();
    }

    Load(url: ResURL): void {
        this.url = url;
        if (typeof url == "string") {
            throw new Error("未实现：" + url);
        } else {
            let bundle = assetManager.getBundle(url.bundle);
            let __this = this;
            if (!bundle) {
                assetManager.loadBundle(url.bundle, (err: Error, bundle: AssetManager.Bundle) => {
                    if (err) {
                        __this.Emit(DEvent.ERROR, { url, err });
                        return;
                    }
                    __this.loadUIPackge(url, bundle);
                });
            } else {
                __this.loadUIPackge(url, bundle);
            }
        }
    }

    private loadUIPackge(url: ResURL, bundle: AssetManager.Bundle): void {
        if (typeof url == "string") {
            throw new Error("未实现：" + url);
        }
        let __this = this;
        UIPackage.loadPackage(bundle, url.url,
            (finish: number, total: number, item: AssetManager.RequestItem) => {
                const progress: number = finish / total;
                __this.Emit(DEvent.PROGRESS, { url, progress });
            },
            (err: Error, pkg: UIPackage) => {
                if (err) {
                    __this.Emit(DEvent.ERROR, { url, err });
                    return;
                }
                const urlKey = URL2Key(url);
                let res = new FGUIResource();
                res.key = urlKey;
                res.content = pkg;
                ResManager.AddRes(res);
                __this.Emit(DEvent.COMPLETE, { url });
            });
    }

    Reset(): void {
        this.url = null;
    }
}