import { ESCEntity } from "./ESCEntity";



export class ESCComponent {

    /**
     * 所属实体
     */
    public entity: ESCEntity;

    /**
     * 类型
     */
    public get type(): number {
        return 0;
    }

    public dispose(): void {
        
    }
}