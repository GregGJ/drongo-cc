import { DEvent } from "../events/DEvent";
import { EventDispatcher } from "../events/EventDispatcher";


/**
 * 字典
 */
export class Dictionary<TKey, TValue> extends EventDispatcher {

    private __map: Map<TKey, TValue> | undefined = new Map<TKey, TValue>();
    private __list: Array<TValue> = [];
    constructor() {
        super();
    }

    /**
     * 设置
     * @param key 
     * @param value 
     */
    Set(key: TKey, value: TValue): void {
        let old: TValue;
        //删除老的
        if (this.__map.has(key)) {
            old = this.__map.get(key);
            const index: number = this.__list.indexOf(old);
            if (index < 0) {
                throw new Error("Dictionary内部逻辑错误！");
            }
            this.__map.delete(key);
            this.__list.splice(index, 1);
            this.Emit(DEvent.REMOVE, old);
        }
        this.__map.set(key, value);
        this.__list.push(value);
        this.Emit(DEvent.ADD, value);
    }

    /**
     * 是否拥有指定KEY的元素
     * @param key 
     * @returns 
     */
    Has(key: TKey): boolean {
        return this.__map.has(key);
    }

    /**
     * 获取指定元素
     * @param key 
     * @returns 
     */
    Get(key: TKey): TValue | undefined {
        return this.__map.get(key);
    }

    /**
     * 通过索引获取元素
     * @param index 
     * @returns 
     */
    GetValue(index: number): TValue | undefined {
        if (index >= this.__list.length) {
            throw new Error(index + "索引超出0-" + this.__list.length + "范围");
        }
        return this.__list[index];
    }

    /**
     * 删除指定元素
     * @param key 
     * @returns 
     */
    Delete(key: TKey): TValue | undefined {
        if (!this.__map.has(key)) {
            return undefined;
        }
        const result = this.__map.get(key);
        const index: number = this.__list.indexOf(result);
        if (index < 0) {
            throw new Error("Dictionary内部逻辑错误！");
        }
        this.__list.splice(index, 1);
        this.__map.delete(key);
        //派发删除事件
        if (this.HasEvent(DEvent.REMOVE)) {
            this.Emit(DEvent.REMOVE, result);
        }
        return result;
    }

    /**
     * 清除所有元素
     */
    Clear() {
        this.__map.clear();
        this.__list.length = 0;
    }

    getKeys(): Array<TKey> {
        let result: Array<TKey> = [];
        for (const iterator of this.__map.keys()) {
            result.push(iterator);
        }
        return result;
    }

    /**
    * 元素列表
    */
    get elements(): Array<TValue> {
        return this.__list;
    }

    public get size(): number {
        return this.__map.size;
    }

    Destroy(): void {
        super.Destroy();
        this.__map.clear();
        this.__map = null;
        this.__list = null;
    }
}