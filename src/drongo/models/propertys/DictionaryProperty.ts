import { DEvent } from "../../events/DEvent";
import { ChangedData } from "../ChangedData";
import { IProperty } from "../core/IProperty";
import { DictionaryValue } from "../values/DictionaryValue";


export class DictionaryProperty extends DictionaryValue implements IProperty
{
    key: string;
    
    constructor(key?: string, value?: any) {
        super();
        this.key = key;
        if (value != null && value != undefined) {
            this.SetValue(value);
        }
    }

    protected SendEvent(newValue: any, oldValue: any): void {
        if(this.HasEvent(DEvent.VALUE_CHANGED)){
            this.Emit(DEvent.VALUE_CHANGED,ChangedData.Create(newValue,oldValue,this.key));
        }
    }
}