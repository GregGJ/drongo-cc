


/**
 * 序列化接口
 */
export interface ISerialization {
    /**
     * 编码
     * @param type  
     * @param data 
     */
    Encode(type: number, data?: any): any;

    /**
     * 解码
     * @param type  
     * @param data 
     */
    Decode(type: number, data: any): void;
}