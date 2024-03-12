import { ModelEvent } from "../ModelEvent";
import { IProperty } from "../core/IProperty";
import { StringValue } from "../values/StringValue";



export class StringProperty extends StringValue implements IProperty {

    key: string;

    constructor(key?: string, value?: any) {
        super();
        this.key = key;
        if (value != null && value != undefined) {
            this.SetValue(value);
        }
    }

    protected SendEvent(newValue: any, oldValue: any): void {
        if (this.HasEvent(ModelEvent.VALUE_CHANGED)) {
            this.Emit(ModelEvent.VALUE_CHANGED, ModelEvent.Create(newValue, oldValue, this.key));
        }
    }
}