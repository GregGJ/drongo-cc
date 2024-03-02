import { IService } from "./IService";
import { ServiceManager } from "./ServiceManager";
import { ServiceQueue } from "./ServiceQueue";



export class ServiceRequest {

    services: Array<new () => IService>;

    private __progress: (progress: number) => void;
    private __callback: (err: Error) => void;


    private __loadedMap: Map<new () => IService, number>;

    constructor(services: Array<{ new(): IService }>, progress: (progress: number) => void, callback: (err: Error) => void) {
        this.__loadedMap = new Map<new () => IService, number>();
        this.services = services;
        this.__progress = progress;
        this.__callback = callback;
    }

    Load(): void {
        this.__loadedMap.clear();
        for (let index = 0; index < this.services.length; index++) {
            const serviceClass = this.services[index];
            const service = ServiceManager.GetService(serviceClass);
            if (service) {
                this.__loadedMap.set(serviceClass, 1);
            } else {
                ServiceQueue.single.Load(serviceClass);
            }
        }
    }

    ChildComplete(service: new () => IService): void {
        this.__loadedMap.set(service, 1);
        this.__checkComplete();
    }

    ChildError(service: new () => IService, err: Error): void {
        if (this.__callback) {
            this.__callback(err);
        }
    }

    ChildProgress(service: new () => IService, progress: number): void {
        this.__loadedMap.set(service, progress);
        let totalProgress: number = this.loaded / this.services.length;
        if (this.__progress) {
            this.__progress(totalProgress);
        }
    }

    private __checkComplete(): void {
        let progress: number = this.loaded / this.services.length;
        if (this.__progress) {
            this.__progress(progress);
        }
        //完成
        if (progress == 1 && this.__callback != null) {
            this.__callback(null);
            this.Destroy();
        }
    }

    private get loaded(): number {
        let loaded: number = 0;
        for (let value of this.__loadedMap.values()) {
            loaded += value;
        }
        return loaded;
    }

    Destroy(): void {
        this.services = null;
        this.__progress = null;
        this.__callback = null;
    }
}