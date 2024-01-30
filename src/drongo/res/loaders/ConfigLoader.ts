import { AssetManager, BufferAsset, assetManager } from "cc";
import { ConfigManager } from "../../configs/ConfigManager";
import { ConfigUtils } from "../../configs/ConfigUtils";
import { IConfigAccessor } from "../../configs/core/IConfigAccessor";
import { Debuger } from "../../debugers/Debuger";
import { Event } from "../../events/Event";
import { EventDispatcher } from "../../events/EventDispatcher";
import { ByteArray } from "../../utils/ByteArray";
import { ILoader } from "../core/ILoader";
import { FullURL, ResURL, URL2Key } from "../core/ResURL";
import { ResManager } from "../res/ResManager";
import { ResourceImpl } from "../res/ResourceImpl";



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
                    this.Emit(Event.ERROR, { url, err });
                    return;
                }
                bundle.load(FullURL(url), BufferAsset,
                    (finished: number, total: number) => {
                        const progress = finished / total;
                        __this.Emit(Event.PROGRESS, { url, progress });
                    }, (err: Error, asset: any) => {
                        if (err) {
                            __this.Emit(Event.ERROR, err);
                            return;
                        }
                        const urlKey = URL2Key(url);
                        let buffer = asset['_buffer'];
                        let accessor = this.__parseConfig(url.url, buffer);
                        let res: ResourceImpl = new ResourceImpl();
                        res.key = urlKey;
                        res.content = accessor;
                        ResManager.AddRes(res);
                        __this.Emit(Event.COMPLETE, { url });
                    });
            });
        }
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
        let accessorClass: new () => IConfigAccessor;
        let accessor: IConfigAccessor;
        for (let dataIndex = 0; dataIndex < len; dataIndex++) {
            data = ConfigUtils.ParseConfig(titleList, typeList, byte);
            //存取器
            accessorClass=ConfigManager.GetAccessorClass(sheet);
            accessor = new accessorClass();
            if (!accessor) {
                Debuger.Warn(Debuger.DRONGO, "配置表：" + sheet + "未注册存取器！");
                continue;
            }
            accessor.Save(data);
        }
        return accessor;
    }

    Reset(): void {
        this.url = null;
    }
}