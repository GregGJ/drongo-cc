import { StringUtils } from "../utils/StringUtils";
import { SerializationMode } from "./SerializationMode";
import { DictionaryValue } from "./values/DictionaryValue";


export class BaseModel {

    /**
     * 是否是新玩家
     */
    isNewPlayer: boolean;

    gameName: string;
    userID: string;

    /**
     * 游戏存档
     */
    private __playerPrefs: DictionaryValue;

    constructor(gameName: string, userID: string) {
        this.gameName = gameName;
        this.userID = userID;
        this.__playerPrefs = new DictionaryValue();
    }

    /**
     * 游戏存档
     */
    get playerPrefs(): DictionaryValue {
        return this.__playerPrefs;
    }

    /**
     * 清空游戏存档
     */
    ClearPlayerPrefs(): void {
        localStorage.setItem(this.uuid, "");
        if (this.__playerPrefs) {
            this.__playerPrefs.Clear();
        }
    }

    /**
     * 保存游戏存档
     */
    SavePlayerPrefs(): void {
        let data: any = this.__playerPrefs.Encode(SerializationMode.JSON);
        localStorage.setItem(this.uuid, JSON.stringify(data));
    }

    /**
     * 从本地读取存档
     */
    ReadByLoacl(): void {
        this.__playerPrefs.Clear();
        let jsonStr: string = localStorage.getItem(this.uuid);
        if (StringUtils.IsEmpty(jsonStr)) {
            this.isNewPlayer = true;
        } else {
            try {
                let jsonData: any = JSON.parse(jsonStr);
                this.__playerPrefs.Decode(SerializationMode.JSON, jsonData);
                this.isNewPlayer = false;
            } catch (error) {
                this.isNewPlayer = true;
            }
        }
        if (this.isNewPlayer) {
            this.SetDefaultPropertys();
        }
        this.OnReadComplete();
    }

    /**
     * 数据读取完成
     */
    protected OnReadComplete(): void {

    }

    /**
     * 默认数据填充
     */
    protected SetDefaultPropertys(): void {
        
    }

    get uuid(): string {
        return this.gameName + "_" + this.userID;
    }
}