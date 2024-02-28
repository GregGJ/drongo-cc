import { SpriteFrame, Texture2D } from "cc";
import { Debuger, GLoader, Res, ResRef, ResURL, URL2Key } from "../../../drongo-cc";



export class CCFLoader extends GLoader {

    refKey: string = "CCFLoader";

    private __resRef: ResRef;

    constructor() {
        super();
    }

    protected loadExternal(): void {
        if (typeof this.url == "string") {
            super.loadExternal();
            return;
        }
        if (this.__resRef != null) {
            this.__resRef.Dispose();
            this.__resRef = null;
        }
        Res.GetResRef(this.url, this.refKey).then((value) => {
            const old = URL2Key(this.url);
            if (value.key != old) {
                value.Dispose();
                return;
            }
            this.__resRef = value;
            if (this.__resRef.content instanceof Texture2D) {
                let t: SpriteFrame = new SpriteFrame();
                t.texture = this.__resRef.content;
                this.onExternalLoadSuccess(t);
            } else {
                this.onExternalLoadSuccess(this.__resRef.content);
            }
        }, (err) => {
            Debuger.Err(Debuger.DRONGO, "图片加载出错：" + err);
        });
    }


    protected freeExternal(): void {
        super.freeExternal();
        if (this.__resRef) {
            //因为是自己new 的所以这样释放，内部纹理还是归资源系统管理
            if (this.__resRef.content instanceof Texture2D) {
                this.texture.destroy();
            }
            this.__resRef.Dispose();
            this.__resRef = null;
        }
    }
}