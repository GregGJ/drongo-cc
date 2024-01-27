import { Dictionary } from "../containers/Dictionary";
import { Event } from "../events/Event";
import { Res } from "../res/Res";
import { ResURL, URL2Key } from "../res/ResURL";
import { ILoader } from "../res/ILoader";
import { ITicker } from "../ticker/ITicker";
import { TickerManager } from "../ticker/TickerManager";
import { Loader } from "./Loader";



export class LoaderQueue implements ITicker {

    /**
     * 加载中
     */
    private running: Dictionary<string, ILoader> = new Dictionary<string, ILoader>();

    /**
     * 等待加载
     */
    private waiting: Dictionary<string, ResURL> = new Dictionary<string, ResURL>();

    /**
     * 对象池
     */
    private pool: Array<ILoader> = new Array<ILoader>();


    constructor() {
        TickerManager.AddTicker(this);
    }

    Tick(dt: number): void {
        while (this.running.size < Res.MAX_LOADER_THREAD && this.waiting.size > 0) {
            //获取需要加载的内容
            const url = this.waiting.elements[0];
            const urlKey = URL2Key(url);
            this.waiting.Delete(urlKey);

            let loader: ILoader;
            let loaderClass: new () => ILoader;
            if (this.pool.length > 0) {
                loader = this.pool.shift();
            } else {
                if (typeof url == "string") {
                    loaderClass = Res.GetResLoader("string");
                } else {
                    loaderClass = Res.GetResLoader(url.type);
                }
                loader = new loaderClass();
            }
            if (loader != null) {
                this.running.Set(urlKey, loader);
                loader.Load(url);
                this.__addEvent(loader);
            }
        }
    }

    private __addEvent(target: ILoader): void {
        target.On(Event.COMPLETE, this.__eventHandler, this);
        target.On(Event.ERROR, this.__eventHandler, this);
        target.On(Event.PROGRESS, this.__eventHandler, this);
    }

    private __eventHandler(type: string, target: ILoader, url: ResURL, data: any): void {
        if (type == Event.PROGRESS) {
            Loader.single.ChildProgress(url, data);
            return;
        }
        target.OffAllEvent();
        if (type == Event.ERROR) {
            Loader.single.ChildError(url, data);
            return;
        }
        if (type == Event.COMPLETE) {
            Loader.single.ChildComplete(url);
            //重置并回收
            target.Reset();
            this.pool.push(target);
        }
    }

    Load(url: ResURL): void {
        const urlKey = URL2Key(url);
        //已经在等待列表中
        if (this.waiting.Has(urlKey)) {
            return;
        }
        //加载中
        if (this.running.Has(urlKey)) {
            return;
        }
        //加入等待列表
        this.waiting.Set(urlKey, url);
    }

    private static __instance: LoaderQueue;
    static get single(): LoaderQueue {
        if (this.__instance == null) {
            this.__instance = new LoaderQueue();
        }
        return this.__instance;
    }
}