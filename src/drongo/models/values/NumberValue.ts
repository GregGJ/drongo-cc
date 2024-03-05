import { Debuger } from "../../debugers/Debuger";
import { BaseValue } from "./BaseValue";



/**
 * 数值类型值
 */
export class NumberValue extends BaseValue {

    constructor() {
        super();
    }

    protected CheckValue(value: any): boolean {
        if (isNaN(value)) {
            Debuger.Err(Debuger.DRONGO, "设置非数字类型:" + value);
            return false;
        }
        if (value < Number.MIN_SAFE_INTEGER || value > Number.MAX_SAFE_INTEGER) {
            Debuger.Err(Debuger.DRONGO, "数值:" + value + " 超出number可允许范围!");
            return false;
        }
        return true;
    }
}