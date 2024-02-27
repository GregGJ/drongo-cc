


/**
 * 配置存取器接口
 */
export interface IConfigAccessor {

    /**
     * 保存
     * @param value 
     */
    Save(value: any): boolean;
    /**
     * 获取
     */
    Get<T>(...arg: any[]): T | Array<T>;
    /**
     * 清理
     */
    Destroy(): void;
}