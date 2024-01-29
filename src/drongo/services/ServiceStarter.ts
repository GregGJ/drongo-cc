import { IService } from "./IService";


export class ServiceStarter<T extends IService> {
    private __name: string;
    private __serviceClass: { new(): IService };
    private __result: Promise<T>;
    private __service: IService;
    constructor(name: string, serviceClass: { new(): IService }) {
        this.__name = name;
        this.__serviceClass = serviceClass;
    }

    /**
     * 启动
     */
    async Start(): Promise<T> {
        if (this.__result) {
            return this.__result;
        }
        this.__result = new Promise<T>((resolve, reject) => {
            //创建服务
            this.__service = new this.__serviceClass();
            this.__service.name = this.__name;
            //初始化服务
            this.__service.Init((err: Error, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result as T);
                }
            });
        })
        return this.__result;
    }

    Destroy(): void {
        this.__name = undefined;
        this.__serviceClass = undefined;
        this.__result = undefined;
        this.__service.Destroy();
        this.__service = null;
    }
}