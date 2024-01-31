


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
     * 获取列表形式存储的配置内容
     */
    Get<T>(): Array<T>;
    
    /**
     * 清理
     */
    Destroy(): void;
}