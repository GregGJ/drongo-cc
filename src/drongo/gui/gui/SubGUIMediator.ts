
import { GComponent } from "../../../fairygui/GComponent";
import { BaseMediator } from "./BaseMediator";
import { GUIMediator } from "./GUIMediator";


/**
 * 子UI 逻辑划分
 */
export class SubGUIMediator extends BaseMediator {

    /**所属GUI*/
    owner: GUIMediator;

    constructor(ui: GComponent, owner: GUIMediator) {
        super();
        this.ui = ui;
        this.owner = owner;
        this.Init();
        this.inited = true;
    }

    Destroy(): void {
        super.Destroy();
        this.owner = null;
        this.ui=null;
    }
}
