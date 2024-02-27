import { Loader } from "../loaders/Loader";
import { CCLoaderImpl } from "../loaders/CCLoaderImpl";
import { IRes } from "../core/IRes";
import { ILoader } from "../core/ILoader";
import { GetClassName } from "../../exports/GetClassName";
import { ResURL, URL2Key } from "../core/ResURL";
import { ResRef } from "../core/ResRef";
import { StringUtils } from "../../utils/StringUtils";
import { ResManager } from "./ResManager";



export class ResImpl implements IRes {

    private loaderClass: Map<string, new () => ILoader>;

    constructor() {
        this.loaderClass = new Map<string, new () => ILoader>();
    }

    SetResLoader(key: any, loader: new () => ILoader): void {
        let className = GetClassName(key);
        this.loaderClass.set(className, loader);
    }

    GetResLoader(key: any): new () => ILoader {
        let className = GetClassName(key);
        if (!this.loaderClass.has(className)) {
            return CCLoaderImpl;
        }
        return this.loaderClass.get(className);
    }

    GetResRef(url: ResURL, refKey: string, progress?: (progress: number) => void): Promise<ResRef> {
        const urlKey: string = URL2Key(url);
        //地址为空
        if (StringUtils.IsEmpty(urlKey)) {
            return Promise.reject("资源地址为空!");
        }
        //资源已经加载完成
        if (ResManager.HasRes(urlKey)) {
            return Promise.resolve(ResManager.AddResRef(urlKey, refKey));
        }
        let promise = new Promise<ResRef>(
            (resolve, reject) => {
                Loader.single.Load(url, (err: Error) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(ResManager.AddResRef(urlKey, refKey));
                    }
                }, progress);
            }
        );
        return promise;
    }

    GetResRefList(urls: ResURL[], refKey: string, progress?: (progress: number) => void): Promise<ResRef[]> {
        let result: Array<ResRef> = [];
        let promise = new Promise<Array<ResRef>>(
            (resolve, reject) => {
                Loader.single.Load(urls, (err: Error) => {
                    if (err) {
                        reject(err);
                    } else {
                        for (let index = 0; index < urls.length; index++) {
                            const url = urls[index];
                            const urlKey = URL2Key(url);
                            result.push(ResManager.AddResRef(urlKey, refKey));
                        }
                        resolve(result);
                    }
                }, progress);
            }
        );
        return promise;
    }

    GetResRefMap(urls: ResURL[], refKey: string, result?: Map<string, ResRef>, progress?: (progress: number) => void): Promise<Map<string, ResRef>> {
        result = result || new Map<string, ResRef>();
        let promise = new Promise<Map<string, ResRef>>(
            (resolve, reject) => {
                Loader.single.Load(urls, (err: Error) => {
                    if (err) {
                        reject(err);
                    } else {
                        for (let index = 0; index < urls.length; index++) {
                            const url = urls[index];
                            const urlKey = URL2Key(url);
                            result.set(urlKey, ResManager.AddResRef(urlKey, refKey));
                        }
                        resolve(result);
                    }
                }, progress);
            }
        );
        return promise;
    }
}