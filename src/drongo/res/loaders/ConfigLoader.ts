import { AssetManager, BufferAsset, assetManager } from "cc";
import { ConfigManager } from "../../configs/ConfigManager";
import { ConfigUtils } from "../../configs/ConfigUtils";
import { IConfigAccessor } from "../../configs/core/IConfigAccessor";
import { Debuger } from "../../debugers/Debuger";
import { DEvent } from "../../events/DEvent";
import { EventDispatcher } from "../../events/EventDispatcher";
import { ByteArray } from "../../utils/ByteArray";
import { ILoader } from "../core/ILoader";
import { FullURL, ResURL, URL2Key } from "../core/ResURL";
import { ResManager } from "../res/ResManager";
import { Resource } from "../res/Resource";



export class ConfigLoader extends EventDispatcher implements ILoader {
    url: ResURL;

    constructor() {
        super();
    }

    Load(url: ResURL): void {
        this.url = url;
        if (typeof url == "string") {
            throw new Error("未实现！");
        }
        let bundle = assetManager.getBundle(url.bundle);
        if (!bundle) {
            let __this = this;
            assetManager.loadBundle(url.bundle, (err: Error, bundle: AssetManager.Bundle) => {
                if (err) {
                    this.Emit(DEvent.ERROR, { url, err });
                    return;
                }
                this.__load(url, bundle);
            });
        } else {
            this.__load(url, bundle);
        }
    }

    private __load(url: ResURL, bundle: AssetManager.Bundle): void {
        if (typeof url == "string") {
            throw new Error("未实现！");
        }
        let __this = this;
        bundle.load(FullURL(url), BufferAsset,
            (finished: number, total: number) => {
                const progress = finished / total;
                __this.Emit(DEvent.PROGRESS, { url, progress });
            }, (err: Error, asset: any) => {
                if (err) {
                    __this.Emit(DEvent.ERROR, { url, err });
                    return;
                }
                const urlKey = URL2Key(url);
                let buffer = asset['_buffer'];
                let accessor = this.__parseConfig(url.url, buffer);
                let res: Resource = new Resource();
                res.key = urlKey;
                res.content = accessor;
                ResManager.AddRes(res);
                __this.Emit(DEvent.COMPLETE, { url });
            });
    }

    private __parseConfig(sheet: string, buffer: ArrayBuffer): IConfigAccessor {
        let byte: ByteArray = new ByteArray(buffer);
        //解析表头
        let len: number = byte.ReadUnsignedInt();
        let titleList: Array<string> = [];
        for (let index = 0; index < len; index++) {
            titleList.push(byte.ReadUTF());
        }
        //类型
        let typeList: Array<number> = [];
        len = byte.ReadUnsignedInt();
        for (let index = 0; index < len; index++) {
            typeList.push(byte.ReadByte());
        }
        //数据数量
        len = byte.ReadUnsignedInt();
        let data: any;
        //存取器
        let accessor: IConfigAccessor = ConfigManager._GetAccessor(sheet);
        for (let dataIndex = 0; dataIndex < len; dataIndex++) {
            data = ConfigUtils.ParseConfig(titleList, typeList, byte);
            accessor.Save(data);
        }
        return accessor;
    }

    Reset(): void {
        this.url = null;
    }
}