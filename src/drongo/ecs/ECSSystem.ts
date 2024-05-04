import { ECSEntity } from "./ECSEntity";
import { ECSMatcher } from "./ECSMatcher";
import { ECSWorld } from "./ECSWorld";
import { MatcherAllOf } from "./matchers/MatcherAllOf";
import { MatcherAnyOf } from "./matchers/MatcherAnyOf";
import { MatcherNoneOf } from "./matchers/MatcherNoneOf";



export abstract class ECSSystem {

    /**优先级 */
    priority: number = 0;

    /**是否使用脏数据*/
    useDirty: boolean = false;

    /**匹配器 */
    _matcher: ECSMatcher;

    /**所属世界 */
    private __world: ECSWorld | null = null;
    /**
     * 系统
     * @param allOrAny  匹配所有或任意一个 
     * @param none      不能包含
     * @param useDirty  是否使用脏数据机制
     */
    constructor(allOrAny: MatcherAllOf | MatcherAnyOf, none?: MatcherNoneOf, useDirty: boolean = false) {
        this._matcher = new ECSMatcher(allOrAny, none);
        this.useDirty = useDirty;
    }

    /**设置所属世界 */
    SetWorld(v: ECSWorld): void {
        this.__world = v;
    }

    /**心跳 */
    Tick(time: number): void {
        if (this._matcher._entitys.size == 0) return;
        this.$tick(time);
        if (this.useDirty) {
            this._matcher._entitys.clear();
        }
    }

    /**匹配结果 */
    get entitys(): Set<ECSEntity> {
        return this._matcher._entitys;
    }

    /**所属世界 */
    get world(): ECSWorld {
        return this.__world!;
    }

    protected $tick(time: number): void {

    }

    /**销毁 */
    Destory(): void {
        this.__world = null;
        this._matcher = null;
    }
}