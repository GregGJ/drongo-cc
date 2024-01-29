

/**
 * 服务接口
 */
export interface IService {
    
    /**
     * 名称
     */
    name:string;
    /**
     * 初始化
     * @param callback 
     */
    Init(callback: (err: Error, result: IService) => void): void;

    /**
     * 销毁
     */
    Destroy():void;
}