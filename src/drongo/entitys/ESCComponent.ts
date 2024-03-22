import { ESCEntity } from "./ESCEntity";



export class ESCComponent {

    static TYPES: Map<new () => ESCComponent, number> = new Map<new () => ESCComponent, number>();

    static TYPE_IDX: number = 0;

    static GetType(value: new () => ESCComponent): number {
        if (this.TYPES.has(value)) {
            return this.TYPES.get(value);
        }
        this.TYPE_IDX++;
        let result=Math.pow(2,this.TYPE_IDX);
        this.TYPES.set(value,result);
        return result;
    }
    
    /**
     * 所属实体
     */
    public entity: ESCEntity;

    constructor(){

    }

    public Destroy(): void {
        
    }
}