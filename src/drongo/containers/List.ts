import { DEvent } from "../events/DEvent";
import { EventDispatcher } from "../events/EventDispatcher";


/**
 * 列表
 */
export class List<T> extends EventDispatcher {

    private __element: Array<T>;
    /**
     * 是否保证元素的唯一性
     */
    private __only: boolean = false;
    /**
     * 元素数量(内部再增删时会修改这个参数，外部只做计算和绑定使用，切记不可做赋值操作！)
     */
    count: number = 0;

    constructor(only: boolean = true) {
        super();
        this.__only = only;
        this.__element = [];
    }

    /**
     * 添加到末尾(注意如果保证唯一性，那么重复时就直接返回)
     * @param value 
     */
    Push(value: T): boolean {
        if (this.__only) {
            let index: number = this.__element.indexOf(value);
            if (index >= 0) {
                return false;
            }
        }
        this.__element.push(value);
        this.count = this.__element.length;
        if (this.HasEvent(DEvent.ADD)) {
            this.Emit(DEvent.ADD, value);
        }
        return true;
    }

    /**
     * 添加到列表头部(注意如果保证唯一性，那么重复时就直接返回)
     * @param value 
     * @returns 
     */
    Unshift(value: T): boolean {
        if (this.__only) {
            let index: number = this.__element.indexOf(value);
            if (index >= 0) {
                return false;
            }
        }
        this.__element.unshift(value);
        this.count = this.__element.length;
        if (this.HasEvent(DEvent.ADD)) {
            this.Emit(DEvent.ADD, value);
        }
        return true;
    }

    /**
     * 获取并删除最后一个元素
     * @returns 
     */
    Pop(): T {
        if (this.__element.length > 0) {
            const result = this.__element.pop();
            this.count = this.__element.length;
            if (this.HasEvent(DEvent.REMOVE)) {
                this.Emit(DEvent.REMOVE, result);
            }
            return result;
        }
        return null;
    }

    /**
     * 获取并删除第一个元素
     * @returns 
     */
    Shift(): T {
        if (this.__element.length > 0) {
            const result = this.__element.shift();
            this.count = this.__element.length;
            if (this.HasEvent(DEvent.REMOVE)) {
                this.Emit(DEvent.REMOVE, result);
            }
            return result;
        }
        return null;
    }

    /**
     * 删除指定索引的元素
     * @param index 
     */
    RemoveAt(index: number): T {
        if (index >= this.__element.length) {
            throw new Error("删除索引超出范围！");
        }
        const result = this.__element[index];
        this.__element.splice(index, 1);
        this.count = this.__element.length;
        if (this.HasEvent(DEvent.REMOVE)) {
            this.Emit(DEvent.REMOVE, result);
        }
        return result;
    }

    /**
     * 删除元素
     * @param value 
     */
    Remove(value: T): void {
        let index: number = this.__element.indexOf(value);
        if (index < 0) {
            throw new Error("要删除的内容不在列表中！" + value);
        }
        const result = this.__element[index];
        this.__element.splice(index, 1);
        this.count = this.__element.length;
        if (this.HasEvent(DEvent.REMOVE)) {
            this.Emit(DEvent.REMOVE, result);
        }
    }

    /**
     * 移除所有元素
     */
    Clear(): void {
        this.count = 0;
        this.__element.length = 0;
        if (this.HasEvent(DEvent.CLEAR)) {
            this.Emit(DEvent.CLEAR);
        }
    }

    /**
     * 判断是否包含
     * @param value 
     * @returns 
     */
    Has(value: T): boolean {
        return this.Find(value) >= 0;
    }
    
    /**
     * 查找元素下标
     * @param value 
     * @returns 
     */
    Find(value: T): number {
        return this.__element.indexOf(value);
    }

    /**
     * 查找元素下标
     * @param predicate 
     * @returns 
     */
    FindIndex(predicate: (value: T, index: number, obj: T[]) => unknown): number {
        let index = this.__element.findIndex(predicate);
        return index;
    }

    /**
     * 获取指定元素
     * @param index 
     * @returns 
     */
    Get(index: number): T {
        if (index >= this.__element.length) {
            throw new Error("超出索引范围:" + index + "/" + this.__element.length);
        }
        return this.__element[index];
    }

    /**
     * 源列表数据(注意不要直接进行增删操作，而是通过List.push....等接口进行操作)
     */
    get elements(): Array<T> {
        return this.__element;
    }
}