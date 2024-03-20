import { Dictionary } from "../containers/Dictionary";
import { MatcherAllOf } from "./matchers/MatcherAllOf";
import { BitFlag } from "../utils/BitFlag";
import { ESCComponent } from "./ESCComponent";
import { ESCGroup } from "./ESCGroup";
import { ESCWorld } from "./ESCWorld";




export class ESCEntity {

    private __components: Dictionary<number, Array<ESCComponent>>;

    private __world: ESCWorld;

    private __id: string;

    private __componentFlags: BitFlag;

    constructor(id: string, world: ESCWorld) {
        this.__id = id;
        this.__world = world;
        this.__components = new Dictionary<number, Array<ESCComponent>>();
        this.__componentFlags = new BitFlag();
    }
    
    /**
     * 添加组件
     * @param value
     */
    AddComponent(value: ESCComponent): ESCComponent {
        let list: Array<ESCComponent> = this.__components.Get(value.type);
        if (list) {
            let index: number = list.indexOf(value);
            if (index >= 0) {
                throw new Error("重复添加Component到Entity");
            }
        } else {
            list = [];
            this.__components.Set(value.type, list);
        }
        let world: boolean = true;
        //如果已经在实体上
        if (value.entity) {
            value.entity.__removeComponent(value, false);
            world = false;
        }
        value.entity = this;
        list.push(value);
        this.__componentFlags.Add(value.type);
        if (world) {
            this.__world._addComponent(value);
        }
        return value;
    }

    /**
     * 删除组件
     * @param id 
     */
    RemoveComponent(value: ESCComponent): void {
        this.__removeComponent(value, true);
    }

    /**
     * 获取组件
     * @param type 
     */
    GetComponent(type: number): ESCComponent {
        let list: Array<ESCComponent> = this.__components.Get(type);
        if (list && list.length > 0) {
            return list[0];
        }
        return null;
    }

    /**
     * 获取组件列表
     * @param type 
     * @returns 
     */
    GetComponents(type: number): Array<ESCComponent> {
        return this.__components.Get(type);
    }

    private __removeComponent(value: ESCComponent, world: boolean): void {
        let list: Array<ESCComponent> = this.__components.Get(value.type);
        if (list == null && list.length == 0) {
            throw new Error("该组件不是属于Entity:" + this.__id);
        }
        let index: number = list.indexOf(value);
        if (index < 0) {
            throw new Error("该组件不是属于Entity:" + this.__id);
        }
        this.__componentFlags.Remove(value.type);
        if (world) {
            this.__world._removeComponent(value);
        }
        list.splice(index, 1);
        value.entity = null;
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
    Dispose(): void {
        //从世界中删除组件记录
        let components: Array<Array<ESCComponent>> = this.__components.elements;
        let comList: Array<ESCComponent>;
        let com: ESCComponent;
        for (let index = 0; index < components.length; index++) {
            comList = components[index];
            for (let index = 0; index < comList.length; index++) {
                com = comList[index];
                this.__world._removeComponent(com);
                com.Dispose();
            }
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