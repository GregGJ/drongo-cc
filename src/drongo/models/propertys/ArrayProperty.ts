import { DEvent } from "../../events/DEvent";
import { ChangedData } from "../ChangedData";
import { IProperty } from "../core/IProperty";
import { IValue } from "../core/IValue";
import { ArrayValue } from "../values/ArrayValue";
import { DictionaryValue } from "../values/DictionaryValue";



export class ArrayProperty extends ArrayValue implements IProperty {
    key: string;

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

    /**
     * 判断某个子内容的某个属性相同则返回true
     */
    ContainProperty(value: IProperty): Boolean {
        let item: IValue;
        let findValue: IValue;
        for (let j: number = 0; j < this.length; j++) {
            item = this.elements[j];
            if (item instanceof DictionaryValue) {
                findValue = item.Get(value.key);
                if (findValue.Equality(value)) {
                    return true;
                }
            }
        }
        return false;
    }
}