import { assetManager } from "cc";
import { ResourceImpl } from "./ResourceImpl";
import { Key2URL } from "../core/ResURL";
import { UIPackage } from "../../../fairygui/UIPackage";
import { Drongo } from "../../../drongo";


export class FGUIResource extends ResourceImpl {

    constructor() {
        super();
    }

    /**
     * 销毁
     */
    Destroy(): void {
        let url = Key2URL(this.key);
        if (typeof url != "string") {
            UIPackage.removePackage(url.url);
            let bundle = assetManager.getBundle(Drongo.UIBundle);
            let asset = bundle.get(url.url);
            assetManager.releaseAsset(asset);
            console.log("销毁:FGUIPacage=>" + url.bundle + " " + url.url);
        } else {
            throw new Error("未处理的Fguipackage销毁！");
        }
        super.Destroy();
    }
}