
import { GComponent } from "../../../fairygui/GComponent";
import { BaseMediator } from "./BaseMediator";
import { GUIMediator } from "./GUIMediator";


/**
 * 子UI 逻辑划分
 */
export class SubGUIMediator extends BaseMediator {

    /**所属GUI*/
    owner: GUIMediator | null;

    constructor(ui: GComponent | null, owner: GUIMediator | null) {
        super();
        if (ui == null) {
            throw new Error("ui组件为空");
        }
        this.ui = ui;
        this.owner = owner;
        this.inited = true;
    }
    /**
     * 子类必须在构造函数中调用
     */
    Init(): void {

    }

    Show(data: any): void {
        super.Show(data);
    }

    Hide(): void {
        super.Hide();
    }

    Destroy(): void {
        super.Destroy();
        this.owner = null;
        this.ui = null;
    }
}
