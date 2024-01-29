import { sys } from "cc";
import { ILocalStorage } from "./ILocalStorage";
import { TickerManager } from "../ticker/TickerManager";


/**
 * 本地数据缓存
 */
export class LocalStorageImpl implements ILocalStorage{

    private __gameName:string;

    private data:any;

    /**
     * 初始化
     * @param gameName 
     */
    Init(gameName:string):void{
        this.__gameName=gameName;
        let localDataStr: string = sys.localStorage.getItem(this.__gameName);
        if (!localDataStr) {
            this.data={};
        }else{
            this.data=JSON.parse(localDataStr);
        }
    }

    /**
     * 获取指定数据
     * @param key 
     * @returns 
     */
    GetItem(key:string):any{
        return this.data[key];
    }

    /**
     * 设置指定数据
     * @param key 
     * @param value 
     */
    SetItem(key:string,value:any):void{
        this.data[key]=value;
        TickerManager.CallNextFrame(this.__save,this);
    }


    /**
     * 清理
     * @param key 
     */
    ClearItem(key:string):void{
        delete this.data[key];
        TickerManager.CallNextFrame(this.__save,this);
    }

    /**
     * 清理所有
     */
    ClearAll():void{
        this.data={};
        TickerManager.CallNextFrame(this.__save,this);
    }

    /**
     * 保存
     */
    private __save():void{
        //保存到本地
        let localDataStr: string=JSON.stringify(this.data);
        sys.localStorage.setItem(this.__gameName,localDataStr);
    }
}