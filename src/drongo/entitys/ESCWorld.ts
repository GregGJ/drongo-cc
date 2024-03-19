import { Dictionary } from "../containers/Dictionary";
import { ESCComponent } from "./ESCComponent";
import { ESCEntity } from "./ESCEntity";
import { ESCGroup } from "./ESCGroup";
import { ESCSystem } from "./ESCSystem";



export class ESCWorld {

    /**组件 */
    private __components: Dictionary<number, Array<ESCComponent>>;

    /**实体*/
    private __entitys: Dictionary<string, ESCEntity>;

    /**系统*/
    private __systems: ESCSystem[];

    constructor() {
        this.__components = new Dictionary<number, Array<ESCComponent>>();
        this.__entitys = new Dictionary<string, ESCEntity>();
        this.__systems = [];
    }

    /**
     * 心跳驱动
     * @param time 
     */
    public Tick(time: number): void {
        for (let system of this.__systems) {
            system.Tick(time);
        }
    }

    /**
     * 创建一个实体
     */
    CreateEntity(id: string): ESCEntity {
        let entity: ESCEntity = new ESCEntity(id, this);
        this.__entitys.Set(entity.id, entity);
        return entity;
    }

    /**
     * 通过ID获取实体
     * @param id 
     */
    GetEntity(id: string): ESCEntity {
        return this.__entitys.Get(id);
    }

    /**
     * 添加系统 
     */
    AddSystem(value: ESCSystem): void {
        let index: number = this.__systems.indexOf(value);
        if (index >= 0) {
            throw new Error("重复添加系统");
        }
        this.__systems.push(value);
        //按照编组规则匹配
        this._matcherGroup(value._group);
    }


    /**
     * 删除系统
     * @param value 
     */
    RemoveSystem(value: ESCSystem): void {
        let index: number = this.__systems.indexOf(value);
        if (index < 0) {
            throw new Error("找不到要删除的系统");
        }
        this.__systems.splice(index, 1);
        //回收
        ESCGroup.Recycle(value._group);
    }

    /**
     * 根据类型获取组件列表
     * @param type 
     */
    GetComponent(type: number): ESCComponent[] {
        return this.__components.Get(type);
    }

    //=====================================内部接口=======================================================//


    _matcherGroup(group: ESCGroup): void {
        let comList: Array<ESCComponent>;
        let minList: Array<ESCComponent>;
        //通过主匹配规则筛选出最短的
        for (let index = 0; index < group.matcher.elements.length; index++) {
            const type = group.matcher.elements[index];
            if (!comList) {
                continue;
            }
            comList = this.GetComponent(type);
            if (minList == null) {
                minList = comList;
            } else {
                if (comList.length < minList.length) {
                    minList = comList;
                }
            }
        }
        if (!minList) {
            return;
        }
        //根据最少的组件数量来进行匹配
        let com: ESCComponent;
        for (let index = 0; index < minList.length; index++) {
            com = minList[index];
            if (com.entity._matcherGroup(group)) {
                group._entitys.Set(com.entity.id, com.entity);
            }
        }
    }

    /**
     * 内部接口，请勿调用
     * @param com 
     */
    _addComponent(com: ESCComponent): void {
        let list: ESCComponent[] = this.__components.Get(com.type);
        if (list == null) {
            list = [];
            this.__components.Set(com.type, list);
        }
        let index: number = list.indexOf(com);
        if (index >= 0) {
            throw new Error("重复添加组件！");
        }
        list.push(com);
        for (let index = 0; index < this.__systems.length; index++) {
            const system = this.__systems[index];
            //已经在里面了，就不管这个组了
            if (system._group._entitys.Has(com.entity.id)) {
                continue;
            }
            if (com.entity._matcherGroup(system._group)) {
                system._group._entitys.Set(com.entity.id, com.entity);
            }
        }
    }

    /**
     * 内部接口，请勿调用
     * @param com 
     */
    _removeComponent(com: ESCComponent): void {
        let list: ESCComponent[] = this.__components.Get(com.type);
        if (list == null) {
            return;
        }
        let index: number = list.indexOf(com);
        if (index < 0) {
            throw new Error("找不到要删除的组件");
        }
        list.splice(index, 0);
        for (let index = 0; index < this.__systems.length; index++) {
            const system = this.__systems[index];
            if (system._group._entitys.Has(com.entity.id)) {
                system._group._entitys.Delete(com.entity.id);
            }
        }
    }

    /**
     * 内部接口，请勿调用
     * @param value 
     */
    _removeEntity(value: ESCEntity): void {
        if (!this.__entitys.Has(value.id)) {
            throw new Error("找不到要删除的entity:" + value.id);
        }
        this.__entitys.Delete(value.id);
    }
}