
import { Dictionary } from "../../containers/Dictionary";
import { DEvent } from "../../events/DEvent";
import { ITicker } from "../../ticker/ITicker";
import { TickerManager } from "../../ticker/TickerManager";
import { Res } from "../Res";
import { ILoader } from "../core/ILoader";
import { ResURL, URL2Key } from "../core/ResURL";
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
    private pool: Map<any, Array<ILoader>> = new Map<any, Array<ILoader>>();

    constructor() {
        TickerManager.AddTicker(this);
    }

    Tick(dt: number): void {
        while (this.running.size < Res.MAX_LOADER_THREAD && this.waiting.size > 0) {
            //获取需要加载的内容
            const url = this.waiting.elements[0];
            const urlKey = URL2Key(url);
            this.waiting.Delete(urlKey);
            this.__load(url, urlKey);
        }
    }

    private __load(url: ResURL, urlKey: string): void {
        let loader: ILoader;
        let loaderClass: new () => ILoader;
        let type: any;
        if (typeof url == "string") {
            type = "string";
        } else {
            type = url.type;
        }
        let list = this.pool.get(type);
        if (list == null) {
            list = [];
            this.pool.set(type, list);
        }
        if (list.length > 0) {
            loader = list.shift();
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
            this.__addEvent(loader);
            loader.Load(url);
        }
    }

    private __addEvent(target: ILoader): void {
        target.On(DEvent.COMPLETE, this.__eventHandler, this);
        target.On(DEvent.ERROR, this.__eventHandler, this);
        target.On(DEvent.PROGRESS, this.__eventHandler, this);
    }

    private __eventHandler(evt: DEvent): void {
        let target: ILoader = evt.target as ILoader;
        if (evt.type == DEvent.PROGRESS) {
            Loader.single.ChildProgress(evt.data, evt.progress);
            return;
        }
        //删除所有事件监听
        target.OffAllEvent();
        //从运行列表中删除
        this.running.Delete(URL2Key(evt.data));
        if (evt.type == DEvent.ERROR) {
            Loader.single.ChildError(evt.data, evt.error);
            return;
        }
        if (evt.type == DEvent.COMPLETE) {
            Loader.single.ChildComplete(evt.data);
            //重置并回收
            target.Reset();
            let type: any;
            if (typeof evt.data == "string") {
                type = "string";
            } else {
                type = evt.data.type;
            }
            let list = this.pool.get(type);
            if (list == null) {
                list = [];
                this.pool.set(type, list);
            }
            list.push(target);
        }
    }

    Load(url: ResURL): void {
        const urlKey = URL2Key(url);
        if (typeof url != "string" && url.isChild) {
            if (this.waiting.Has(urlKey)) {
                this.waiting.Delete(urlKey);
            }
            if (!this.running.Has(urlKey)) {
                this.__load(url, urlKey);
            }
            return;
        }
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