import { Dictionary } from "../containers/Dictionary";
import { TickerManager } from "../ticker/TickerManager";
import { Timer } from "../timer/Timer";
import { IResManager } from "../res/IResManager";
import { IResource } from "../res/IResource";
import { ResManager } from "../res/ResManager";
import { ResRef } from "../res/ResRef";


/**
 * 默认资源管理器
 * @internal
 */
export class ResManagerImpl implements IResManager {

    /**
     * 资源
     */
    protected __resDic: Dictionary<string, IResource> = new Dictionary<string, IResource>();
    /**
     * 等待销毁的资源
     */
    protected _waitDestroy: Array<IResource> = [];

    constructor() {
        TickerManager.AddTicker(this);
    }

    Tick(dt: number): void {
        if (ResManager.AUTO_GC) {
            this.GC();
        }
    }

    AddRes(value: IResource): void {
        if (this.__resDic.Has(value.key)) {
            throw new Error("重复添加资源！");
        }
        this.__resDic.Set(value.key, value);
        //标记为待删除
        this._waitDestroy.push(value);
        value.lastOpTime = Timer.currentTime;
    }

    HasRes(key: string): boolean {
        return this.__resDic.Has(key);
    }

    _getRes(key: string): IResource {
        return this.__resDic.Get(key);
    }

    AddResRef(key: string, refKey?: string): ResRef {
        if (!this.__resDic.Has(key)) {
            throw new Error("未找到资源：" + key);
        }
        let res: IResource = this.__resDic.Get(key)!;
        //如果在待删除列表中
        let index: number = this._waitDestroy.indexOf(res);
        if (index >= 0) {
            this._waitDestroy.splice(index, 1);
        }
        //更新操作时间
        res.lastOpTime = Timer.currentTime;
        return res.AddRef(refKey);
    }

    RemoveResRef(value: ResRef): void {
        if (!this.__resDic.Has(value.key)) {
            throw new Error("未找到资源：" + value.key);
        }
        let res: IResource = this.__resDic.Get(value.key)!;
        res.RemoveRef(value);
        if (res.refLength == 0) {
            //放入待删除列表
            this._waitDestroy.push(res);
        }
        res.lastOpTime = Timer.currentTime;
    }

    GC(ignoreTime?: boolean): void {
        let res: IResource;
        let currentTime: number = Timer.currentTime;
        for (let index = 0; index < this._waitDestroy.length; index++) {
            res = this._waitDestroy[index];
            if (res.refCount > 0) {
                continue;
            }
            //如果忽略时间机制
            if (ignoreTime == true) {
                this._waitDestroy.splice(index, 1);
                this.DestroyRes(res);
                index--;
            } else if (currentTime - res.lastOpTime > ResManager.GC_TIME) {//超过允许的时间就回收
                this._waitDestroy.splice(index, 1);
                this.DestroyRes(res);
                index--;
            }
        }
    }

    /**
     * 销毁
     * @param value 
     */
    protected DestroyRes(value: IResource): void {
        this.__resDic.Delete(value.key);
        value.Destroy();
    }

    get resList(): Array<IResource> {
        return this.__resDic.elements;
    }
}