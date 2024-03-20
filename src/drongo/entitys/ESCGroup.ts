import { Dictionary } from "../containers/Dictionary";
import { ESCEntity } from "./ESCEntity";
import { MatcherAllOf } from "./matchers/MatcherAllOf";
import { MatcherAnyOf } from "./matchers/MatcherAnyOf";
import { MatcherNoneOf } from "./matchers/MatcherNoneOf";

export class ESCGroup {

    /**
     * 全部包含或任意包含
     */
    matcher: MatcherAllOf | MatcherAnyOf;

    /**
     * 不能包含的
     */
    matcherNoneOf: MatcherNoneOf;

    /**
     * 编组所匹配的元素(内部接口)
     */
    _entitys: Dictionary<string, ESCEntity> = new Dictionary<string, ESCEntity>();

    private __id: string;

    constructor(allOrAny: MatcherAllOf | MatcherAnyOf, none?: MatcherNoneOf) {
        this.matcher = allOrAny;
        this.matcherNoneOf = none;
        if (none) {
            this.__id = "id:" + this.matcher.flags + "|" + none.flags;
        } else {
            this.__id = "id:" + this.matcher.flags;
        }
    }

    Destroy(): void {
        this.matcher = null;
        this.matcherNoneOf = null;
        this._entitys = null;
    }
    
    get id(): string {
        return this.__id;
    }
}