import { TickerManager } from "../ticker/TickerManager";
import { StringUtils } from "../utils/StringUtils";
import { SerializationMode } from "./SerializationMode";
import { DictionaryValue } from "./values/DictionaryValue";


export class BaseModel {

    /**
     * 是否是新玩家
     */
    isNewPlayer: boolean;
    /**
     * 是否开启调试日志
     */
    debugLog: boolean = false;

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
    SavePlayerPrefs(now: boolean = false): void {
        if (now) {
            this.__save();
        } else {
            TickerManager.CallNextFrame(this.__save, this);
        }
    }

    private __save(): void {
        let data: any = this.__playerPrefs.Encode(SerializationMode.JSON);
        let jsonStr = JSON.stringify(data, null, 4)
        if (this.debugLog) {
            console.log(jsonStr);
        }
        localStorage.setItem(this.uuid, jsonStr);
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
                if (this.debugLog) {
                    console.log(jsonStr);
                }
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