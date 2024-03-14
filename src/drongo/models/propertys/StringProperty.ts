import { DEvent } from "../../events/DEvent";
import { ChangedData } from "../ChangedData";
import { IProperty } from "../core/IProperty";
import { StringValue } from "../values/StringValue";



export class StringProperty extends StringValue implements IProperty {

    key: number | string;

    constructor(key?: string, value?: any) {
        super();
        this.key = key;
        if (value != null && value != undefined) {
            this.SetValue(value);
        }
    }

    protected SendEvent(newValue: any, oldValue: any): void {
        if (this.HasEvent(DEvent.VALUE_CHANGED)) {
            this.Emit(DEvent.VALUE_CHANGED, ChangedData.Create(newValue, oldValue, this.key));
        }
    }
}