import { Color, Node } from "cc";
import { ResURL } from "./drongo/res/ResURL";
import { Injector } from "./drongo/utils/Injector";
import { TickerManager } from "./drongo/ticker/TickerManager";
import { TickerManagerImpl } from "./drongo/impls/TickerManagerImpl";
import { Timer } from "./drongo/timer/Timer";
import { TimerImpl } from "./drongo/impls/TimerImpl";
import { Res } from "./drongo/res/Res";
import { ResImpl } from "./drongo/impls/ResImpl";


export class Drongo {

    /**
     * UI资源AssetBundle
     */
    static UIBundle: string = "UI";
    
    /**
     * UI遮罩颜色值
     */
    static MaskColor: Color = new Color(0, 0, 0, 255 * 0.5);

    static Init(root: Node, guiconfig: ResURL, layer: { layers: Array<string>, fullScrene: Array<string> }, sheetConfig: { preURL: string, bundle: string }, callback: () => void): void {


        //ticker
        Injector.Inject(TickerManager.KEY,TickerManagerImpl);
        //timer
        Injector.Inject(Timer.KEY,TimerImpl);
        //res
        Injector.Inject(Res.KEY,ResImpl);
    }
}