


/**
 * 序列化接口
 */
export interface ISerialization {
    /**
     * 编码
     * @param type  
     * @param data 
     */
    Encode(type: Number, data?: any): any;

    /**
     * 解码
     * @param type  
     * @param data 
     */
    Decode(type: Number, data: any): void;
}