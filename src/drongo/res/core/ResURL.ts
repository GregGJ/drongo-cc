import { Asset, SpriteFrame, Texture2D } from "cc";
import { GetClassName } from "../../exports/GetClassName";


/**
 * 资源地址
 */
export type ResURL = string | { url: string, bundle: string, type: string | any };

/**
 * 资源地址转唯一KEY
 * @param url 
 * @returns 
 */
export function URL2Key(url: ResURL): string {
    return ResURLUtils.URL2Key(url);
}

/**
 * 唯一key转URL
 * @param key 
 * @returns 
 */
export function Key2URL(key: string): ResURL {
    return ResURLUtils.Key2URL(key);
}

/**
 * 获取全路径
 * @param url 
 * @returns 
 */
export function FullURL(url: ResURL): string {
    if (typeof url == "string") {
        return url;
    }
    if (url.type == Texture2D) {
        return url.url + "/texture";
    }
    if (url.type == SpriteFrame) {
        return url.url + "/spriteFrame"
    }
    return url.url;
}

class ResURLUtils {

    static __assetTypes = new Map<string, typeof Asset>();


    private static getAssetType(key: string): typeof Asset {
        if (!this.__assetTypes.has(key)) {
            throw new Error("未找到对应资源类型：" + key);
        }
        return this.__assetTypes.get(key);
    }

    /**
     * 获取全路径
     * @param url 
     * @returns 
     */
    static _getURL(key: string): string {
        let len: number = key.length;
        let end: number = len - 8;
        //texture
        let t = key.substring(end);
        if (t === "/texture") {
            return key.substring(0, end);
        }
        //spriteFrame
        end = len - 12;
        t = key.substring(end);
        if (t === "/spriteFrame") {
            return key.substring(0, end);
        }
        return key;
    }

    /**
     * 唯一key转URL
     * @param key 
     * @returns 
     */
    static Key2URL(key: string): ResURL {
        if (key.indexOf("|")) {
            let arr: Array<string> = key.split("|");
            return { url: this._getURL(arr[0]), bundle: arr[1], type: this.getAssetType(arr[2]) };
        }
        return key;
    }

    /**
     * 资源地址转唯一KEY
     * @param url 
     * @returns 
     */
    static URL2Key(url: ResURL): string {
        if (url == null || url == undefined) {
            return "";
        }
        if (typeof url == "string") {
            return url;
        }
        if (url.type == SpriteFrame) {
            return url.url + "/spriteFrame" + "|" + url.bundle + "|" + this.getAndSaveClassName(url.type);
        }
        if (url.type == Texture2D) {
            return url.url + "/texture" + "|" + url.bundle + "|" + this.getAndSaveClassName(url.type);
        }
        return url.url + "|" + url.bundle + "|" + this.getAndSaveClassName(url.type);
    }

    private static getAndSaveClassName(clazz: any): string {
        let className: string = GetClassName(clazz);
        if (!this.__assetTypes.has(className)) {
            this.__assetTypes.set(className, clazz);
        }
        return className;
    }
}