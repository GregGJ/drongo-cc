import { ILayer } from "./ILayer";


export interface ILayerManager {

    /**
     * 添加层
     * @param key 
     * @param layer 
     */
    AddLayer(key: string, layer: ILayer): void;
    /**
     * 删除层
     * @param key 
     */
    RemoveLayer(key: string): void;

    /**
     * 获取层对象
     * @param key
     */
    GetLayer(key: string): ILayer | undefined;
    /**
     * 获得所有层
     */
    GetAllLayer():ILayer[];
}