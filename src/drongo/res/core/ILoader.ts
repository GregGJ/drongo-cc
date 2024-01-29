import { IEventDispatcher } from "../../events/IEventDispatcher";
import { ResURL } from "./ResURL";


export interface ILoader extends IEventDispatcher {

    /**
     * 加载
     * @param url 
     */
    Load(url: ResURL): void;

    /**
     * 重置
     */
    Reset(): void;
}