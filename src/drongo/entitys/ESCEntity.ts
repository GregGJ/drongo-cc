import { Dictionary } from "../containers/Dictionary";
import { BitFlag } from "../utils/BitFlag";
import { ESCComponent } from "./ESCComponent";
import { ESCGroup } from "./ESCGroup";
import { ESCWorld } from "./ESCWorld";
import { MatcherAllOf } from "./matchers/MatcherAllOf";




export class ESCEntity {

    private __components: Dictionary<new () => ESCComponent, ESCComponent>;

    private __world: ESCWorld;

    private __id: string;

    private __componentFlags: BitFlag;

    constructor(id: string, world: ESCWorld) {
        this.__id = id;
        this.__world = world;
        this.__components = new Dictionary<new () => ESCComponent, ESCComponent>;
        this.__componentFlags = new BitFlag();
    }

    /**
     * 添加组件
     * @param value
     */
    AddComponent<T extends ESCComponent>(type: new () => T): T {
        if (this.__components.Has(type)) {
            throw new Error("重复添加Component到Entity");
        }
        let value = new type();
        this.__components.Set(type, value);
        value.entity = this;
        const flag = ESCComponent.GetType(type);
        this.__componentFlags.Add(flag);
        this.__world._addComponent(type, value);
        return value;
    }

    /**
     * 删除组件
     * @param id 
     */
    RemoveComponent<T extends ESCComponent>(type: new () => T): T {
        let result: T = this.__components.Get(type) as T;
        if (!result) {
            return;
        }
        const flag = ESCComponent.GetType(type);
        this.__componentFlags.Remove(flag);
        this.__components.Delete(type);
        this.__world._removeComponent(type, result);
        return result;
    }

    /**
     * 获取组件
     * @param type 
     */
    GetComponent<T extends ESCComponent>(type: new () => T): T {
        return this.__components.Get(type) as T;
    }

    /**
     * 是否包含某类型的组件
     * @param type 
     */
    HasComponent<T extends ESCComponent>(type: new () => T): boolean {
        return this.__components.Has(type);
    }

    /**
     * 唯一ID
     */
    get id(): string {
        return this.__id;
    }

    /**
     * 销毁
     */
    Destroy(): void {
        //从世界中删除组件记录
        let keys = this.__components.getKeys();
        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            const com = this.RemoveComponent(key);
            com.Destroy();
        }
        this.__world._removeEntity(this);
        this.__components = null;
        this.__world = null;
        this.__componentFlags.Destroy();
        this.__componentFlags = null;
    }

    /**
     * 是否符合匹配规则
     * @param group 
     */
    _matcherGroup(group: ESCGroup): boolean {
        let mainMatcher: boolean = false;
        if (group.matcher instanceof MatcherAllOf) {
            if (this.__componentFlags.Has(group.matcher.flags)) {
                mainMatcher = true;
            }
        } else {
            if (this.__componentFlags.flags & group.matcher.flags) {
                mainMatcher = true;
            }
        }
        let noneMatcher: boolean = true;
        if (group.matcherNoneOf) {
            if (this.__componentFlags.flags & group.matcherNoneOf.flags) {
                noneMatcher = false;
            }
        }
        return mainMatcher && noneMatcher;
    }
}