

export interface ILocalStorage
{
    /**
     * 初始化
     * @param gameName 
     */
    Init(gameName:string):void;

    /**
     * 获取指定数据
     * @param key 
     * @returns 
     */
    GetItem(key:string):any;

    /**
     * 设置指定数据
     * @param key 
     * @param value 
     */
    SetItem(key:string,value:any):void;

    /**
     * 清理
     * @param key 
     */
    ClearItem(key:string):void;
    
    /**
     * 清理所有
     */
    ClearAll():void;
}