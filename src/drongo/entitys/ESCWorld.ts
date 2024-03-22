import { Dictionary } from "../containers/Dictionary";
import { ESCComponent } from "./ESCComponent";
import { ESCEntity } from "./ESCEntity";
import { ESCGroup } from "./ESCGroup";
import { ESCSystem } from "./ESCSystem";



export class ESCWorld {

    /**组件 */
    private __components: Dictionary<new () => ESCComponent, Array<ESCComponent>>;

    /**实体*/
    private __entitys: Dictionary<string, ESCEntity>;

    /**系统*/
    private __systems: Dictionary<string, ESCSystem>;

    private __time: number = 0;
    constructor() {
        this.__components = new Dictionary<new () => ESCComponent, Array<ESCComponent>>();
        this.__entitys = new Dictionary<string, ESCEntity>();
        this.__systems = new Dictionary<string, ESCSystem>();
    }

    /**
     * 心跳驱动
     * @param time 
     */
    public Tick(time: number): void {
        this.__time += time;
        let list = this.__systems.elements;
        for (let index = 0; index < list.length; index++) {
            const sys = list[index];
            sys.Tick(time);
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
     * 获取所有元素
     * @returns 
     */
    GetEntitys(): Array<ESCEntity> {
        return this.__entitys.elements;
    }

    /**
     * 添加系统 
     */
    AddSystem(value: ESCSystem): void {
        if (this.__systems.Has(value.key)) {
            throw new Error("重复添加系统");
        }
        value.world = this;
        this.__systems.Set(value.key, value);
        if (!value._group) {
            return;
        }
        //按照编组规则匹配
        this._matcherGroup(value._group);
    }

    /**
     * 获取系统
     * @param key 
     * @returns 
     */
    GetSystem(key: string): ESCSystem | undefined {
        return this.__systems.Get(key);
    }

    /**
     * 获取系统列表
     * @returns 
     */
    GetSystems(): Array<ESCSystem> {
        return this.__systems.elements;
    }

    /**
     * 删除系统
     * @param value 
     */
    RemoveSystem(value: ESCSystem): void {
        if (!this.__systems.Has(value.key)) {
            throw new Error("找不到要删除的系统");
        }
        this.__systems.Delete(value.key);
        value.world = null;
        value.Destory();
    }

    /**
     * 根据类型获取组件列表
     * @param type 
     */
    GetComponent(type: new () => ESCComponent): ESCComponent[] {
        return this.__components.Get(type);
    }

    /**
     * 销毁
     */
    Destory(): void {
        this.ClearAll();
        this.__entitys = null;
        let systems = this.__systems.elements;
        for (let index = 0; index < systems.length; index++) {
            const sys = systems[index];
            sys.Destory();
        }
        this.__systems.Clear();
        this.__systems = null;
    }

    /**
     * 清理所有元素
     */
    ClearAll(): void {
        let list = this.__entitys.elements;
        while (list.length) {
            const entity = list[0];
            entity.Destroy();
        }
        this.__entitys.Clear();
    }

    get time(): number {
        return this.__time;
    }
    //=====================================内部接口=======================================================//


    _matcherGroup(group: ESCGroup): void {
        let comList: Array<ESCComponent>;
        let minList: Array<ESCComponent>;
        //通过主匹配规则筛选出最短的
        for (let index = 0; index < group.matcher.elements.length; index++) {
            const type = group.matcher.types[index];
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
    _addComponent(type: new () => ESCComponent, com: ESCComponent): void {
        let list: ESCComponent[] = this.__components.Get(type);
        if (list == null) {
            list = [];
            this.__components.Set(type, list);
        }
        let index: number = list.indexOf(com);
        if (index >= 0) {
            throw new Error("重复添加组件！");
        }
        list.push(com);
        let systems = this.__systems.elements;
        for (let index = 0; index < systems.length; index++) {
            const system = systems[index];
            if (!system._group) {
                continue;
            }
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
    _removeComponent(type: new () => ESCComponent, com: ESCComponent): void {
        let list: ESCComponent[] = this.__components.Get(type);
        if (list == null) {
            return;
        }
        let index: number = list.indexOf(com);
        if (index < 0) {
            throw new Error("找不到要删除的组件");
        }
        list.splice(index, 1);
        let systems = this.__systems.elements;
        for (let index = 0; index < systems.length; index++) {
            const system = systems[index];
            if (!system._group) {
                continue;
            }
            if (com.entity._matcherGroup(system._group)) {
                if (!system._group._entitys.Has(com.entity.id)) {
                    system._group._entitys.Set(com.entity.id, com.entity);
                }
            } else {
                if (system._group._entitys.Has(com.entity.id)) {
                    system._group._entitys.Delete(com.entity.id);
                }
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