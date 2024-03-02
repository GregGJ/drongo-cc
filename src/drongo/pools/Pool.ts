import { StringUtils } from "../utils/StringUtils";
import { IRecyclable } from "./IRecyclable";


/**
 * 对象池
 */
export class Pool {

    private static __pools: Map<string, PoolImpl<IRecyclable>> = new Map<string, PoolImpl<IRecyclable>>();
    
    /**
     * 分配
     * @param clazz 
     * @param maxCount 
     * @returns 
     */
    static allocate<T extends IRecyclable>(clazz: { new(): T }, maxCount?: number): T {
        let className = StringUtils.GetClassName(clazz);
        let pool: PoolImpl<IRecyclable>;
        if (this.__pools.has(className)) {
            pool = this.__pools.get(className);
        } else {
            pool = new PoolImpl<T>(clazz, maxCount);
            this.__pools.set(className, pool);
        }
        return pool.allocate() as T;
    }

    /**
     * 回收
     * @param value 
     */
    static recycle(value: IRecyclable): void {
        let className = StringUtils.GetClassName(value);
        if (!this.__pools.has(className)) {
            throw new Error("对象池不存在:" + className);
        }
        let pool = this.__pools.get(className);
        pool.recycle(value);
    }

    /**
     * 回收多个对象
     * @param list 
     */
    static recycleList(list: Array<IRecyclable>): void {
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            this.recycle(element);
        }
    }

    /**
     * 回收该类型的所有对象
     * @param clazz 
     */
    static recycleAll<T extends IRecyclable>(clazz: { new(): T }): void {
        let className = StringUtils.GetClassName(clazz);
        if (!this.__pools.has(className)) {
            throw new Error("对象池不存在:" + className);
        }
        let pool = this.__pools.get(className);
        pool.recycleAll();
    }
}

class PoolImpl<T extends IRecyclable>{
    /**池中闲置对象 */
    private __cacheStack: Array<T> = new Array<T>();
    /**正在使用的对象 */
    private __usingArray: Array<T> = new Array<T>();
    /**池中对象最大数 */
    private __maxCount: number = 0;

    private __class: { new(): T };

    constructor(clazz: { new(): T }, maxCount?: number) {
        this.__class = clazz;
        if (!this.__class) {
            throw new Error("构造函数不能为空！");
        }
        this.__maxCount = maxCount == undefined ? Number.MAX_SAFE_INTEGER : maxCount;
    }

    /**
    * 在池中的对象
    */
    public get count(): number {
        return this.__cacheStack.length;
    }

    /**
     * 使用中的数量
     */
    public get usingCount(): number {
        return this.__usingArray.length;
    }

    /**
     * 分配
     * @returns 
     */
    public allocate(): T {
        if (this.count + this.usingCount < this.__maxCount) {
            let element: T = this.__cacheStack.length > 0 ? this.__cacheStack.pop()! : new this.__class();
            this.__usingArray.push(element);
            return element;
        }
        throw new Error("对象池最大数量超出：" + this.__maxCount);
    }

    /**
     * 回收到池中
     * @param value 
     * @returns 
     */
    public recycle(value: T): void {
        if (this.__cacheStack.indexOf(value) > -1) {
            throw new Error("重复回收！");
        }
        let index = this.__usingArray.indexOf(value);
        if (index < 0) {
            throw new Error("对象不属于该对象池！");
        }
        //重置
        value.Reset();

        this.__usingArray.splice(index, 1);
        this.__cacheStack.push(value);
    }

    /**
     * 批量回收
     * @param list 
     */
    public recycleList(list: Array<T>): void {
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            this.recycle(element);
        }
    }

    /**
     * 将所有使用中的对象都回收到池中
     */
    public recycleAll(): void {
        for (let index = 0; index < this.__usingArray.length; index++) {
            const element = this.__usingArray[index];
            this.recycle(element);
        }
    }

    public destroy(): void {
        this.recycleAll();
        for (let index = 0; index < this.__cacheStack.length; index++) {
            const element = this.__cacheStack[index];
            element.Destroy();
        }
        this.__cacheStack.length = 0;
        this.__cacheStack = null!;
        this.__usingArray.length = 0;
        this.__usingArray = null!;
    }
}