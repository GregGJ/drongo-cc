import { Injector } from "../../../utils/Injector";
import { LayerManagerImpl } from "../../layer/LayerManagerImpl";
import { ILayer } from "./ILayer";
import { ILayerManager } from "./ILayerManager";



/**
 * 层管理器
 */
export class LayerManager {

    static KEY: string = "drongo.LayerManager";
    /**
     * 添加一个层
     * @param key 
     * @param layer 
     */
    static AddLayer(key: string, layer: ILayer): void {
        this.impl.AddLayer(key, layer);
    }

    /**
     * 删除层
     * @param key 
     */
    static RemoveLayer(key: string): void {
        this.impl.RemoveLayer(key);
    }

    /**
     * 获取层对象
     * @param key 
     */
    static GetLayer(key: string): ILayer | undefined {
        return this.impl.GetLayer(key);
    }

    /**
     * 获得所有层
     */
    static GetAllLayer(): ILayer[] {
        return this.impl.GetAllLayer();
    }

    private static __impl: ILayerManager;
    private static get impl(): ILayerManager {
        if (this.__impl == null) {
            this.__impl = Injector.GetInject(this.KEY);
        }
        if (this.__impl == null) {
            this.__impl=new LayerManagerImpl();
        }
        return this.__impl;
    }
}