import { BitFlag } from "../../utils/BitFlag";
import { ESCComponent } from "../ESCComponent";
import { IMatcher } from "./IMatcher";




export class Matcher extends BitFlag implements IMatcher {

    types: Array<new () => ESCComponent>;

    constructor(types: Array<new () => ESCComponent>) {
        super();
        this.types = types;
        for (let index = 0; index < types.length; index++) {
            const flag = ESCComponent.GetType(types[index]);
            this.Add(flag);
        }
    }
}