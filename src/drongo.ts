import { BufferAsset, Color, JsonAsset, Node } from "cc";
import { ConfigManager } from "./drongo/configs/ConfigManager";
import { GUIManager } from "./drongo/gui/GUIManager";
import { LayerManager } from "./drongo/gui/core/layer/LayerManager";
import { Layer } from "./drongo/gui/layer/Layer";
import { Res } from "./drongo/res/Res";
import { ResRef } from "./drongo/res/core/ResRef";
import { ResURL, URL2Key } from "./drongo/res/core/ResURL";
import { TickerManager } from "./drongo/ticker/TickerManager";
import { GRoot } from "./fairygui/GRoot";
import { FGUILoader } from "./drongo/res/loaders/FGUILoader";
import { ConfigLoader } from "./drongo/res/loaders/ConfigLoader";


export class Drongo {

    /**UI资源AssetBundle */
    public static UIBundle: string = "UI";

    /**UI遮罩颜色值 */
    public static MaskColor: Color = new Color(0, 0, 0, 255 * 0.5);

    /**
     * 初始化
     * @param root          fgui根节点
     * @param callback      回调
     * @param guiconfig     UI配置
     * @param layer         层级配置
     * @param sheetBundle   配置表AssetBundle包
     */
    static Init(root: Node, callback: () => void, guiconfig?: ResURL, layer?: { layers: Array<string>, fullScrene: Array<string> }, sheetBundle: string = "Configs"): void {
        //注册fgui加载器
        Res.SetResLoader("fgui", FGUILoader);
        Res.SetResLoader("config", ConfigLoader);

        GRoot.create(root);

        //路径转换
        if (sheetBundle) {
            if (ConfigManager.Sheet2URL == null) {
                ConfigManager.Sheet2URL = (sheet: string) => {
                    return { url: sheet, type: "config", bundle: sheetBundle };
                }
            }
            if (ConfigManager.URL2Sheet == null) {
                ConfigManager.URL2Sheet = (url: ResURL) => {
                    if (typeof url == "string") {
                        return url;
                    }
                    return url.url;
                }
            }
        }
        //创建层级
        if (layer == null) {
            let layers = [
                "BattleDamage",
                "FullScreen",
                "Window",
                "Pannel",
                "Tooltip",
                "Alert",
                "Guide",
                "LoadingView"
            ]
            let fullScrene = [
                "FullScreen"
            ]
            layer = { layers, fullScrene };
        }
        if (layer.layers && layer.layers.length > 0) {
            for (let index = 0; index < layer.layers.length; index++) {
                const layerKey = layer.layers[index];
                if (layer.fullScrene && layer.fullScrene.length > 0) {
                    LayerManager.AddLayer(layerKey, new Layer(layerKey, layer.fullScrene.indexOf(layerKey) >= 0));
                } else {
                    LayerManager.AddLayer(layerKey, new Layer(layerKey))
                }
            }
        }

        //加载guiconfig.json
        if (guiconfig == null) {
            guiconfig = { url: "guiconfig", type: JsonAsset, bundle: "Configs" }
        }
        Res.GetResRef(guiconfig, "Drongo").then(
            (result: ResRef) => {
                let list = result.content.json;
                for (let index = 0; index < list.length; index++) {
                    const element = list[index];
                    GUIManager.Register(element);
                }
                callback();
            }, (reason) => {
                throw new Error("初始化引擎出错,gui配置加载错误:" + URL2Key(guiconfig));
            }
        )
    }

    /**
     * 总心跳驱动接口
     * @param dt 
     */
    static Tick(dt: number): void {
        TickerManager.Tick(dt);
    }
}