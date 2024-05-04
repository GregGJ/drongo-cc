import { Pool } from "../utils/Pool";
import { SparseSet } from "./SparseSet";



/**
 * 存储器
 */
export class ECSStorage<TKey extends number, TValue> {

    private __valuePool: Map<new () => TValue, Pool<TValue>>;
    private __values: Map<new () => TValue, Array<TValue | null>>;
    private __sparseSet: SparseSet;

    constructor(maxCount: number, sparsePage: number) {
        this.__sparseSet = new SparseSet(maxCount, sparsePage);
        this.__valuePool = new Map<new () => TValue, Pool<TValue>>
        this.__values = new Map<new () => TValue, Array<TValue | null>>();
    }

    /**
     * 添加key
     * @param key 
     */
    Add(key: TKey): void {
        this.__sparseSet.Add(key);
    }

    /**
     * 是否包含Key
     * @param key 
     * @returns 
     */
    Has(key: TKey): boolean {
        return this.__sparseSet.Contains(key);
    }

    /**
     * 删除Key
     * @param key 
     * @returns 
     */
    Remove(key: TKey): void {
        const deleteIdx = this.__sparseSet.GetPackedIdx(key);
        const lastIdx = this.__sparseSet.length - 1;
        //删除关联值
        let types = this.__values.keys();
        for (const type of types) {
            this.RemoveValue(key, type);
        }
        if (lastIdx >= 0) {
            for (let [type, _] of this.__values) {
                const list = this.__values.get(type);
                if (list == null) continue;
                list[deleteIdx] = list[lastIdx];
                list[lastIdx] = null;
            }
        }
        this.__sparseSet.Remove(key);
    }

    /**
     * 获取
     * @param key 
     * @param type 
     * @returns 
     */
    GetValue<T extends TValue>(key: TKey, type: new () => T): T | null {
        let pIdx = this.__sparseSet.GetPackedIdx(key);
        if (pIdx == this.__sparseSet.invalid) {
            return null;
        }
        let list = this.__values.get(type);
        if (list == null || list.length == 0 || pIdx >= list.length) {
            return null;
        }
        return list[pIdx] as T;
    }

    /**
     * 添加
     * @param key 
     * @param type 
     * @returns 
     */
    AddValue<T extends TValue>(key: TKey, type: new () => T): T {
        if (!this.__sparseSet.Contains(key)) throw new Error("不存在:" + key);
        const pIdx = this.__sparseSet.GetPackedIdx(key);
        let list = this.__values.get(type);
        if (list == null) {
            list = new Array<TValue>(this.__sparseSet.maxCount);
            this.__values.set(type, list);
        }
        if (list[pIdx] != null) {
            throw new Error(key + "=>重复添加:" + type);
        }
        //对象池
        let pool = this.__valuePool.get(type);
        if (!pool) {
            pool = new Pool(type);
            this.__valuePool.set(type, pool);
        }
        list[pIdx] = pool.Alloc();
        return list[pIdx] as T;
    }

    /**
     * 是否包含Value
     * @param entityID 
     * @param type 
     */
    HasValue<T extends TValue>(entityID: TKey, type: new () => T): boolean {
        if (!this.__sparseSet.Contains(entityID)) {
            throw new Error("entity不存在:" + entityID);
        }
        let pIdx = this.__sparseSet.GetPackedIdx(entityID);
        let list = this.__values.get(type);
        if (list == null) {
            return false;
        }
        if (list[pIdx] == null) {
            return false;
        }
        return true;
    }

    /**
     * 删除
     * @param key 
     * @param type 
     * @returns 
     */
    RemoveValue<T extends TValue>(key: TKey, type: new () => T): T {
        if (!this.__sparseSet.Contains(key)) throw new Error("entity不存在:" + key);
        let pIdx = this.__sparseSet.GetPackedIdx(key);
        let list = this.__values.get(type);
        if (list == null || list.length == 0) {
            throw new Error(key + "=>上找不到要删除的组件:" + type);
        }
        let result = list[pIdx] as T;
        list[pIdx] = null;
        let pool = this.__valuePool.get(type);
        if (!pool) {
            throw new Error("对象池不存在！");
        }
        pool.Recycle(result);
        return result;
    }

    /**
     * 清理
     */
    Clear(): void {
        while (this.__sparseSet.length > 0) {
            this.Remove(this.elements[0] as TKey);
        }
    }

    /**销毁 */
    Destroy(): void {
        this.__sparseSet.Destroy();
        this.__sparseSet = null;
        this.__valuePool.clear();
        this.__valuePool = null;
        this.__values.clear();
        this.__values = null;
    }

    /**无效值 */
    get invalid(): number {
        return this.__sparseSet.invalid;
    }

    get elements(): Uint32Array {
        return this.__sparseSet.packed;
    }
}