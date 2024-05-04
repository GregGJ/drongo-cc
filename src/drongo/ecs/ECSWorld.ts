import { Dictionary } from "../containers/Dictionary";
import { ECSComponent } from "./ECSComponent";
import { ECSMatcher } from "./ECSMatcher";
import { ECSSystem } from "./ECSSystem";
import { ECSStorage } from "./ECSStorage";
import { Matcher } from "./matchers/Matcher";
import { MatcherAllOf } from "./matchers/MatcherAllOf";
import { MatcherAnyOf } from "./matchers/MatcherAnyOf";
import { ECSEntity } from "./ECSEntity";



export class ECSWorld {

    private __freeEntitys: Array<ECSEntity> = [];

    private __maxCount: number;
    private __countIndex: number = -1;

    private __storage: ECSStorage<ECSEntity, ECSComponent>;

    private __systems: Dictionary<new () => ECSSystem, ECSSystem>;

    /**等待删除的entity*/
    private __waitFree: Array<ECSEntity> = [];

    private __time: number = 0;

    /**
     * 初始化
     * @param maxCount 
     * @param sparsePage 
     */
    constructor(maxCount: number, sparsePage: number = 4) {
        this.__maxCount = maxCount;
        this.__storage = new ECSStorage<ECSEntity, ECSComponent>(this.__maxCount, sparsePage);
        this.__systems = new Dictionary<new () => ECSSystem, ECSSystem>();
    }

    /**
     * 心跳
     * @param dt 
     */
    Tick(dt: number): void {
        this.__time += dt;
        //系统
        const systems = this.__systems.elements;
        for (let index = 0; index < systems.length; index++) {
            const sys = systems[index];
            sys.Tick(this.__time);
        }
        if (this.__waitFree.length == 0) return;
        //删除
        for (let index = 0; index < this.__waitFree.length; index++) {
            const entity = this.__waitFree[index];
            this.__storage.Remove(entity);
            this.__freeEntitys.push(entity);
            //从所有系统匹配纪律中删除
            for (let index = 0; index < systems.length; index++) {
                const sys = systems[index];
                sys._matcher._entitys.delete(entity);
            }
        }
        this.__waitFree.length = 0;
    }

    /**
     * 创建
     */
    Create(): ECSEntity {
        let result: ECSEntity;
        if (this.__freeEntitys.length > 0) {
            result = this.__freeEntitys.pop()!;
        } else {
            this.__countIndex++;
            if (this.__countIndex >= this.__maxCount) {
                throw new Error("超出最大数量:" + (this.__countIndex + 1) + "/" + this.__maxCount);
            }
            result = this.__countIndex;
        }
        this.__storage.Add(result);
        return result;
    }

    /**
     * 查询是否包含entity
     * @param entity 
     * @returns 
     */
    Has(entity: ECSEntity): boolean {
        return this.__storage.Has(entity);
    }

    /**
     * 删除entity
     * @param entity 
     * @returns 
     */
    Remove(entity: ECSEntity): void {
        const index = this.__waitFree.indexOf(entity);
        if (index >= 0) {
            return;
        }
        this.__waitFree.push(entity);
    }


    /**
     * 添加组件
     * @param entity 
     * @param type 
     * @returns 
     */
    AddComponent<T extends ECSComponent>(entity: ECSEntity, type: new () => T): T {
        let result = this.__storage.AddValue(entity, type);
        result.dirtySignal = () => {
            this.__componentDirty(result);
        }
        //检测组件依赖的系统，如果没有则添加
        const dependencies = result.GetDependencies();
        if (dependencies && dependencies.length > 0) {
            for (let index = 0; index < dependencies.length; index++) {
                const sysClass = dependencies[index];
                if (!this.HasSystem(sysClass)) {
                    this.AddSystem(sysClass);
                }
            }
        }
        //记录所属
        result.entity = entity;
        //匹配
        this.__matcher(result.entity, false, true);
        return result;
    }

    /**
     * 查询entity是否包含组件 
     * @param entity 
     * @param type 
     * @returns 
     */
    HasComponent<T extends ECSComponent>(entity: ECSEntity, type: new () => T): boolean {
        return this.__storage.HasValue(entity, type);
    }

    /**
     * 删除组件
     * @param entity 
     * @param type 
     * @returns 
     */
    RemoveComponent<T extends ECSComponent>(entity: ECSEntity, type: new () => T): T {
        let result = this.__storage.RemoveValue(entity, type);
        this.__matcher(result.entity, false, true);
        return result;
    }

