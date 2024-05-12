import { Dictionary } from "../containers/Dictionary";
import { ECSEntity } from "./ECSEntity";
import { MatcherAllOf } from "./matchers/MatcherAllOf";
import { MatcherAnyOf } from "./matchers/MatcherAnyOf";
import { MatcherNoneOf } from "./matchers/MatcherNoneOf";



export class ECSMatcher {
    /**
     * 全部包含或任意包含
     */
    matcher: MatcherAllOf | MatcherAnyOf | undefined = undefined;

    /**
     * 不能包含的
     */
    matcherNoneOf: MatcherNoneOf | undefined = undefined;

    /**
     * 编组所匹配的元素(内部接口)
     */
    _entitys: Dictionary<ECSEntity, ECSEntity> = new Dictionary<ECSEntity, ECSEntity>();

    
    constructor(allOrAny: MatcherAllOf | MatcherAnyOf, none?: MatcherNoneOf) {
        this.matcher = allOrAny;
        this.matcherNoneOf = none;
    }

    Destroy(): void {
        this.matcher = undefined;
        this.matcherNoneOf = undefined;
        this._entitys.Clear();
    }
}