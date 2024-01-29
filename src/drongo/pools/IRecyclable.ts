/**
 * 可重复利用对象接口
 */
export interface IRecyclable {

    /**
     * 重置到可复用状态
     */
    Reset(): void;
    /**
     * 销毁
     */
    Destroy(): void;
}