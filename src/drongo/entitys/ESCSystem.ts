import { MatcherAllOf } from "./matchers/MatcherAllOf";
import { MatcherAnyOf } from "./matchers/MatcherAnyOf";
import { MatcherNoneOf } from "./matchers/MatcherNoneOf";
import { ESCGroup } from "./ESCGroup";


export class ESCSystem {

    /**
     * 内部接口
     */
    _group: ESCGroup;
    
    /**
     * 系统
     * @param allOrAny  所有或任意一个包含
     * @param none      不能包含
     */
    constructor(allOrAny: MatcherAllOf | MatcherAnyOf, none?: MatcherNoneOf) {
        this._group = ESCGroup.Create(allOrAny, none);
    }

    Tick(time: number): void {

    }
}