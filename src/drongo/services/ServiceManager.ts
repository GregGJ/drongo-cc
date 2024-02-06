

import { GetClassName } from "../exports/GetClassName";
import { IService } from "./IService";


export class ServiceManager {

    /**启动器 */
    private static __services: Map<string, IService> = new Map<string, IService>();

    /**
     * 初始化服务
     * @param key 
     * @returns 
     */
    static InitService(services: { new(): IService } | Array<{ new(): IService }>, callback: (err: Error, services?: Array<IService>) => void): void {
        let result: Array<IService> = [];
        if (Array.isArray(services)) {
            let inited: number = 0;
            for (let index = 0; index < services.length; index++) {
                const serviceClass = services[index];
                this.__InitService(serviceClass, (err: Error, service?: IService) => {
                    result.push(service);
                    inited++;
                    if (inited >= services.length) {
                        callback(err, result);
                    }
                })
            }
        } else {
            this.__InitService(services, (err?: Error, service?: IService) => {
                result.push(service);
                callback(err, result);
            })
        }
    }

    private static __InitService(serviceClass: { new(): IService }, callback: (err: Error, service?: IService) => void): void {
        const className = GetClassName(serviceClass);
        let service: IService;
        if (this.__services.has(className)) {
            service = this.__services.get(className);
            callback(null, service);
        } else {
            service = new serviceClass();
            service.name = className;
            this.__services.set(className, service);
            service.Init((err?: Error) => {
                callback(err, service);
            });
        }
    }

    /**
     * 获取服务
     * @param clazz 
     */
    static GetService(clazz: { new(): IService }): IService {
        const className = GetClassName(clazz);
        if (!this.__services.has(className)) {
            throw new Error(className + "未初始化!");
        }
        let service = this.__services.get(className);
        return service;
    }

    /**
     * 尝试销毁服务
     * @param clazz
     */
    static Dispose(clazz: { new(): IService }): void {
        let service = this.GetService(clazz);
        service.RemoveRef();
        if (service.refCount <= 0) {
            const serviceName = GetClassName(clazz);
            this.__services.delete(serviceName);
            service.Destroy();
        }
    }
}