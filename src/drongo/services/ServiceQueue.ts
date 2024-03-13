import { Dictionary } from "../containers/Dictionary";
import { DEvent } from "../events/DEvent";
import { ITicker } from "../ticker/ITicker";
import { TickerManager } from "../ticker/TickerManager";
import { IService } from "./IService";
import { ServiceLoader } from "./ServiceLoader";
import { ServiceManager } from "./ServiceManager";



export class ServiceQueue implements ITicker {

    private running: Dictionary<new () => IService, ServiceLoader> = new Dictionary<new () => IService, ServiceLoader>();

    private waiting: Array<new () => IService> = [];

    private pool: Array<ServiceLoader> = [];

    constructor() {
        TickerManager.AddTicker(this);
    }


    Load(service: new () => IService): void {
        //已经在等待列表中
        if (this.waiting.indexOf(service) >= 0) {
            return;
        }
        if (this.running.Has(service)) {
            return;
        }
        this.waiting.push(service);
    }

    Tick(dt: number): void {
        while (this.running.size < ServiceManager.MAX_LOADER_THREAD && this.waiting.length > 0) {
            const service = this.waiting.shift();
            let loader: ServiceLoader;
            if (this.pool.length > 0) {
                loader = this.pool.shift();
            } else {
                loader = new ServiceLoader();
            }
            this.running.Set(service, loader);
            this.__addEvent(loader);
            loader.Load(service);
        }
    }

    private __addEvent(target: ServiceLoader): void {
        target.On(DEvent.COMPLETE, this.__eventHandler, this);
        target.On(DEvent.ERROR, this.__eventHandler, this);
        target.On(DEvent.PROGRESS, this.__eventHandler, this);
    }

    private __eventHandler(evt: DEvent): void {
        let target: ServiceLoader = evt.target as ServiceLoader;
        if (evt.type == DEvent.PROGRESS) {
            ServiceManager.ChildProgress(evt.data.service, evt.progress);
            return;
        }
        target.OffAllEvent();
        if (evt.type == DEvent.ERROR) {
            this.running.Delete(evt.data);
            ServiceManager.ChildError(evt.data.service, evt.error);
            return;
        }
        if (evt.type == DEvent.COMPLETE) {
            this.running.Delete(evt.data.service);
            ServiceManager.ChildComplete(evt.data.service, evt.data.proxy);
            target.Reset();
            this.pool.push(target);
        }
    }

    private static instance: ServiceQueue;
    static get single(): ServiceQueue {
        if (this.instance == null) {
            this.instance = new ServiceQueue();
        }
        return this.instance;
    }
}