import { ResManager } from "./ResManager";


export class ResRef {

    /**唯一KEY */
    key: string = "";
    /**引用KEY */
    refKey: string | undefined;
    /**资源内容 */
    content: any;
    /**是否已释放 */
    private __isDispose: boolean = false;
    
    constructor() {

    }

    /**释放 */
    Dispose(): void {
        if (this.__isDispose) {
            throw new Error("重复释放资源引用");
        }
        this.__isDispose = true;
        ResManager.RemoveResRef(this);
    }

    get isDispose(): boolean {
        return this.__isDispose;
    }

    Reset(): void {
        this.key = "";
        this.refKey = undefined;
        this.content = null;
        this.__isDispose = false;
    }

    /**
     * 彻底销毁(注意内部接口，请勿调用)
     */
    Destroy(): void {
        this.key = "";
        this.refKey = undefined;
        this.content = null;
    }
}