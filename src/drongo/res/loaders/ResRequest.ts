
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

    private __loaded: Map<string, boolean> = new Map<string, boolean>();
    private __loadProgress: Map<string, number> = new Map<string, number>();
    constructor() {

    }

    /**
     * 初始化
     * @param url 
     * @param cb 
     * @param progress 
     */
    Init(url: ResURL | Array<ResURL>, cb?: (err: Error) => void, progress?: (progress: number) => void): void {
        if (Array.isArray(url)) {
            this.urls = url;
        } else {
            this.urls = [url];
        }
        this.cb = cb;
        this.progress = progress;
    }

    Load(): boolean {
        let loading: boolean = false;
        for (let index = 0; index < this.urls.length; index++) {
            const url = this.urls[index];
            const urlKey = URL2Key(url);
            //如果已经加载完成
            if (ResManager.HasRes(urlKey)) {
                //标记已加载
                this.__loadProgress.set(urlKey, 1);
                this.__loaded.set(urlKey, true);
            } else {
                loading = true;
                LoaderQueue.single.Load(url);
            }
        }
        if (!loading) {
            this.checkComplete();
        }
        return loading;
    }

    ChildComplete(resURL: ResURL): void {
        const urlKey = URL2Key(resURL);
        this.__loaded.set(urlKey, true);
        this.checkComplete();
    }

    ChildProgress(resURL: ResURL, progress: number): void {
        const urlKey = URL2Key(resURL);
        this.__loadProgress.set(urlKey, progress);
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
        let loaded: number = this.__loaded.size;
        let progress: number = loaded / this.urls.length;
        //完成
        if (progress >= 1 && this.cb != null) {
            this.cb(null);
            Loader.single.BackToPool(this);
        }
    }

    private getLoaded(): number {
        let loaded: number = 0;
        for (let value of this.__loadProgress.values()) {
            loaded += value;
        }
        return loaded;
    }

    Reset(): void {
        this.__loaded.clear();
        this.__loadProgress.clear();
        this.urls = null;
        this.cb = null;
        this.progress = null;
    }
}