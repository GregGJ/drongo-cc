import { Color, Node } from "cc";
import { ResImpl } from "./drongo/impls/ResImpl";
import { TickerManagerImpl } from "./drongo/impls/TickerManagerImpl";
import { TimerImpl } from "./drongo/impls/TimerImpl";
import { Res } from "./drongo/res/Res";
import { TickerManager } from "./drongo/ticker/TickerManager";
import { Timer } from "./drongo/timer/Timer";
import { Injector } from "./drongo/utils/Injector";
import { GRoot } from "./fairygui/GRoot";


export class Drongo {

    /**
     * UI资源AssetBundle
     */
    static UIBundle: string = "UI";

    /**
     * UI遮罩颜色值
     */
    static MaskColor: Color = new Color(0, 0, 0, 255 * 0.5);

    // static Init(root: Node, guiconfig: ResURL, layer: { layers: Array<string>, fullScrene: Array<string> }, sheetConfig: { preURL: string, bundle: string }, callback: () => void): void {

    static Init(root: Node,cb: () => void): void {
        GRoot.create(root);
        
        cb();
    }
}