import { SpriteFrame, Texture2D } from "cc";
import { Debuger, GLoader, Res, ResRef, ResURL, URL2Key } from "../../../drongo-cc";



export class CCFLoader extends GLoader {

    refKey: string = "CCFLoader";

    private __spriteFrame: SpriteFrame;
    private __resRef: ResRef;

    constructor() {
        super();
    }

    protected loadExternal(): void {
        if (typeof this.url == "string") {
            super.loadExternal();
            return;
        }
        if (this.__spriteFrame) {
            this.__spriteFrame.destroy();
            this.__spriteFrame = null;
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
                this.__spriteFrame = new SpriteFrame();
                this.__spriteFrame.texture = this.__resRef.content;
                this.onExternalLoadSuccess(this.__spriteFrame);
            } else {
                this.onExternalLoadSuccess(this.__resRef.content);
            }
        }, (err) => {
            Debuger.Err(Debuger.DRONGO, "图片加载出错：" + err);
        });
    }

    protected freeExternal(texture: SpriteFrame): void {
        if (this.__spriteFrame) {
            this.__spriteFrame.destroy();
            this.__spriteFrame = null;
        }
        if (this.__resRef) {
            this.__resRef.Dispose();
            this.__resRef = null;
        }
    }
}