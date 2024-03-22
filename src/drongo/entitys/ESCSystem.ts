import { MatcherAllOf } from "./matchers/MatcherAllOf";
import { MatcherAnyOf } from "./matchers/MatcherAnyOf";
import { MatcherNoneOf } from "./matchers/MatcherNoneOf";
import { ESCGroup } from "./ESCGroup";
import { ESCWorld } from "./ESCWorld";
import { ESCEntity } from "./ESCEntity";


export class ESCSystem {

    static HELP_LIST: Array<ESCEntity> = [];
    /**
     * 所属世界
     */
    world: ESCWorld;

    key: string;
    /**
     * 内部接口
     */
    _group: ESCGroup;

    /**
     * 系统
     * @param allOrAny  所有或任意一个包含
     * @param none      不能包含
     */
    constructor(key: string, allOrAny?: MatcherAllOf | MatcherAnyOf, none?: MatcherNoneOf) {
        this.key = key;
        if (allOrAny != undefined || none != undefined) {
            this._group = new ESCGroup(allOrAny, none);
        }
    }

    /**
     * 获取当前状态下匹配到的副本
     * @returns 
     */
    GetEntitys(): Array<ESCEntity> {
        ESCSystem.HELP_LIST.length = 0;
        let list = this._group._entitys.elements;
        for (let index = 0; index < list.length; index++) {
            const entity = list[index];
            ESCSystem.HELP_LIST[index] = entity;
        }
        return ESCSystem.HELP_LIST;
    }

    Tick(time: number): void {

    }

    Destory(): void {
        if (this._group) {
            this._group.Destroy();
            this._group = null;
        }
        this.world = null;
    }
}