import { ModelEvent } from "../ModelEvent";
import { IProperty } from "../core/IProperty";
import { IValue } from "../core/IValue";
import { ArrayValue } from "../values/ArrayValue";
import { DictionaryValue } from "../values/DictionaryValue";



export class ArrayProperty extends ArrayValue implements IProperty {
    key: string;

    constructor() {
        super();
    }

    protected SendEvent(newValue: any, oldValue: any): void {
        if (this.HasEvent(ModelEvent.VALUE_CHANGED)) {
            this.Emit(ModelEvent.VALUE_CHANGED, ModelEvent.Create(newValue, oldValue, this.key));
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