/**
 * 稀疏集合
 */
export class SparseSet {

    /**无效值 */
    invalid: number = 0;
    private __maxCount: number = 0;
    private __packed: Uint32Array;
    private __index: number = 0;
    private __sparse: Array<Uint32Array> = [];
    private __sparsePage: number = 0;

    constructor(maxCount: number = 2048, sparsePage: number = 4) {
        if (maxCount % sparsePage != 0) {
            throw new Error("数量必须是page的倍数");
        }
        this.__maxCount = this.invalid = maxCount;
        this.__sparsePage = sparsePage;
        this.__packed = new Uint32Array(this.__maxCount);
        this.__packed.fill(this.invalid);
        const count = maxCount / 4;
        this.__sparse = new Array(count);
        for (let index = 0; index < count; index++) {
            this.__sparse[index] = new Uint32Array(sparsePage);
        }
    }
    
    /**
     * 添加
     * @param id 
     */
    Add(id: number): void {
        if (id >= this.invalid) {
            throw new Error("超出最大索引:" + id + "/" + this.invalid)
        }
        this.__packed[this.__index] = id;
        this.__addToSparse(id, this.__index);
        this.__index++;
    }

    /**
     * 是否包含
     * @param id 
     * @returns 
     */
    Contains(id: number): boolean {
        const x = Math.floor(id / this.__sparsePage);
        const y = id % this.__sparsePage;
        if (this.__sparse[x] == null) {
            return false;
        }
        if (this.__sparse[x][y] == this.invalid) {
            return false;
        }
        return true;
    }

    /**
     * 删除
     * @param id 
     */
    Remove(id: number): number {
        //删除并返回在packed中的索引位置
        const pIdx = this.__removeSparse(id);
        //要删除的数据
        let sIdx: number = this.invalid;
        if (this.__index == 1) {//最后一个
            this.__packed[pIdx] = this.invalid;
            this.__index--;
            return -1;
        } else {
            sIdx = this.__packed[this.__index - 1];
            this.__packed[pIdx] = sIdx;
            this.__packed[this.__index - 1] = this.invalid;
            this.__addToSparse(sIdx, pIdx);
            this.__index--;
            return pIdx;
        }
    }

    /**
     * 清除所有
     */
    Clear(): void {
        this.__packed.fill(this.invalid);
        for (let index = 0; index < this.__sparse.length; index++) {
            const list = this.__sparse[index];
            if (list) {
                list.fill(this.invalid);
            }
        }
        this.__index = 0;
    }

    Destroy(): void {
        this.__sparse.length = 0;
    }

    private __addToSparse(idx: number, v: number): void {
        const x = Math.floor(idx / this.__sparsePage);
        const y = idx % this.__sparsePage;
        let list: Uint32Array;
        if (this.__sparse[x] == null) {
            list = new Uint32Array(this.__sparsePage);
            this.__sparse[x] = list;
            list.fill(this.invalid);
        } else {
            list = this.__sparse[x];
        }
        list[y] = v;
    }

    /**
     * 删除并返回内容
     * @param idx 
     * @returns 
     */
    private __removeSparse(idx: number): number {
        const x = Math.floor(idx / this.__sparsePage);
        const y = idx % this.__sparsePage;
        if (!this.__sparse[x]) {
            throw new Error("找不到要删除的元素：" + idx);
        }
        //找到在packed中的索引位置
        const pIdx = this.__sparse[x][y];
        if (pIdx == this.invalid) {
            throw new Error("找不到要删除的元素：" + idx);
        }
        this.__sparse[x][y] = this.invalid;
        return pIdx;
    }

    /**
     * 获取packed的索引值
     * @param id 
     * @returns 
     */
    GetPackedIdx(id: number): number {
        const x = Math.floor(id / this.__sparsePage);
        const y = id % this.__sparsePage;
        if (!this.__sparse[x]) {
            return this.invalid;
        }
        //找到在packed中的索引位置
        const pIdx = this.__sparse[x][y];
        return pIdx;
    }

    get packed(): Uint32Array {
        return this.__packed;
    }

    get length(): number {
        return this.__index;
    }

    get maxCount(): number {
        return this.__maxCount;
    }
}