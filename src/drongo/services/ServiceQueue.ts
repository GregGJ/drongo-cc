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

    private __eventHandler(type: string, target: ServiceLoader, data: any): void {
        if (type == DEvent.PROGRESS) {
            ServiceManager.ChildProgress(data.service, data.progress);
            return;
        }
        target.OffAllEvent();
        this.running.Delete(data.service);
        if (type == DEvent.ERROR) {
            ServiceManager.ChildError(data.service, data.err);
            return;
        }
        if (type == DEvent.COMPLETE) {
            ServiceManager.ChildComplete(data.service, data.proxy);
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