    /**
     * 通过组件实例进行删除
     * @param entity 
     * @param com 
     * @returns 
     */
    RemoveComponentBy<T extends ECSComponent>(entity: ECSEntity, com: ECSComponent): T {
        let result = this.__storage.RemoveValue(entity, com["constructor"] as new () => T);
        this.__matcher(result.entity, false, true);
        return result;
    }

    /**
     * 获取组件
     * @param entity 
     * @param type 
     * @returns 
     */
    GetComponent<T extends ECSComponent>(entity: ECSEntity, type: new () => T): T | null {
        return this.__storage.GetValue(entity, type);
    }

    /**
     * 添加系统 
     */
    AddSystem(sysClass: new () => ECSSystem): void {
        if (this.__systems.Has(sysClass)) {
            throw new Error("重复添加系统");
        }
        const sys = new sysClass();
        sys.SetWorld(this);
        this.__systems.Set(sysClass, sys);
        //根据系统优先级排序
        this.__systems.elements.sort((a, b) => a.priority - b.priority);
        //按照编组规则匹配
        this.__matcherAll(sys);
    }

    /**
     * 是否包含该系统
     * @param key 
     * @returns 
     */
    HasSystem(key: new () => ECSSystem): boolean {
        return this.__systems.Has(key);
    }

    /**
     * 获取系统
     * @param key 
     * @returns 
     */
    GetSystem(key: new () => ECSSystem): ECSSystem | undefined {
        return this.__systems.Get(key);
    }

    /**
     * 删除系统
     * @param value 
     */
    RemoveSystem(value: ECSSystem): void {
        const sysClass = value.constructor as new () => ECSSystem;
        if (!this.__systems.Has(sysClass)) {
            throw new Error("找不到要删除的系统");
        }
        this.__systems.Delete(sysClass);
        value.SetWorld(null);
        value.Destory();
        //根据系统优先级排序
        this.__systems.elements.sort((a, b) => a.priority - b.priority);
    }


    /**
     * 清理所有元素
     */
    ClearAll(): void {
        this.__countIndex = -1;
        this.__time = 0;
        this.__storage.Clear();
        const systems = this.__systems.elements;
        for (let index = 0; index < systems.length; index++) {
            const sys = systems[index];
            sys.Destory();
        }
        this.__systems.Clear();
    }
    
    Destroy(): void {
        this.ClearAll();
        this.__freeEntitys.length = 0;
        this.__freeEntitys = null;
        this.__waitFree.length = 0;
        this.__waitFree = null;
        this.__storage.Destroy();
        this.__storage = null;
        this.__systems = null;
    }

    /**当前时间 */
    get time(): number {
        return this.__time;
    }

    /**标记组件脏了 */
    private __componentDirty(component: ECSComponent): void {
        this.__matcher(component.entity, true);
    }


    /**将所有entity跟系统进行匹配 */
    private __matcherAll(sys: ECSSystem): void {
        let list = this.__storage.elements;
        for (let index = 0; index < list.length; index++) {
            const entity = list[index];
            if (entity == this.__storage.invalid) {
                break;
            }
            this.__matcherEntity(sys._matcher, entity);
        }
    }

    private __matcher(entity: ECSEntity, useDirty: boolean, all: boolean = false): void {
        const systems = this.__systems.elements;
        for (let index = 0; index < systems.length; index++) {
            const sys = systems[index];
            if (sys.useDirty == useDirty || all) {
                if (this.__matcherEntity(sys._matcher, entity)) {
                    sys._matcher._entitys.add(entity);
                } else {
                    sys._matcher._entitys.delete(entity);
                }
            }
        }
    }

    private __matcherEntity(matcher: ECSMatcher, entity: ECSEntity): boolean {
        let mainMatcher: boolean = this.__matcherComponents(matcher.matcher!, entity);
        let noneMatcher = matcher.matcherNoneOf == undefined ? true : this.__matcherComponents(matcher.matcherNoneOf, entity);
        return mainMatcher && noneMatcher;
    }

    private __matcherComponents(matcher: Matcher, entity: ECSEntity): boolean {
        if (matcher instanceof MatcherAllOf) {
            for (let index = 0; index < matcher.types.length; index++) {
                const comType = matcher.types[index];
                if (!this.__storage.HasValue(entity, comType)) {
                    return false;
                }
            }
            return true;
        } else if (matcher instanceof MatcherAnyOf) {
            for (let index = 0; index < matcher.types.length; index++) {
                const comType = matcher.types[index];
                if (this.__storage.HasValue(entity, comType)) {
                    return true;
                }
            }
            return false;
        }
        //排除
        for (let index = 0; index < matcher.types.length; index++) {
            const comType = matcher.types[index];
            if (this.__storage.HasValue(entity, comType)) {
                return false;
            }
        }
        return true;
    }
}