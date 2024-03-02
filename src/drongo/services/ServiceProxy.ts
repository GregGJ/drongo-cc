import { ResRef } from "../../drongo-cc";
import { IService } from "./IService";



export class ServiceProxy {

    service: IService;

    refs: Array<ResRef>;

    /**
     * 引用计数器
     */
    refCount: number = 0;

    constructor(service: IService, refs: Array<ResRef>) {
        this.service = service;
        this.refs = refs;
        this.refCount = 0;
    }

    AddRef(): void {
        this.refCount++;
    }

    RemoveRef(): void {
        this.refCount--;
    }

    Destroy(): void {
        this.service.Destroy();
        this.service = null;
        for (let index = 0; index < this.refs.length; index++) {
            const ref = this.refs[index];
            ref.Dispose();
        }
        this.refs.length = 0;
        this.refs = null;
    }
}