import { ResURL, URL2Key } from "../core/ResURL";
import { ResRequest } from "./ResRequest";



export class Loader {

    private __requests: Map<string, Array<ResRequest>> = new Map<string, Array<ResRequest>>();
    //对象池
    private __pools: Array<ResRequest> = [];
    constructor() {

    }

    /**
     * 加载
     * @param url 
     * @param resKey 
     * @param cb 
     * @param progress 
     */
    Load(url: ResURL | Array<ResURL>, cb?: (err: Error) => void, progress?: (progress: number) => void): void {
        let request: ResRequest;
        if (this.__pools.length > 0) {
            request = this.__pools.shift();
        } else {
            request = new ResRequest();
        }
        request.Init(url, cb, progress);
        if (request.Load()) {
            this.__addReqeuset(request);
        }
    }
    
    ChildComplete(url: ResURL): void {
        const urlKey: string = URL2Key(url);
        let list = this.__requests.get(urlKey);
        for (let index = 0; index < list.length; index++) {
            const request = list[index];
            request.ChildComplete(url);
        }
        list.length = 0;
        this.__requests.delete(urlKey);
    }

    ChildError(url: ResURL, err: Error): void {
        const urlKey: string = URL2Key(url);
        let rlist = this.__requests.get(urlKey);
        for (let index = 0; index < rlist.length; index++) {
            const request = rlist[index];
            request.ChildError(err);
        }
        //复制
        let list = rlist.concat();
        //清除掉关联的所有资源请求
        for (let index = 0; index < list.length; index++) {
            const request = list[index];
            this.__deleteReqeuset(request);
            //销毁
            this.BackToPool(request);
        }
        this.__requests.delete(urlKey);
    }

    ChildProgress(url: ResURL, progress: number): void {
        const urlKey: string = URL2Key(url);
        let list = this.__requests.get(urlKey);
        for (let index = 0; index < list.length; index++) {
            const request = list[index];
            request.ChildProgress(url, progress);
        }
    }

    /**
     * 回收到池中
     * @param value 
     */
    BackToPool(value: ResRequest): void {
        value.Reset();
        this.__pools.push(value);
    }

    /**
     * 添加
     * @param request 
     */
    private __addReqeuset(request: ResRequest): void {
        let list: Array<ResRequest>;
        for (let index = 0; index < request.urls.length; index++) {
            const url = request.urls[index];
            const urlKey = URL2Key(url);
            if (this.__requests.has(urlKey)) {
                list = this.__requests.get(urlKey);
            } else {
                list = [];
                this.__requests.set(urlKey, list);
            }
            list.push(request);
        }
    }

    /**
     * 删除
     * @param request 
     */
    private __deleteReqeuset(request: ResRequest): void {
        let list: Array<ResRequest>;
        let findex: number = 0;
        //遍历当前请求的所有资源
        for (let i = 0; i < request.urls.length; i++) {
            const url = request.urls[i];
            const urlKey = URL2Key(url);
            //从列表中找出并删除
            list = this.__requests.get(urlKey);
            findex = list.indexOf(request);
            if (findex >= 0) {
                list.splice(findex, 1);
            }
        }
    }

    private static __instance: Loader;
    static get single(): Loader {
        if (this.__instance == null) {
            this.__instance = new Loader();
        }
        return this.__instance;
    }
}