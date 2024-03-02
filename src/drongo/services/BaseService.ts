import { ResURL } from "../res/core/ResURL";
import { IService } from "./IService";

/**
 *  服务基类
 */
export class BaseService implements IService {

    /**名称 */
    name: string;
    /**
     * 依赖的配置表名称
     */
    configs: Array<string>;
    /**
     * 依赖的资源
     */
    assets: Array<ResURL>;

    constructor() {
        
    }
    
    Init(): void {
        
    }

    Destroy(): void {
        this.name = undefined;
        this.configs = null;
        this.assets = null;
    }
}