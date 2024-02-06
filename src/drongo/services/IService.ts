

/**
 * 服务接口
 */
export interface IService {

    /**
     * 名称
     */
    name: string;
    /**
     * 初始化
     * @param callback 
     */
    Init(callback: (err: Error) => void): void;

    /**
     * 销毁(内部接口，请在不需要该服务时调用ServiceManager.Dispose()接口)
     */
    Destroy(): void;

    AddRef(): void;

    RemoveRef(): void;

    /**
     * 引用计数器
     */
    readonly refCount: number;
}