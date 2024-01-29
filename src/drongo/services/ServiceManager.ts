

import { GetClassName } from "../exports/GetClassName";
import { IService } from "./IService";
import { ServiceStarter } from "./ServiceStarter";


export class ServiceManager {

    /**启动器 */
    private static __starters: Map<string, ServiceStarter<any>> = new Map<string, ServiceStarter<any>>();

    /**
     * 获取服务
     * @param key 
     * @returns 
     */
    static GetService<T extends IService>(value: { new(): IService }): Promise<T> {
        const className = GetClassName(value);
        //如果启动器存在
        if (this.__starters.has(className)) {
            return this.__starters.get(className).Start();
        }
        let starter = new ServiceStarter<T>(className, value);
        this.__starters.set(className, starter);
        return starter.Start();
    }

    /**
     * 卸载服务
     * @param key 
     */
    static Uninstall(value: IService): void {
        const className = GetClassName(value);
        if (!this.__starters.has(className)) {
            return;
        }
        let starter = this.__starters.get(className);
        starter.Destroy();
        this.__starters.delete(className);
    }
}