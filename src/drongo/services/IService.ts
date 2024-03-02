import { ResURL } from "../../drongo-cc";


/**
 * 服务接口
 */
export interface IService {

    /**
     * 名称
     */
    name: string;
    /**
     * 依赖的配置资源
     */
    configs: Array<string>;
    /**
     * 依赖的资源
     */
    assets: Array<ResURL>;
    /**
     * 初始化
     */
    Init(): void;
    /**
     * 销毁(内部接口，请在不需要该服务时调用ServiceManager.Dispose()接口)
     */
    Destroy(): void;
}