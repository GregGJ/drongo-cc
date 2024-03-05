import { ModelEvent } from "../ModelEvent";
import { IProperty } from "../core/IProperty";
import { DictionaryValue } from "../values/DictionaryValue";


export class DictionaryProperty extends DictionaryValue implements IProperty
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