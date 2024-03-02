
import { ResURL, URL2Key } from "../core/ResURL";
import { ResManager } from "../res/ResManager";
import { Loader } from "./Loader";
import { LoaderQueue } from "./LoaderQueue";



export class ResRequest {

    /**
     * 资源地址
     */
    urls: Array<ResURL>;

    /**
     * 完成回调
     */
    cb?: (err: Error) => void;

    /**
     * 进度处理器
     */
    progress?: (progress: number) => void;

    private __loadedMap: Map<string, number> = new Map<string, number>();

    constructor(url: ResURL | Array<ResURL>, cb?: (err: Error) => void, progress?: (progress: number) => void) {
        if (Array.isArray(url)) {
            this.urls = url;
        } else {
            this.urls = [url];
        }
        this.cb = cb;
        this.progress = progress;
    }

    Load(): void {
        this.__loadedMap.clear();
        for (let index = 0; index < this.urls.length; index++) {
            const url = this.urls[index];
            const urlKey = URL2Key(url);
            //如果已经加载完成
            if (ResManager.HasRes(urlKey)) {
                Loader.single.ChildComplete(url);
            } else {
                LoaderQueue.single.Load(url);
            }
        }
    }

    ChildComplete(resURL: ResURL): void {
        const urlKey = URL2Key(resURL);
        this.__loadedMap.set(urlKey, 1);
        this.checkComplete();
    }

    ChildProgress(resURL: ResURL, progress: number): void {
        const urlKey = URL2Key(resURL);
        this.__loadedMap.set(urlKey, progress);
        this.UpdateProgress();
    }

    ChildError(err: Error): void {
        if (this.cb) {
            this.cb(err);
        }
    }

    UpdateProgress(): void {
        let loaded: number = this.getLoaded();
        let progress: number = loaded / this.urls.length;
        if (this.progress) {
            this.progress(progress);
        }
    }

    private checkComplete(): void {
        let loaded: number = this.getLoaded();
        let progress: number = loaded / this.urls.length;
        if (this.progress) {
            this.progress(progress);
        }
        //完成
        if (progress == 1 && this.cb != null) {
            this.cb(null);
            this.Destroy();
        }
    }

    private getLoaded(): number {
        let loaded: number = 0;
        for (let value of this.__loadedMap.values()) {
            loaded += value;
        }
        return loaded;
    }

    Destroy(): void {
        this.urls = null;
        this.cb = null;
        this.progress = null;
    }
}