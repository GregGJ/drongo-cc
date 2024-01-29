import { GComponent } from "../../../fairygui/GComponent";
import { ILayer } from "../core/layer/ILayer";


export class Layer extends GComponent implements ILayer {

    isFullScrene:boolean;
    openRecord:Array<string>;
    constructor(name: string,isFullScrene:boolean=false) {
        super();
        this.node.name = name;
        this.isFullScrene=isFullScrene;
        this.openRecord=[];
        this.makeFullScreen();
    }

    AddChild(child: any): void {
        this.addChild(child);
    }

    AddChildAt(child: any, index: number): void {
        this.addChildAt(child,index);
    }

    RemoveChild(child: any): void {
        this.removeChild(child);
    }
    
    RemoveChildAt(index: number): void {
        this.removeChildAt(index);
    }

    GetChildAt(index: number) {
        return this.getChildAt(index);
    }
    
    GetCount(): number {
        return this.numChildren;
    }
}