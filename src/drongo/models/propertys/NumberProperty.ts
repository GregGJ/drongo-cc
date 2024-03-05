import { ModelEvent } from "../ModelEvent";
import { IProperty } from "../core/IProperty";
import { NumberValue } from "../values/NumberValue";



export class NumberProperty extends NumberValue implements IProperty
{
    key: string;
    
    constructor(){
        super();
    }

    protected SendEvent(newValue: any, oldValue: any): void {
        if(this.HasEvent(ModelEvent.VALUE_CHANGED)){
            this.Emit(ModelEvent.VALUE_CHANGED,ModelEvent.Create(newValue,oldValue,this.key));
        }
    }
}