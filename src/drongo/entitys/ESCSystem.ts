import { MatcherAllOf } from "./matchers/MatcherAllOf";
import { MatcherAnyOf } from "./matchers/MatcherAnyOf";
import { MatcherNoneOf } from "./matchers/MatcherNoneOf";
import { ESCGroup } from "./ESCGroup";
import { ESCWorld } from "./ESCWorld";


export class ESCSystem {

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

    Tick(time: number): void {

    }

    Destory(): void {
        this._group.Destroy();
        this._group = null;
        this.world = null;
    }
}