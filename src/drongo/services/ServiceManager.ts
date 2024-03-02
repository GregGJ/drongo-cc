

import { Debuger } from "../debugers/Debuger";
import { IService } from "./IService";
import { ServiceProxy } from "./ServiceProxy";
import { ServiceRequest } from "./ServiceRequest";


export class ServiceManager {

    /**
     * 最大启动线程
     */
    static MAX_LOADER_THREAD: number = 5;

    private static __requests: Map<new () => IService, Array<ServiceRequest>> = new Map<new () => IService, Array<ServiceRequest>>();

    /**
     * 加载
     * @param services 
     * @param progress 
     * @param callback 
     */
    static Load(services: Array<{ new(): IService }>, progress: (progress: number) => void, callback: (err: Error) => void): void {
        let request: ServiceRequest = new ServiceRequest(services, progress, callback);
        this.__addRequest(request);
        request.Load();
    }

    static ChildComplete(service: new () => IService, proxy: ServiceProxy): void {
        //保存
        this.__services.set(service, proxy);
        //通知
        let list = this.__requests.get(service);
        for (let index = 0; index < list.length; index++) {
            const request = list[index];
            request.ChildComplete(service);
        }
        list.length = 0;
        this.__requests.delete(service);
    }

    static ChildError(service: new () => IService, err: Error): void {
        let list = this.__requests.get(service);
        for (let index = 0; index < list.length; index++) {
            const request = list[index];
            request.ChildError(service, err);
        }
        //复制
        let clist = list.concat();
        //清除掉关联的所有资源请求
        for (let index = 0; index < clist.length; index++) {
            const request = clist[index];
            this.__removeRequest(request);
            //销毁
            request.Destroy();
        }
    }

    static ChildProgress(service: new () => IService, progress: number): void {
        let list = this.__requests.get(service);
        for (let index = 0; index < list.length; index++) {
            const request = list[index];
            request.ChildProgress(service, progress);
        }
    }

    private static __addRequest(request: ServiceRequest): void {
        let list: Array<ServiceRequest>;
        for (let index = 0; index < request.services.length; index++) {
            const service = request.services[index];
            if (!this.__requests.has(service)) {
                list = [];
                this.__requests.set(service, list);
            } else {
                list = this.__requests.get(service);
            }
            list.push(request);
        }
    }

    private static __removeRequest(request: ServiceRequest): void {
        let list: Array<ServiceRequest>;
        let findex: number = 0;
        //遍历当前请求的所有服务
        for (let index = 0; index < request.services.length; index++) {
            const service = request.services[index];
            //从列表中找出并删除
            list = this.__requests.get(service);
            findex = list.indexOf(request);
            if (findex >= 0) {
                list.splice(findex, 1);
            }
        }
    }

    private static __services: Map<new () => IService, ServiceProxy> = new Map<new () => IService, ServiceProxy>();

    /**
     * 获取代理
     * @param clazz 
     * @returns 
     */
    static GetServiceProxy(clazz: new () => IService): ServiceProxy {
        if (!this.__services.has(clazz)) {
            return null;
        }
        return this.__services.get(clazz);
    }

    /**
     * 获取服务
     * @param clazz 
     */
    static GetService(clazz: { new(): IService }): IService {
        let proxy = this.GetServiceProxy(clazz);
        if (proxy == null) {
            return null;
        }
        return proxy.service;
    }

    /**
     * 尝试销毁服务
     * @param clazz
     */
    static Dispose(clazz: { new(): IService }): void {
        let proxy = this.__services.get(clazz);
        proxy.RemoveRef();
        if (proxy.refCount <= 0) {
            Debuger.Log(Debuger.DRONGO, "Service销毁:" + proxy.service.name);
            this.__services.delete(clazz);
            proxy.Destroy();
        }
    }
}