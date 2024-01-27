import { Texture2D, SpriteFrame, Asset, Prefab, instantiate, isValid, assetManager } from 'cc';

/**
 * 注入器
 */
class Injector {
    /**类型字典*/
    static __injectedMap = new Map();
    /**实例字典*/
    static __instanceMap = new Map();
    /**
     * 注入
     * @param key
     * @param clazz   类型或实例
     */
    static Inject(customKey, clazz) {
        if (clazz instanceof Function) {
            this.__injectedMap.set(customKey, clazz);
        }
        else {
            this.__instanceMap.set(customKey, clazz);
        }
    }
    /**
     * 获取已注入的类型实例
     */
    static GetInject(customKey) {
        let instance = this.__instanceMap.get(customKey);
        if (instance) {
            return instance;
        }
        let clazz = this.__injectedMap.get(customKey);
        if (clazz === undefined) {
            return null;
        }
        instance = new clazz();
        this.__instanceMap.set(customKey, instance);
        return instance;
    }
}

/**
 * 心跳管理器
 */
class TickerManager {
    static KEY = "drongo.TickerManager";
    /**
     * 心跳驱动接口
     * @param dt
     */
    static Tick(dt) {
        this.impl.Tick(dt);
    }
    /**
     * 添加
     * @param value
     */
    static AddTicker(value) {
        this.impl.AddTicker(value);
    }
    /**
     * 删除
     * @param value
     */
    static RemoveTicker(value) {
        this.impl.RemoveTicker(value);
    }
    /**
     * 下一帧回调
     * @param value
     */
    static CallNextFrame(value, caller) {
        this.impl.CallNextFrame(value, caller);
    }
    /**
     * 清理回调
     * @param value
     * @param caller
     */
    static ClearNextFrame(value, caller) {
        this.impl.ClearNextFrame(value, caller);
    }
    static __impl;
    static get impl() {
        if (this.__impl == null) {
            this.__impl = Injector.GetInject(this.KEY);
        }
        if (this.__impl == null) {
            throw new Error(this.KEY + "未注入!");
        }
        return this.__impl;
    }
}

/**
 * 事件分发器(只有一对多的情况下去使用)
 */
class EventDispatcher {
    /**
    * 对象已经注册的处理器
    */
    callerMap = new Map();
    /**
     * 事件派发器上所监听的处理器
     */
    keyMap = new Map();
    /**
     * 需要派发的事件
     */
    needEmit = [];
    constructor() {
    }
    /**
     * 添加事件
     * @param key
     * @param caller
     * @param func
     * @param priority 优先级（数字越小优先级越高）
     */
    On(key, handler, caller, priority = 0) {
        let infoList;
        let info;
        if (this.keyMap.has(key)) {
            infoList = this.keyMap.get(key);
            for (const iterator of infoList) {
                if (iterator.target == caller && iterator.handler == handler) {
                    console.error("重复添加同一个事件监听：" + key + " " + caller + " " + handler);
                    return;
                }
            }
        }
        else {
            infoList = [];
            this.keyMap.set(key, infoList);
        }
        info = new EventInfo(key, caller, handler);
        infoList.push(info);
        //按照优先级排序
        infoList.sort((a, b) => a.priority - priority);
        //处理器关联处理
        if (this.callerMap.has(caller)) {
            infoList = this.callerMap.get(caller);
            for (const iterator of infoList) {
                if (iterator.key == key && iterator.handler == handler) {
                    console.error("事件系统 处理器关联错误：" + key + " " + caller + " " + handler);
                }
            }
        }
        else {
            infoList = [];
            this.callerMap.set(caller, infoList);
        }
        infoList.push(info);
    }
    /**
     * 删除事件监听
     * @param key
     * @param caller
     * @param handler
     */
    Off(key, handler, caller) {
        if (this.keyMap.has(key) == false) {
            return;
        }
        let infoList = this.keyMap.get(key);
        let info;
        let deleteInfo = null;
        //删除
        for (let index = 0; index < infoList.length; index++) {
            info = infoList[index];
            if (info.target == caller && info.handler == handler) {
                deleteInfo = info;
                infoList.splice(index, 1);
                break;
            }
        }
        if (this.callerMap.has(caller)) {
            infoList = this.callerMap.get(caller);
            //删除
            for (let index = 0; index < infoList.length; index++) {
                info = infoList[index];
                if (info.key == key && info.handler == handler) {
                    deleteInfo = info;
                    infoList.splice(index, 1);
                    break;
                }
            }
        }
        //销毁处理器
        if (deleteInfo) {
            deleteInfo.Destroy();
        }
    }
    /**
     * 删除指定对象所有的事件处理
     * @param caller
     */
    OffByCaller(caller) {
        let infoList = this.callerMap.get(caller);
        if (infoList === undefined || infoList.length == 0) {
            return;
        }
        let info;
        //逐个删除
        while (infoList.length) {
            info = infoList[0];
            this.Off(info.key, info.handler, info.target);
        }
        //删除空列表
        this.callerMap.delete(caller);
    }
    /**
     * 删除所有事件监听
     */
    OffAllEvent() {
        this.keyMap.forEach(infoList => {
            infoList.forEach(info => {
                info.Destroy();
            });
        });
        this.keyMap.clear();
        this.callerMap.clear();
    }
    /**
     * 派发事件
     * @param type
     * @param data
     */
    Emit(type, data) {
        for (let index = 0; index < this.needEmit.length; index++) {
            const element = this.needEmit[index];
            if (element.type == type && element.data === data) {
                return;
            }
        }
        this.needEmit.push({ type, data });
        TickerManager.CallNextFrame(this.__emit, this);
    }
    __emit() {
        for (let index = 0; index < this.needEmit.length; index++) {
            const event = this.needEmit[index];
            if (this.keyMap.has(event.type) == false) {
                continue;
            }
            let infoList = this.keyMap.get(event.type);
            let info;
            for (let index = 0; index < infoList.length; index++) {
                info = infoList[index];
                info.handler.apply(info.target, [event.type, this, event.data]);
            }
        }
        this.needEmit.length = 0;
    }
    /**
     * 是否有事件监听
     * @param key
     */
    HasEvent(key) {
        return this.keyMap.has(key);
    }
    /**
     * 是否包含指定函数事件监听
     * @param key
     * @param caller
     * @param func
     */
    HasEventHandler(key, handler, caller) {
        if (this.keyMap.has(key) == false) {
            return false;
        }
        let infoList = this.keyMap.get(key);
        let info;
        for (let index = 0; index < infoList.length; index++) {
            info = infoList[index];
            if (info.target == caller && info.handler == handler) {
                return true;
            }
        }
        return false;
    }
    Destroy() {
        this.callerMap.clear();
        this.keyMap.clear();
    }
}
class EventInfo {
    key = "";
    target;
    handler;
    priority = 255;
    constructor(key, target, handler) {
        this.key = key;
        this.target = target;
        this.handler = handler;
    }
    Destroy() {
        this.key = null;
        this.target = null;
        this.handler = null;
        this.priority = 0;
    }
}

class Event {
    static START = "start";
    static PROGRESS = "progress";
    static COMPLETE = "complete";
    static ERROR = "error";
    static SHOW = "show";
    static HIDE = "hide";
    static ADD = "add";
    static REMOVE = "remove";
    static UPDATE = "update";
    static CLEAR = "clear";
    static State_Changed = "stateChanged";
    /**事件通道 */
    static channels = new Map();
    /**
     * 获取事件通道
     * @param key
     * @returns
     */
    static GetChannel(key = "main") {
        return this.channels.get(key);
    }
    /**
     * 派发事件
     * @param eventType
     * @param data
     * @param channel   通道
     */
    static Emit(eventType, data, channel = "main") {
        if (!this.channels.has(channel)) {
            return;
        }
        let eventChannel = this.channels.get(channel);
        eventChannel.Emit(eventType, data);
    }
    /**
     * 添加事件监听
     * @param type
     * @param handler
     * @param caller
     * @param priority  优先级
     * @param channel   事件通道
     */
    static On(type, handler, caller, priority = 0, channel = "main") {
        let eventChannel;
        if (!this.channels.has(channel)) {
            eventChannel = new EventDispatcher();
            this.channels.set(channel, eventChannel);
        }
        else {
            eventChannel = this.channels.get(channel);
        }
        eventChannel.On(type, handler, caller, priority);
    }
    /**
     * 删除事件监听
     * @param type
     * @param handler
     * @param caller
     * @param channel
     * @returns
     */
    static Off(type, handler, caller, channel = "main") {
        let eventChannel;
        if (!this.channels.has(channel)) {
            return;
        }
        else {
            eventChannel = this.channels.get(channel);
        }
        eventChannel.Off(type, handler, caller);
    }
    /**
     * 删除指定对象上的所有事件监听
     * @param caller
     * @param channel
     * @returns
     */
    static OffByCaller(caller, channel = "main") {
        let eventChannel;
        if (!this.channels.has(channel)) {
            return;
        }
        else {
            eventChannel = this.channels.get(channel);
        }
        eventChannel.OffByCaller(caller);
    }
    /**
     * 删除指定通道上的所有事件监听
     * @param channel
     * @returns
     */
    static OffAll(channel = "main") {
        let eventChannel;
        if (!this.channels.has(channel)) {
            return;
        }
        else {
            eventChannel = this.channels.get(channel);
        }
        eventChannel.OffAllEvent();
    }
}

/**
 * 字典
 */
class Dictionary extends EventDispatcher {
    __map = new Map();
    __list = [];
    constructor() {
        super();
    }
    /**
     * 设置
     * @param key
     * @param value
     */
    Set(key, value) {
        let old;
        //删除老的
        if (this.__map.has(key)) {
            old = this.__map.get(key);
            const index = this.__list.indexOf(old);
            if (index < 0) {
                throw new Error("Dictionary内部逻辑错误！");
            }
            this.__map.delete(key);
            this.__list.splice(index, 1);
            this.Emit(Event.REMOVE, old);
        }
        this.__map.set(key, value);
        this.__list.push(value);
        this.Emit(Event.ADD, value);
    }
    /**
     * 是否拥有指定KEY的元素
     * @param key
     * @returns
     */
    Has(key) {
        return this.__map.has(key);
    }
    /**
     * 获取指定元素
     * @param key
     * @returns
     */
    Get(key) {
        return this.__map.get(key);
    }
    /**
     * 通过索引获取元素
     * @param index
     * @returns
     */
    GetValue(index) {
        if (index >= this.__list.length) {
            throw new Error(index + "索引超出0-" + this.__list.length + "范围");
        }
        return this.__list[index];
    }
    /**
     * 删除指定元素
     * @param key
     * @returns
     */
    Delete(key) {
        if (!this.__map.has(key)) {
            return undefined;
        }
        const result = this.__map.get(key);
        const index = this.__list.indexOf(result);
        if (index < 0) {
            throw new Error("Dictionary内部逻辑错误！");
        }
        this.__list.splice(index, 1);
        this.__map.delete(key);
        //派发删除事件
        if (this.HasEvent(Event.REMOVE)) {
            this.Emit(Event.REMOVE, result);
        }
        return result;
    }
    /**
     * 清除所有元素
     */
    Clear() {
        this.__map.clear();
        this.__list.length = 0;
    }
    /**
    * 元素列表
    */
    get elements() {
        return this.__list;
    }
    get size() {
        return this.__map.size;
    }
    Destroy() {
        super.Destroy();
        this.__map.clear();
        this.__map = null;
        this.__list = null;
    }
}

/**
 * 列表
 */
class List extends EventDispatcher {
    __element;
    /**
     * 是否保证元素的唯一性
     */
    __only = false;
    /**
     * 元素数量(内部再增删时会修改这个参数，外部只做计算和绑定使用，切记不可做赋值操作！)
     */
    count = 0;
    constructor(only = true) {
        super();
        this.__only = only;
        this.__element = [];
    }
    /**
     * 添加到末尾(注意如果保证唯一性，那么重复时就直接返回)
     * @param value
     */
    Push(value) {
        if (this.__only) {
            let index = this.__element.indexOf(value);
            if (index >= 0) {
                return false;
            }
        }
        this.__element.push(value);
        this.count = this.__element.length;
        if (this.HasEvent(Event.ADD)) {
            this.Emit(Event.ADD, value);
        }
        return true;
    }
    /**
     * 添加到列表头部(注意如果保证唯一性，那么重复时就直接返回)
     * @param value
     * @returns
     */
    Unshift(value) {
        if (this.__only) {
            let index = this.__element.indexOf(value);
            if (index >= 0) {
                return false;
            }
        }
        this.__element.unshift(value);
        this.count = this.__element.length;
        if (this.HasEvent(Event.ADD)) {
            this.Emit(Event.ADD, value);
        }
        return true;
    }
    /**
     * 获取并删除最后一个元素
     * @returns
     */
    Pop() {
        if (this.__element.length > 0) {
            const result = this.__element.pop();
            this.count = this.__element.length;
            if (this.HasEvent(Event.REMOVE)) {
                this.Emit(Event.REMOVE, result);
            }
            return result;
        }
        return null;
    }
    /**
     * 获取并删除第一个元素
     * @returns
     */
    Shift() {
        if (this.__element.length > 0) {
            const result = this.__element.shift();
            this.count = this.__element.length;
            if (this.HasEvent(Event.REMOVE)) {
                this.Emit(Event.REMOVE, result);
            }
            return result;
        }
        return null;
    }
    /**
     * 删除指定索引的元素
     * @param index
     */
    RemoveAt(index) {
        if (index >= this.__element.length) {
            throw new Error("删除索引超出范围！");
        }
        const result = this.__element[index];
        this.__element.splice(index, 1);
        this.count = this.__element.length;
        if (this.HasEvent(Event.REMOVE)) {
            this.Emit(Event.REMOVE, result);
        }
        return result;
    }
    /**
     * 删除元素
     * @param value
     */
    Remove(value) {
        let index = this.__element.indexOf(value);
        if (index < 0) {
            throw new Error("要删除的内容不在列表中！" + value);
        }
        const result = this.__element[index];
        this.__element.splice(index, 1);
        this.count = this.__element.length;
        if (this.HasEvent(Event.REMOVE)) {
            this.Emit(Event.REMOVE, result);
        }
    }
    /**
     * 移除所有元素
     */
    Clear() {
        this.count = 0;
        this.__element.length = 0;
        if (this.HasEvent(Event.CLEAR)) {
            this.Emit(Event.CLEAR);
        }
    }
    /**
     * 判断是否包含
     * @param value
     * @returns
     */
    Has(value) {
        return this.Find(value) >= 0;
    }
    /**
     * 查找元素下标
     * @param value
     * @returns
     */
    Find(value) {
        return this.__element.indexOf(value);
    }
    /**
     * 查找元素下标
     * @param predicate
     * @returns
     */
    FindIndex(predicate) {
        let index = this.__element.findIndex(predicate);
        return index;
    }
    /**
     * 获取指定元素
     * @param index
     * @returns
     */
    Get(index) {
        if (index >= this.__element.length) {
            throw new Error("超出索引范围:" + index + "/" + this.__element.length);
        }
        return this.__element[index];
    }
    /**
     * 源列表数据(注意不要直接进行增删操作，而是通过List.push....等接口进行操作)
     */
    get elements() {
        return this.__element;
    }
}

/**
 * 获取类名
 * @param clazz
 * @returns
 */
function GetClassName(clazz) {
    let className;
    if (typeof clazz != "string") {
        className = clazz.toString();
        className = className.replace("function ", "");
        let index = className.indexOf("()");
        if (index < 0) {
            throw new Error("获取类型名称错误：" + className);
        }
        className = className.substring(0, index);
    }
    else {
        className = clazz;
    }
    return className;
}

/**
 * 资源地址转唯一KEY
 * @param url
 * @returns
 */
function URL2Key(url) {
    return ResURLUtils.URL2Key(url);
}
/**
 * 唯一key转URL
 * @param key
 * @returns
 */
function Key2URL(key) {
    return ResURLUtils.Key2URL(key);
}
/**
 * 获取全路径
 * @param url
 * @returns
 */
function FullURL(url) {
    if (typeof url == "string") {
        return url;
    }
    if (url.type == Texture2D) {
        return url.url + "/texture";
    }
    if (url.type == SpriteFrame) {
        return url.url + "/spriteFrame";
    }
    return url.url;
}
class ResURLUtils {
    static __assetTypes = new Map();
    static getAssetType(key) {
        if (!this.__assetTypes.has(key)) {
            throw new Error("未找到对应资源类型：" + key);
        }
        return this.__assetTypes.get(key);
    }
    /**
     * 获取全路径
     * @param url
     * @returns
     */
    static _getURL(key) {
        let len = key.length;
        let end = len - 8;
        //texture
        let t = key.substring(end);
        if (t === "/texture") {
            return key.substring(0, end);
        }
        //spriteFrame
        end = len - 12;
        t = key.substring(end);
        if (t === "/spriteFrame") {
            return key.substring(0, end);
        }
        return key;
    }
    /**
     * 唯一key转URL
     * @param key
     * @returns
     */
    static Key2URL(key) {
        if (key.indexOf("|")) {
            let arr = key.split("|");
            return { url: this._getURL(arr[0]), bundle: arr[1], type: this.getAssetType(arr[2]) };
        }
        return key;
    }
    /**
     * 资源地址转唯一KEY
     * @param url
     * @returns
     */
    static URL2Key(url) {
        if (url == null || url == undefined) {
            return "";
        }
        if (typeof url == "string") {
            return url;
        }
        if (url.type == SpriteFrame) {
            return url.url + "/spriteFrame" + "|" + url.bundle + "|" + this.getAndSaveClassName(url.type);
        }
        if (url.type == Texture2D) {
            return url.url + "/texture" + "|" + url.bundle + "|" + this.getAndSaveClassName(url.type);
        }
        return url.url + "|" + url.bundle + "|" + this.getAndSaveClassName(url.type);
    }
    static getAndSaveClassName(clazz) {
        let className = GetClassName(clazz);
        if (!this.__assetTypes.has(className)) {
            this.__assetTypes.set(className, clazz);
        }
        return className;
    }
}

/**
 * 计时器工具类
 */
class Timer {
    static KEY = "Timer";
    /**
     * 当前时间(推荐使用)
     */
    static get currentTime() {
        return this.impl.currentTime;
    }
    /**
     * 绝对时间(注意效率较差，不推荐使用！)
     */
    static get absTime() {
        return this.impl.absTime;
    }
    /**
     * 重新校准
     * @param time  时间起点，如果不设置则获取系统当前时间点
     */
    static Reset(time) {
        this.impl.Reset(time);
    }
    static __impl;
    static get impl() {
        if (this.__impl == null) {
            this.__impl = Injector.GetInject(this.KEY);
        }
        if (this.__impl == null) {
            throw new Error(this.KEY + "未注入！");
        }
        return this.__impl;
    }
}

/**
 * 默认资源管理器
 * @internal
 */
class ResManagerImpl {
    /**
     * 资源
     */
    __resDic = new Dictionary();
    /**
     * 等待销毁的资源
     */
    _waitDestroy = [];
    constructor() {
        TickerManager.AddTicker(this);
    }
    Tick(dt) {
        if (ResManager.AUTO_GC) {
            this.GC();
        }
    }
    AddRes(value) {
        if (this.__resDic.Has(value.key)) {
            throw new Error("重复添加资源！");
        }
        this.__resDic.Set(value.key, value);
        //标记为待删除
        this._waitDestroy.push(value);
        value.lastOpTime = Timer.currentTime;
    }
    HasRes(key) {
        return this.__resDic.Has(key);
    }
    _getRes(key) {
        return this.__resDic.Get(key);
    }
    AddResRef(key, refKey) {
        if (!this.__resDic.Has(key)) {
            throw new Error("未找到资源：" + key);
        }
        let res = this.__resDic.Get(key);
        //如果在待删除列表中
        let index = this._waitDestroy.indexOf(res);
        if (index >= 0) {
            this._waitDestroy.splice(index, 1);
        }
        //更新操作时间
        res.lastOpTime = Timer.currentTime;
        return res.AddRef(refKey);
    }
    RemoveResRef(value) {
        if (!this.__resDic.Has(value.key)) {
            throw new Error("未找到资源：" + value.key);
        }
        let res = this.__resDic.Get(value.key);
        res.RemoveRef(value);
        if (res.refLength == 0) {
            //放入待删除列表
            this._waitDestroy.push(res);
        }
        res.lastOpTime = Timer.currentTime;
    }
    GC(ignoreTime) {
        let res;
        let currentTime = Timer.currentTime;
        for (let index = 0; index < this._waitDestroy.length; index++) {
            res = this._waitDestroy[index];
            if (res.refCount > 0) {
                continue;
            }
            //如果忽略时间机制
            if (ignoreTime == true) {
                this._waitDestroy.splice(index, 1);
                this.DestroyRes(res);
                index--;
            }
            else if (currentTime - res.lastOpTime > ResManager.GC_TIME) { //超过允许的时间就回收
                this._waitDestroy.splice(index, 1);
                this.DestroyRes(res);
                index--;
            }
        }
    }
    /**
     * 销毁
     * @param value
     */
    DestroyRes(value) {
        this.__resDic.Delete(value.key);
        value.Destroy();
    }
    get resList() {
        return this.__resDic.elements;
    }
}

/**
 * 资源管理器
 */
class ResManager {
    static KEY = "drongo.ResManager";
    /**
     * 资源保留长时间GC
     */
    static GC_TIME = 15;
    /**
     * 自动清理
     */
    static AUTO_GC = true;
    /**
     * 添加一个资源
     * @param value
     */
    static AddRes(value) {
        this.impl.AddRes(value);
    }
    /**
     * 是否包含该资源
     * @param key
     */
    static HasRes(key) {
        return this.impl.HasRes(key);
    }
    /**
     * 获取资源（内部接口）
     * @param key
     * @returns
     */
    static _getRes(key) {
        return this.impl._getRes(key);
    }
    /**
     * 添加并返回一个资源引用
     * @param key
     * @param refKey
     */
    static AddResRef(key, refKey) {
        return this.impl.AddResRef(key, refKey);
    }
    /**
     * 删除一个资源引用
     * @param value
     */
    static RemoveResRef(value) {
        return this.impl.RemoveResRef(value);
    }
    /**
     * 资源清理
     */
    static GC(ignoreTime) {
        return this.impl.GC(ignoreTime);
    }
    /**
     * 资源列表
     * @returns
     */
    static get resList() {
        return this.impl.resList;
    }
    static __impl;
    static get impl() {
        if (this.__impl == null) {
            this.__impl = Injector.GetInject(this.KEY);
        }
        if (this.__impl == null) {
            this.__impl = new ResManagerImpl();
        }
        return this.__impl;
    }
}

class ResRef {
    /**唯一KEY */
    key = "";
    /**引用KEY */
    refKey;
    /**资源内容 */
    content;
    /**是否已释放 */
    __isDispose = false;
    constructor() {
    }
    /**释放 */
    Dispose() {
        if (this.__isDispose) {
            throw new Error("重复释放资源引用");
        }
        this.__isDispose = true;
        ResManager.RemoveResRef(this);
    }
    get isDispose() {
        return this.__isDispose;
    }
    Reset() {
        this.key = "";
        this.refKey = undefined;
        this.content = null;
        this.__isDispose = false;
    }
    /**
     * 彻底销毁(注意内部接口，请勿调用)
     */
    Destroy() {
        this.key = "";
        this.refKey = undefined;
        this.content = null;
    }
}

class ResourceImpl {
    /**
     * 状态 0 正常 1待删除
     */
    state = 0;
    key = "";
    lastOpTime = 0;
    /**
     * @internal
     */
    __refs = [];
    constructor() {
    }
    set content(value) {
        this.__content = value;
        if (this.__content instanceof Asset) {
            //防止自动回收
            this.__content.addRef();
        }
    }
    __content = null;
    get content() {
        return this.__content;
    }
    AddRef(refKey) {
        let rf = new ResRef();
        rf.key = this.key;
        rf.refKey = refKey;
        if (this.content instanceof Asset) {
            if (this.content instanceof Prefab) {
                rf.content = instantiate(this.content);
            }
            else {
                rf.content = this.content;
            }
            this.content.addRef();
        }
        else {
            rf.content = this.content;
        }
        this.__refs.push(rf);
        return rf;
    }
    RemoveRef(value) {
        let index = this.__refs.indexOf(value);
        if (index < 0) {
            throw new Error("未找到需要删除的引用！");
        }
        if (this.content instanceof Asset) {
            //预制体处理
            if (this.content instanceof Prefab) {
                let node = value.content;
                if (isValid(node)) {
                    node.destroy();
                }
            }
            this.content.decRef();
        }
        this.__refs.splice(index, 1);
        value.Destroy();
    }
    Destroy() {
        if (this.refCount > 0 || this.refLength > 0) {
            throw new Error("发现销毁资源时引用数量不为0");
        }
        //自身引用计数
        if (this.__content instanceof Asset) {
            this.__content.decRef();
            if (this.__content.refCount <= 0) {
                console.log("Res", "资源销毁=>" + this.key);
                assetManager.releaseAsset(this.__content);
            }
        }
        this.key = "";
        this.__refs.length = 0;
        this.__content = null;
    }
    /**
     * 引用数量
     */
    get refCount() {
        if (this.__content instanceof Asset) {
            return this.__content.refCount - 1;
        }
        return this.__refs.length;
    }
    /**
     * 引用列表长度
     */
    get refLength() {
        return this.__refs.length;
    }
}

/**
 * 加载器CC实现
 */
class CCLoaderImpl extends EventDispatcher {
    url;
    constructor() {
        super();
    }
    Load(url) {
        this.url = url;
        if (typeof url == "string") {
            throw new Error("未实现！");
        }
        let bundle = assetManager.getBundle(url.bundle);
        if (!bundle) {
            let __this = this;
            assetManager.loadBundle(url.bundle, (err, bundle) => {
                if (err) {
                    this.Emit(Event.ERROR, { url, err });
                    return;
                }
                bundle.load(FullURL(url), url.type, (progress) => {
                    __this.Emit(Event.PROGRESS, { url, progress });
                }, (err, asset) => {
                    if (err) {
                        __this.Emit(Event.ERROR, err);
                        return;
                    }
                    const urlKey = URL2Key(url);
                    let res = new ResourceImpl();
                    res.key = urlKey;
                    res.content = asset;
                    ResManager.AddRes(res);
                    __this.Emit(Event.COMPLETE, { url });
                });
            });
        }
    }
    Reset() {
        this.url = null;
    }
}

class StringUtils {
    /**
     * 是否为空
     * @param str
     */
    static IsEmpty(str) {
        if (str == null || str == undefined || str.length == 0) {
            return true;
        }
        return false;
    }
    /**
     * 参数替换
     *  @param  str
     *  @param  rest
     *
     *  @example
     *
     *  var str:string = "here is some info '{0}' and {1}";
     *  trace(StringUtil.substitute(str, 15.4, true));
     *
     *  // this will output the following string:
     *  // "here is some info '15.4' and true"
     */
    static Substitute(str, ...rest) {
        if (str == null)
            return '';
        // Replace all of the parameters in the msg string.
        var len = rest.length;
        var args;
        if (len == 1 && rest[0] instanceof Array) {
            args = rest[0];
            len = args.length;
        }
        else {
            args = rest;
        }
        for (var i = 0; i < len; i++) {
            str = str.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);
        }
        return str;
    }
    /**
    * 替换全部字符串
    * @param string src 源串
    * @param string from_ch 被替换的字符
    * @param string to_ch 替换的字符
    *
    * @return string 结果字符串
    */
    static ReplaceAll(src, from_ch, to_ch) {
        return src.split(from_ch).join(to_ch);
    }
    /**
     * 拆分字符串
     * @param str
     */
    static SplitString(str, split0, split1) {
        let args = new Array();
        let tmp = str.split(split0);
        tmp.forEach((val, key) => {
            let s = val.split(split1);
            args.push(s);
        });
        return args;
    }
    /**
     * 获取文件后缀名
     * @param url
     */
    static GetFileSuffix(url) {
        let index = url.lastIndexOf(".");
        if (index < 0) {
            return "";
        }
        let suixx = url.substring(index + 1);
        return suixx;
    }
    /**
     * 替换后缀
     * @param url
     * @param suff      后缀
     * @returns
     */
    static ReplaceSuffix(url, suff) {
        let index = url.lastIndexOf(".");
        if (index < 0) {
            throw new Error(url + "没有后缀！！！");
        }
        let suixx = url.substring(index + 1);
        let changeUrl = url.replace(suixx, suff);
        return changeUrl;
    }
}

class Res {
    static KEY = "drongo.Res";
    /**
     * 最大加载线程
     */
    static MAX_LOADER_THREAD = 5;
    /**
     * 设置资源加载器
     * @param key
     * @param loader
     */
    static SetResLoader(key, loader) {
        this.impl.SetResLoader(key, loader);
    }
    /**
     * 获取资源加载器
     * @param key
     * @returns
     */
    static GetResLoader(key) {
        return this.impl.GetResLoader(key);
    }
    /**
     * 获取资源
     * @param url
     * @param refKey
     * @param cb
     * @param progress
     */
    static GetResRef(url, refKey, progress) {
        return this.impl.GetResRef(url, refKey, progress);
    }
    /**
     * 获取资源列表
     * @param url
     * @param refKey
     * @param cb
     * @param progress
     */
    static GetResRefList(url, refKey, progress) {
        return this.impl.GetResRefList(url, refKey, progress);
    }
    /**
     * 获取资源列表并放入字典中
     * @param url
     * @param refKey
     * @param result
     * @param cb
     * @param progress
     */
    static GetResRefMap(url, refKey, result, progress) {
        return this.impl.GetResRefMap(url, refKey, result, progress);
    }
    static __impl;
    static get impl() {
        if (this.__impl == null) {
            this.__impl = Injector.GetInject(this.KEY);
        }
        if (this.__impl == null) {
            throw new Error(this.KEY + "未注入！");
        }
        return this.__impl;
    }
}

class LoaderQueue {
    /**
     * 加载中
     */
    running = new Dictionary();
    /**
     * 等待加载
     */
    waiting = new Dictionary();
    /**
     * 对象池
     */
    pool = new Array();
    constructor() {
        TickerManager.AddTicker(this);
    }
    Tick(dt) {
        while (this.running.size < Res.MAX_LOADER_THREAD && this.waiting.size > 0) {
            //获取需要加载的内容
            const url = this.waiting.elements[0];
            const urlKey = URL2Key(url);
            this.waiting.Delete(urlKey);
            let loader;
            let loaderClass;
            if (this.pool.length > 0) {
                loader = this.pool.shift();
            }
            else {
                if (typeof url == "string") {
                    loaderClass = Res.GetResLoader("string");
                }
                else {
                    loaderClass = Res.GetResLoader(url.type);
                }
                loader = new loaderClass();
            }
            if (loader != null) {
                this.running.Set(urlKey, loader);
                loader.Load(url);
                this.__addEvent(loader);
            }
        }
    }
    __addEvent(target) {
        target.On(Event.COMPLETE, this.__eventHandler, this);
        target.On(Event.ERROR, this.__eventHandler, this);
        target.On(Event.PROGRESS, this.__eventHandler, this);
    }
    __eventHandler(type, target, data) {
        if (type == Event.PROGRESS) {
            Loader.single.ChildProgress(data.url, data.progress);
            return;
        }
        target.OffAllEvent();
        if (type == Event.ERROR) {
            Loader.single.ChildError(data.url, data.err);
            return;
        }
        if (type == Event.COMPLETE) {
            Loader.single.ChildComplete(data.url);
            //重置并回收
            target.Reset();
            this.pool.push(target);
        }
    }
    Load(url) {
        const urlKey = URL2Key(url);
        //已经在等待列表中
        if (this.waiting.Has(urlKey)) {
            return;
        }
        //加载中
        if (this.running.Has(urlKey)) {
            return;
        }
        //加入等待列表
        this.waiting.Set(urlKey, url);
    }
    static __instance;
    static get single() {
        if (this.__instance == null) {
            this.__instance = new LoaderQueue();
        }
        return this.__instance;
    }
}

class ResRequest {
    /**
     * 资源地址
     */
    urls;
    /**
     * 完成回调
     */
    cb;
    /**
     * 进度处理器
     */
    progress;
    __loadedMap = new Map();
    constructor(url, cb, progress) {
        if (Array.isArray(url)) {
            this.urls = url;
        }
        else {
            this.urls = [url];
        }
        this.cb = cb;
        this.progress = progress;
    }
    Load() {
        this.__loadedMap.clear();
        for (let index = 0; index < this.urls.length; index++) {
            const url = this.urls[index];
            LoaderQueue.single.Load(url);
        }
    }
    ChildComplete(resURL) {
        const urlKey = URL2Key(resURL);
        this.__loadedMap.set(urlKey, 1);
        this.UpdateProgress();
    }
    ChildProgress(resURL, progress) {
        const urlKey = URL2Key(resURL);
        this.__loadedMap.set(urlKey, progress);
        this.UpdateProgress();
    }
    ChildError(err) {
        if (this.cb) {
            this.cb(err);
        }
    }
    UpdateProgress() {
        let loaded = this.getLoaded();
        let progress = loaded / this.urls.length;
        if (this.progress) {
            this.progress(progress);
        }
        //完成
        if (progress == 1 && this.cb != null) {
            this.cb(null);
        }
    }
    getLoaded() {
        let loaded = 0;
        for (let value of this.__loadedMap.values()) {
            loaded += value;
        }
        return loaded;
    }
    Destroy() {
        this.urls = null;
        this.cb = null;
        this.progress = null;
    }
}

class Loader {
    requests = new Map();
    constructor() {
    }
    /**
     * 加载
     * @param url
     * @param resKey
     * @param cb
     * @param progress
     */
    Load(url, cb, progress) {
        let request = new ResRequest(url, cb, progress);
        this.__addReqeuset(request);
        request.Load();
    }
    ChildComplete(url) {
        const urlKey = URL2Key(url);
        let list = this.requests.get(urlKey);
        for (let index = 0; index < list.length; index++) {
            const request = list[index];
            request.ChildComplete(url);
        }
        list.length = 0;
        this.requests.delete(urlKey);
    }
    ChildError(url, err) {
        const urlKey = URL2Key(url);
        let rlist = this.requests.get(urlKey);
        for (let index = 0; index < rlist.length; index++) {
            const request = rlist[index];
            request.ChildError(err);
        }
        //复制
        let list = rlist.concat();
        //清除掉关联的所有资源请求
        for (let index = 0; index < list.length; index++) {
            const request = list[index];
            this.__deleteReqeuset(request);
            //销毁
            request.Destroy();
        }
    }
    ChildProgress(url, progress) {
        const urlKey = URL2Key(url);
        let list = this.requests.get(urlKey);
        for (let index = 0; index < list.length; index++) {
            const request = list[index];
            request.ChildProgress(url, progress);
        }
    }
    /**
     * 添加
     * @param request
     */
    __addReqeuset(request) {
        let list;
        for (let index = 0; index < request.urls.length; index++) {
            const url = request.urls[index];
            const urlKey = URL2Key(url);
            if (this.requests.has(urlKey)) {
                list = this.requests.get(urlKey);
            }
            else {
                list = [];
                this.requests.set(urlKey, list);
            }
            list.push(request);
        }
    }
    /**
     * 删除
     * @param request
     */
    __deleteReqeuset(request) {
        let list;
        let findex = 0;
        //遍历当前请求的所有资源
        for (let i = 0; i < request.urls.length; i++) {
            const url = request.urls[i];
            const urlKey = URL2Key(url);
            //从列表中找出并删除
            list = this.requests.get(urlKey);
            findex = list.indexOf(request);
            if (findex >= 0) {
                list.splice(findex, 1);
            }
        }
    }
    static __instance;
    static get single() {
        if (this.__instance == null) {
            this.__instance = new Loader();
        }
        return this.__instance;
    }
}

class ResImpl {
    loaderClass;
    constructor() {
        this.loaderClass = new Map();
    }
    SetResLoader(key, loader) {
        let className = GetClassName(key);
        this.loaderClass.set(className, loader);
    }
    GetResLoader(key) {
        let className = GetClassName(key);
        if (!this.loaderClass.has(className)) {
            throw new Error("未注册加载器！" + className);
        }
        return this.loaderClass.get(className);
    }
    GetResRef(url, refKey, progress) {
        const urlKey = URL2Key(url);
        //地址为空
        if (StringUtils.IsEmpty(urlKey)) {
            return Promise.reject("资源地址为空!");
        }
        //资源已经加载完成
        if (ResManager.HasRes(urlKey)) {
            return Promise.resolve(ResManager.AddResRef(urlKey, refKey));
        }
        let promise = new Promise((resolve, reject) => {
            Loader.single.Load(url, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(ResManager.AddResRef(urlKey, refKey));
                }
            }, progress);
        });
        return promise;
    }
    async GetResRefList(urls, refKey, progress) {
        let tasks = [];
        Loader.single.Load(urls, (err) => {
            if (err) {
                tasks.push(Promise.reject(err));
            }
            else {
                for (let index = 0; index < urls.length; index++) {
                    const url = urls[index];
                    const urlKey = URL2Key(url);
                    tasks.push(Promise.resolve(ResManager.AddResRef(urlKey, refKey)));
                }
            }
        }, progress);
        return await Promise.all(tasks);
    }
    async GetResRefMap(urls, refKey, result, progress) {
        result = result || new Map();
        let promise = new Promise((resolve, reject) => {
            Loader.single.Load(urls, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    for (let index = 0; index < urls.length; index++) {
                        const url = urls[index];
                        const urlKey = URL2Key(url);
                        result.set(urlKey, ResManager.AddResRef(urlKey, refKey));
                    }
                    resolve(result);
                }
            }, progress);
        });
        return promise;
    }
}

class TickerManagerImpl {
    __tickerList = [];
    __nextFrameCallBacks = [];
    Tick(dt) {
        let handler;
        while (this.__nextFrameCallBacks.length) {
            handler = this.__nextFrameCallBacks.shift();
            handler.callBack.apply(handler.caller);
        }
        for (let index = 0; index < this.__tickerList.length; index++) {
            const element = this.__tickerList[index];
            element.Tick(dt);
        }
    }
    AddTicker(value) {
        let index = this.__tickerList.indexOf(value);
        if (index >= 0) {
            throw new Error("Ticker 重复添加！");
        }
        this.__tickerList.push(value);
    }
    RemoveTicker(value) {
        let index = this.__tickerList.indexOf(value);
        if (index < 0) {
            throw new Error("找不到要删除的Tick！");
        }
        this.__tickerList.splice(index, 1);
    }
    CallNextFrame(value, caller) {
        for (let index = 0; index < this.__nextFrameCallBacks.length; index++) {
            const element = this.__nextFrameCallBacks[index];
            //重复
            if (element.Equal(value, caller)) {
                return;
            }
        }
        this.__nextFrameCallBacks.push(new NextFrameHandler(value, caller));
    }
    ClearNextFrame(value, caller) {
        for (let index = 0; index < this.__nextFrameCallBacks.length; index++) {
            const element = this.__nextFrameCallBacks[index];
            //删除
            if (element.Equal(value, caller)) {
                this.__nextFrameCallBacks.splice(index, 1);
            }
        }
    }
}
class NextFrameHandler {
    callBack;
    caller;
    constructor(callBack, caller) {
        this.callBack = callBack;
        this.caller = caller;
    }
    Equal(callBack, caller) {
        if (this.caller !== caller) {
            return false;
        }
        if (this.callBack !== callBack) {
            return false;
        }
        return true;
    }
}

class TimerImpl {
    __lastTime = 0;
    constructor() {
        this.Reset();
        TickerManager.AddTicker(this);
    }
    Reset() {
        //当前时间转秒
        this.__lastTime = Date.now() / 1000;
    }
    Tick(dt) {
        this.__lastTime += dt;
    }
    get currentTime() {
        return this.__lastTime;
    }
    get absTime() {
        this.Reset();
        return this.currentTime;
    }
}

/**
 * bit位操作
 */
class BitFlag {
    __flags = 0;
    __elements;
    constructor() {
        this.__elements = [];
    }
    Add(flag) {
        this.__flags |= flag;
        if (this.__elements.indexOf(flag) < 0) {
            this.__elements.push(flag);
        }
    }
    Remove(flag) {
        this.__flags ^= flag;
        let index = this.__elements.indexOf(flag);
        if (index >= 0) {
            this.__elements.splice(index, 1);
        }
    }
    /**
     * 是否包含
     * @param flag
     * @returns
     */
    Has(flag) {
        return (this.__flags & flag) == flag;
    }
    /**
     * 位码
     */
    get flags() {
        return this.__flags;
    }
    get elements() {
        return this.__elements;
    }
    Destroy() {
        this.__flags = 0;
        this.__elements.length = 0;
        this.__elements = null;
    }
}

//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
/**
 * The Endian class contains values that denote the byte order used to represent multibyte numbers.
 * The byte order is either bigEndian (most significant byte first) or littleEndian (least significant byte first).
 * @version Egret 2.4
 * @platform Web,Native
 * @language en_US
 */
/**
 * Endian 类中包含一些值，它们表示用于表示多字节数字的字节顺序。
 * 字节顺序为 bigEndian（最高有效字节位于最前）或 littleEndian（最低有效字节位于最前）。
 * @version Egret 2.4
 * @platform Web,Native
 * @language zh_CN
 */
class Endian {
    /**
     * Indicates the least significant byte of the multibyte number appears first in the sequence of bytes.
     * The hexadecimal number 0x12345678 has 4 bytes (2 hexadecimal digits per byte). The most significant byte is 0x12. The least significant byte is 0x78. (For the equivalent decimal number, 305419896, the most significant digit is 3, and the least significant digit is 6).
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 表示多字节数字的最低有效字节位于字节序列的最前面。
     * 十六进制数字 0x12345678 包含 4 个字节（每个字节包含 2 个十六进制数字）。最高有效字节为 0x12。最低有效字节为 0x78。（对于等效的十进制数字 305419896，最高有效数字是 3，最低有效数字是 6）。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    static LITTLE_ENDIAN = "littleEndian";
    /**
     * Indicates the most significant byte of the multibyte number appears first in the sequence of bytes.
     * The hexadecimal number 0x12345678 has 4 bytes (2 hexadecimal digits per byte).  The most significant byte is 0x12. The least significant byte is 0x78. (For the equivalent decimal number, 305419896, the most significant digit is 3, and the least significant digit is 6).
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 表示多字节数字的最高有效字节位于字节序列的最前面。
     * 十六进制数字 0x12345678 包含 4 个字节（每个字节包含 2 个十六进制数字）。最高有效字节为 0x12。最低有效字节为 0x78。（对于等效的十进制数字 305419896，最高有效数字是 3，最低有效数字是 6）。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    static BIG_ENDIAN = "bigEndian";
}
/**
 * The ByteArray class provides methods and attributes for optimized reading and writing as well as dealing with binary data.
 * Note: The ByteArray class is applied to the advanced developers who need to access data at the byte layer.
 * @version Egret 2.4
 * @platform Web,Native
 * @includeExample egret/utils/ByteArray.ts
 * @language en_US
 */
/**
 * ByteArray 类提供用于优化读取、写入以及处理二进制数据的方法和属性。
 * 注意：ByteArray 类适用于需要在字节层访问数据的高级开发人员。
 * @version Egret 2.4
 * @platform Web,Native
 * @includeExample egret/utils/ByteArray.ts
 * @language zh_CN
 */
class ByteArray {
    /**
     * @private
     */
    bufferExtSize = 0; //Buffer expansion size
    data;
    _bytes;
    /**
     * @private
     */
    _position;
    /**
     *
     * 已经使用的字节偏移量
     * @protected
     * @type {number}
     * @memberOf ByteArray
     */
    write_position;
    /**
     * Changes or reads the byte order; egret.EndianConst.BIG_ENDIAN or egret.EndianConst.LITTLE_EndianConst.
     * @default egret.EndianConst.BIG_ENDIAN
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 更改或读取数据的字节顺序；egret.EndianConst.BIG_ENDIAN 或 egret.EndianConst.LITTLE_ENDIAN。
     * @default egret.EndianConst.BIG_ENDIAN
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    get endian() {
        return this.$endian == 0 /* EndianConst.LITTLE_ENDIAN */ ? Endian.LITTLE_ENDIAN : Endian.BIG_ENDIAN;
    }
    set endian(value) {
        this.$endian = value == Endian.LITTLE_ENDIAN ? 0 /* EndianConst.LITTLE_ENDIAN */ : 1 /* EndianConst.BIG_ENDIAN */;
    }
    $endian;
    /**
     * @version Egret 2.4
     * @platform Web,Native
     */
    constructor(buffer, bufferExtSize = 0) {
        if (bufferExtSize < 0) {
            bufferExtSize = 0;
        }
        this.bufferExtSize = bufferExtSize;
        let bytes, wpos = 0;
        if (buffer) { //有数据，则可写字节数从字节尾开始
            let uint8;
            if (buffer instanceof Uint8Array) {
                uint8 = buffer;
                wpos = buffer.length;
            }
            else {
                wpos = buffer.byteLength;
                uint8 = new Uint8Array(buffer);
            }
            if (bufferExtSize == 0) {
                bytes = new Uint8Array(wpos);
            }
            else {
                let multi = (wpos / bufferExtSize | 0) + 1;
                bytes = new Uint8Array(multi * bufferExtSize);
            }
            bytes.set(uint8);
        }
        else {
            bytes = new Uint8Array(bufferExtSize);
        }
        this.write_position = wpos;
        this._position = 0;
        this._bytes = bytes;
        this.data = new DataView(bytes.buffer);
        this.endian = Endian.BIG_ENDIAN;
    }
    Reset() {
        this.Clear();
    }
    Destroy() {
        this._bytes = null;
        this.data = null;
    }
    /**
     * @deprecated
     * @version Egret 2.4
     * @platform Web,Native
     */
    SetArrayBuffer(buffer) {
    }
    /**
     * 可读的剩余字节数
     *
     * @returns
     *
     * @memberOf ByteArray
     */
    get readAvailable() {
        return this.write_position - this._position;
    }
    get buffer() {
        return this.data.buffer.slice(0, this.write_position);
    }
    get rawBuffer() {
        return this.data.buffer;
    }
    /**
     * @private
     */
    set buffer(value) {
        let wpos = value.byteLength;
        let uint8 = new Uint8Array(value);
        let bufferExtSize = this.bufferExtSize;
        let bytes;
        if (bufferExtSize == 0) {
            bytes = new Uint8Array(wpos);
        }
        else {
            let multi = (wpos / bufferExtSize | 0) + 1;
            bytes = new Uint8Array(multi * bufferExtSize);
        }
        bytes.set(uint8);
        this.write_position = wpos;
        this._bytes = bytes;
        this.data = new DataView(bytes.buffer);
    }
    get bytes() {
        return this._bytes;
    }
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    get dataView() {
        return this.data;
    }
    /**
     * @private
     */
    set dataView(value) {
        this.buffer = value.buffer;
    }
    /**
     * @private
     */
    get bufferOffset() {
        return this.data.byteOffset;
    }
    /**
     * The current position of the file pointer (in bytes) to move or return to the ByteArray object. The next time you start reading reading method call in this position, or will start writing in this position next time call a write method.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 将文件指针的当前位置（以字节为单位）移动或返回到 ByteArray 对象中。下一次调用读取方法时将在此位置开始读取，或者下一次调用写入方法时将在此位置开始写入。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    get position() {
        return this._position;
    }
    set position(value) {
        this._position = value;
        if (value > this.write_position) {
            this.write_position = value;
        }
    }
    /**
     * The length of the ByteArray object (in bytes).
              * If the length is set to be larger than the current length, the right-side zero padding byte array.
              * If the length is set smaller than the current length, the byte array is truncated.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * ByteArray 对象的长度（以字节为单位）。
     * 如果将长度设置为大于当前长度的值，则用零填充字节数组的右侧。
     * 如果将长度设置为小于当前长度的值，将会截断该字节数组。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    get length() {
        return this.write_position;
    }
    set length(value) {
        this.write_position = value;
        if (this.data.byteLength > value) {
            this._position = value;
        }
        this._validateBuffer(value);
    }
    _validateBuffer(value) {
        if (this.data.byteLength < value) {
            let be = this.bufferExtSize;
            let tmp;
            if (be == 0) {
                tmp = new Uint8Array(value);
            }
            else {
                let nLen = ((value / be >> 0) + 1) * be;
                tmp = new Uint8Array(nLen);
            }
            tmp.set(this._bytes);
            this._bytes = tmp;
            this.data = new DataView(tmp.buffer);
        }
    }
    /**
     * The number of bytes that can be read from the current position of the byte array to the end of the array data.
     * When you access a ByteArray object, the bytesAvailable property in conjunction with the read methods each use to make sure you are reading valid data.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 可从字节数组的当前位置到数组末尾读取的数据的字节数。
     * 每次访问 ByteArray 对象时，将 bytesAvailable 属性与读取方法结合使用，以确保读取有效的数据。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    get bytesAvailable() {
        return this.data.byteLength - this._position;
    }
    /**
     * Clears the contents of the byte array and resets the length and position properties to 0.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 清除字节数组的内容，并将 length 和 position 属性重置为 0。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    Clear() {
        let buffer = new ArrayBuffer(this.bufferExtSize);
        this.data = new DataView(buffer);
        this._bytes = new Uint8Array(buffer);
        this._position = 0;
        this.write_position = 0;
    }
    /**
     * Read a Boolean value from the byte stream. Read a simple byte. If the byte is non-zero, it returns true; otherwise, it returns false.
     * @return If the byte is non-zero, it returns true; otherwise, it returns false.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 从字节流中读取布尔值。读取单个字节，如果字节非零，则返回 true，否则返回 false
     * @return 如果字节不为零，则返回 true，否则返回 false
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    ReadBoolean() {
        if (this.Validate(1 /* ByteArraySize.SIZE_OF_BOOLEAN */))
            return !!this._bytes[this.position++];
    }
    /**
     * Read signed bytes from the byte stream.
     * @return An integer ranging from -128 to 127
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 从字节流中读取带符号的字节
     * @return 介于 -128 和 127 之间的整数
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    ReadByte() {
        if (this.Validate(1 /* ByteArraySize.SIZE_OF_INT8 */))
            return this.data.getInt8(this.position++);
    }
    /**
     * Read data byte number specified by the length parameter from the byte stream. Starting from the position specified by offset, read bytes into the ByteArray object specified by the bytes parameter, and write bytes into the target ByteArray
     * @param bytes ByteArray object that data is read into
     * @param offset Offset (position) in bytes. Read data should be written from this position
     * @param length Byte number to be read Default value 0 indicates reading all available data
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 从字节流中读取 length 参数指定的数据字节数。从 offset 指定的位置开始，将字节读入 bytes 参数指定的 ByteArray 对象中，并将字节写入目标 ByteArray 中
     * @param bytes 要将数据读入的 ByteArray 对象
     * @param offset bytes 中的偏移（位置），应从该位置写入读取的数据
     * @param length 要读取的字节数。默认值 0 导致读取所有可用的数据
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    ReadBytes(bytes, offset = 0, length = 0) {
        if (!bytes) { //由于bytes不返回，所以new新的无意义
            return;
        }
        let pos = this._position;
        let available = this.write_position - pos;
        if (available < 0) {
            console.error(1025);
            return;
        }
        if (length == 0) {
            length = available;
        }
        else if (length > available) {
            console.error(1025);
            return;
        }
        const position = bytes._position;
        bytes._position = 0;
        bytes.ValidateBuffer(offset + length);
        bytes._position = position;
        bytes._bytes.set(this._bytes.subarray(pos, pos + length), offset);
        this.position += length;
    }
    /**
     * Read an IEEE 754 double-precision (64 bit) floating point number from the byte stream
     * @return Double-precision (64 bit) floating point number
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 从字节流中读取一个 IEEE 754 双精度（64 位）浮点数
     * @return 双精度（64 位）浮点数
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    ReadDouble() {
        if (this.Validate(8 /* ByteArraySize.SIZE_OF_FLOAT64 */)) {
            let value = this.data.getFloat64(this._position, this.$endian == 0 /* EndianConst.LITTLE_ENDIAN */);
            this.position += 8 /* ByteArraySize.SIZE_OF_FLOAT64 */;
            return value;
        }
    }
    /**
     * Read an IEEE 754 single-precision (32 bit) floating point number from the byte stream
     * @return Single-precision (32 bit) floating point number
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 从字节流中读取一个 IEEE 754 单精度（32 位）浮点数
     * @return 单精度（32 位）浮点数
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    ReadFloat() {
        if (this.Validate(4 /* ByteArraySize.SIZE_OF_FLOAT32 */)) {
            let value = this.data.getFloat32(this._position, this.$endian == 0 /* EndianConst.LITTLE_ENDIAN */);
            this.position += 4 /* ByteArraySize.SIZE_OF_FLOAT32 */;
            return value;
        }
    }
    /**
     * Read a 32-bit signed integer from the byte stream.
     * @return A 32-bit signed integer ranging from -2147483648 to 2147483647
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 从字节流中读取一个带符号的 32 位整数
     * @return 介于 -2147483648 和 2147483647 之间的 32 位带符号整数
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    ReadInt() {
        if (this.Validate(4 /* ByteArraySize.SIZE_OF_INT32 */)) {
            let value = this.data.getInt32(this._position, this.$endian == 0 /* EndianConst.LITTLE_ENDIAN */);
            this.position += 4 /* ByteArraySize.SIZE_OF_INT32 */;
            return value;
        }
    }
    /**
     * Read a 16-bit signed integer from the byte stream.
     * @return A 16-bit signed integer ranging from -32768 to 32767
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 从字节流中读取一个带符号的 16 位整数
     * @return 介于 -32768 和 32767 之间的 16 位带符号整数
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    ReadShort() {
        if (this.Validate(2 /* ByteArraySize.SIZE_OF_INT16 */)) {
            let value = this.data.getInt16(this._position, this.$endian == 0 /* EndianConst.LITTLE_ENDIAN */);
            this.position += 2 /* ByteArraySize.SIZE_OF_INT16 */;
            return value;
        }
    }
    /**
     * Read unsigned bytes from the byte stream.
     * @return A unsigned integer ranging from 0 to 255
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 从字节流中读取无符号的字节
     * @return 介于 0 和 255 之间的无符号整数
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    ReadUnsignedByte() {
        if (this.Validate(1 /* ByteArraySize.SIZE_OF_UINT8 */))
            return this._bytes[this.position++];
    }
    /**
     * Read a 32-bit unsigned integer from the byte stream.
     * @return A 32-bit unsigned integer ranging from 0 to 4294967295
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 从字节流中读取一个无符号的 32 位整数
     * @return 介于 0 和 4294967295 之间的 32 位无符号整数
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    ReadUnsignedInt() {
        if (this.Validate(4 /* ByteArraySize.SIZE_OF_UINT32 */)) {
            let value = this.data.getUint32(this._position, this.$endian == 0 /* EndianConst.LITTLE_ENDIAN */);
            this.position += 4 /* ByteArraySize.SIZE_OF_UINT32 */;
            return value;
        }
    }
    /**
     * Read a 16-bit unsigned integer from the byte stream.
     * @return A 16-bit unsigned integer ranging from 0 to 65535
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 从字节流中读取一个无符号的 16 位整数
     * @return 介于 0 和 65535 之间的 16 位无符号整数
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    ReadUnsignedShort() {
        if (this.Validate(2 /* ByteArraySize.SIZE_OF_UINT16 */)) {
            let value = this.data.getUint16(this._position, this.$endian == 0 /* EndianConst.LITTLE_ENDIAN */);
            this.position += 2 /* ByteArraySize.SIZE_OF_UINT16 */;
            return value;
        }
    }
    /**
     * Read a UTF-8 character string from the byte stream Assume that the prefix of the character string is a short unsigned integer (use byte to express length)
     * @return UTF-8 character string
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 从字节流中读取一个 UTF-8 字符串。假定字符串的前缀是无符号的短整型（以字节表示长度）
     * @return UTF-8 编码的字符串
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    ReadUTF() {
        let length = this.ReadUnsignedShort();
        if (length > 0) {
            return this.ReadUTFBytes(length);
        }
        else {
            return "";
        }
    }
    /**
     * Read a UTF-8 byte sequence specified by the length parameter from the byte stream, and then return a character string
     * @param Specify a short unsigned integer of the UTF-8 byte length
     * @return A character string consists of UTF-8 bytes of the specified length
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 从字节流中读取一个由 length 参数指定的 UTF-8 字节序列，并返回一个字符串
     * @param length 指明 UTF-8 字节长度的无符号短整型数
     * @return 由指定长度的 UTF-8 字节组成的字符串
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    ReadUTFBytes(length) {
        if (!this.Validate(length)) {
            return;
        }
        let data = this.data;
        let bytes = new Uint8Array(data.buffer, data.byteOffset + this._position, length);
        this.position += length;
        return this.DecodeUTF8(bytes);
    }
    /**
     * Write a Boolean value. A single byte is written according to the value parameter. If the value is true, write 1; if the value is false, write 0.
     * @param value A Boolean value determining which byte is written. If the value is true, write 1; if the value is false, write 0.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 写入布尔值。根据 value 参数写入单个字节。如果为 true，则写入 1，如果为 false，则写入 0
     * @param value 确定写入哪个字节的布尔值。如果该参数为 true，则该方法写入 1；如果该参数为 false，则该方法写入 0
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    WriteBoolean(value) {
        this.ValidateBuffer(1 /* ByteArraySize.SIZE_OF_BOOLEAN */);
        this._bytes[this.position++] = +value;
    }
    /**
     * Write a byte into the byte stream
     * The low 8 bits of the parameter are used. The high 24 bits are ignored.
     * @param value A 32-bit integer. The low 8 bits will be written into the byte stream
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 在字节流中写入一个字节
     * 使用参数的低 8 位。忽略高 24 位
     * @param value 一个 32 位整数。低 8 位将被写入字节流
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    WriteByte(value) {
        this.ValidateBuffer(1 /* ByteArraySize.SIZE_OF_INT8 */);
        this._bytes[this.position++] = value & 0xff;
    }
    /**
     * Write the byte sequence that includes length bytes in the specified byte array, bytes, (starting at the byte specified by offset, using a zero-based index), into the byte stream
     * If the length parameter is omitted, the default length value 0 is used and the entire buffer starting at offset is written. If the offset parameter is also omitted, the entire buffer is written
     * If the offset or length parameter is out of range, they are clamped to the beginning and end of the bytes array.
     * @param bytes ByteArray Object
     * @param offset A zero-based index specifying the position into the array to begin writing
     * @param length An unsigned integer specifying how far into the buffer to write
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 将指定字节数组 bytes（起始偏移量为 offset，从零开始的索引）中包含 length 个字节的字节序列写入字节流
     * 如果省略 length 参数，则使用默认长度 0；该方法将从 offset 开始写入整个缓冲区。如果还省略了 offset 参数，则写入整个缓冲区
     * 如果 offset 或 length 超出范围，它们将被锁定到 bytes 数组的开头和结尾
     * @param bytes ByteArray 对象
     * @param offset 从 0 开始的索引，表示在数组中开始写入的位置
     * @param length 一个无符号整数，表示在缓冲区中的写入范围
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    WriteBytes(bytes, offset = 0, length = 0) {
        let writeLength;
        if (offset < 0) {
            return;
        }
        if (length < 0) {
            return;
        }
        else if (length == 0) {
            writeLength = bytes.length - offset;
        }
        else {
            writeLength = Math.min(bytes.length - offset, length);
        }
        if (writeLength > 0) {
            this.ValidateBuffer(writeLength);
            this._bytes.set(bytes._bytes.subarray(offset, offset + writeLength), this._position);
            this.position = this._position + writeLength;
        }
    }
    /**
     * Write an IEEE 754 double-precision (64 bit) floating point number into the byte stream
     * @param value Double-precision (64 bit) floating point number
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 在字节流中写入一个 IEEE 754 双精度（64 位）浮点数
     * @param value 双精度（64 位）浮点数
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    WriteDouble(value) {
        this.ValidateBuffer(8 /* ByteArraySize.SIZE_OF_FLOAT64 */);
        this.data.setFloat64(this._position, value, this.$endian == 0 /* EndianConst.LITTLE_ENDIAN */);
        this.position += 8 /* ByteArraySize.SIZE_OF_FLOAT64 */;
    }
    /**
     * Write an IEEE 754 single-precision (32 bit) floating point number into the byte stream
     * @param value Single-precision (32 bit) floating point number
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 在字节流中写入一个 IEEE 754 单精度（32 位）浮点数
     * @param value 单精度（32 位）浮点数
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    WriteFloat(value) {
        this.ValidateBuffer(4 /* ByteArraySize.SIZE_OF_FLOAT32 */);
        this.data.setFloat32(this._position, value, this.$endian == 0 /* EndianConst.LITTLE_ENDIAN */);
        this.position += 4 /* ByteArraySize.SIZE_OF_FLOAT32 */;
    }
    /**
     * Write a 32-bit signed integer into the byte stream
     * @param value An integer to be written into the byte stream
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 在字节流中写入一个带符号的 32 位整数
     * @param value 要写入字节流的整数
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    WriteInt(value) {
        this.ValidateBuffer(4 /* ByteArraySize.SIZE_OF_INT32 */);
        this.data.setInt32(this._position, value, this.$endian == 0 /* EndianConst.LITTLE_ENDIAN */);
        this.position += 4 /* ByteArraySize.SIZE_OF_INT32 */;
    }
    /**
     * Write a 16-bit integer into the byte stream. The low 16 bits of the parameter are used. The high 16 bits are ignored.
     * @param value A 32-bit integer. Its low 16 bits will be written into the byte stream
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 在字节流中写入一个 16 位整数。使用参数的低 16 位。忽略高 16 位
     * @param value 32 位整数，该整数的低 16 位将被写入字节流
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    WriteShort(value) {
        this.ValidateBuffer(2 /* ByteArraySize.SIZE_OF_INT16 */);
        this.data.setInt16(this._position, value, this.$endian == 0 /* EndianConst.LITTLE_ENDIAN */);
        this.position += 2 /* ByteArraySize.SIZE_OF_INT16 */;
    }
    /**
     * Write a 32-bit unsigned integer into the byte stream
     * @param value An unsigned integer to be written into the byte stream
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 在字节流中写入一个无符号的 32 位整数
     * @param value 要写入字节流的无符号整数
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    WriteUnsignedInt(value) {
        this.ValidateBuffer(4 /* ByteArraySize.SIZE_OF_UINT32 */);
        this.data.setUint32(this._position, value, this.$endian == 0 /* EndianConst.LITTLE_ENDIAN */);
        this.position += 4 /* ByteArraySize.SIZE_OF_UINT32 */;
    }
    /**
     * Write a 16-bit unsigned integer into the byte stream
     * @param value An unsigned integer to be written into the byte stream
     * @version Egret 2.5
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 在字节流中写入一个无符号的 16 位整数
     * @param value 要写入字节流的无符号整数
     * @version Egret 2.5
     * @platform Web,Native
     * @language zh_CN
     */
    WriteUnsignedShort(value) {
        this.ValidateBuffer(2 /* ByteArraySize.SIZE_OF_UINT16 */);
        this.data.setUint16(this._position, value, this.$endian == 0 /* EndianConst.LITTLE_ENDIAN */);
        this.position += 2 /* ByteArraySize.SIZE_OF_UINT16 */;
    }
    /**
     * Write a UTF-8 string into the byte stream. The length of the UTF-8 string in bytes is written first, as a 16-bit integer, followed by the bytes representing the characters of the string
     * @param value Character string value to be written
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 将 UTF-8 字符串写入字节流。先写入以字节表示的 UTF-8 字符串长度（作为 16 位整数），然后写入表示字符串字符的字节
     * @param value 要写入的字符串值
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    WriteUTF(value) {
        let utf8bytes = this.EncodeUTF8(value);
        let length = utf8bytes.length;
        this.ValidateBuffer(2 /* ByteArraySize.SIZE_OF_UINT16 */ + length);
        this.data.setUint16(this._position, length, this.$endian == 0 /* EndianConst.LITTLE_ENDIAN */);
        this.position += 2 /* ByteArraySize.SIZE_OF_UINT16 */;
        this._writeUint8Array(utf8bytes, false);
    }
    /**
     * Write a UTF-8 string into the byte stream. Similar to the writeUTF() method, but the writeUTFBytes() method does not prefix the string with a 16-bit length word
     * @param value Character string value to be written
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 将 UTF-8 字符串写入字节流。类似于 writeUTF() 方法，但 writeUTFBytes() 不使用 16 位长度的词为字符串添加前缀
     * @param value 要写入的字符串值
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    WriteUTFBytes(value) {
        this._writeUint8Array(this.EncodeUTF8(value));
    }
    /**
     *
     * @returns
     * @version Egret 2.4
     * @platform Web,Native
     */
    ToString() {
        return "[ByteArray] length:" + this.length + ", bytesAvailable:" + this.bytesAvailable;
    }
    /**
     * @private
     * 将 Uint8Array 写入字节流
     * @param bytes 要写入的Uint8Array
     * @param validateBuffer
     */
    _writeUint8Array(bytes, validateBuffer = true) {
        let pos = this._position;
        let npos = pos + bytes.length;
        if (validateBuffer) {
            this.ValidateBuffer(npos);
        }
        this.bytes.set(bytes, pos);
        this.position = npos;
    }
    /**
     * @param len
     * @returns
     * @version Egret 2.4
     * @platform Web,Native
     * @private
     */
    Validate(len) {
        let bl = this._bytes.length;
        if (bl > 0 && this._position + len <= bl) {
            return true;
        }
        else {
            console.error(1025);
        }
    }
    /**********************/
    /*  PRIVATE METHODS   */
    /**********************/
    /**
     * @private
     * @param len
     * @param needReplace
     */
    ValidateBuffer(len) {
        this.write_position = len > this.write_position ? len : this.write_position;
        len += this._position;
        this._validateBuffer(len);
    }
    /**
     * @private
     * UTF-8 Encoding/Decoding
     */
    EncodeUTF8(str) {
        let pos = 0;
        let codePoints = this.StringToCodePoints(str);
        let outputBytes = [];
        while (codePoints.length > pos) {
            let code_point = codePoints[pos++];
            if (this.InRange(code_point, 0xD800, 0xDFFF)) {
                this.EncoderError(code_point);
            }
            else if (this.InRange(code_point, 0x0000, 0x007f)) {
                outputBytes.push(code_point);
            }
            else {
                let count, offset;
                if (this.InRange(code_point, 0x0080, 0x07FF)) {
                    count = 1;
                    offset = 0xC0;
                }
                else if (this.InRange(code_point, 0x0800, 0xFFFF)) {
                    count = 2;
                    offset = 0xE0;
                }
                else if (this.InRange(code_point, 0x10000, 0x10FFFF)) {
                    count = 3;
                    offset = 0xF0;
                }
                outputBytes.push(this.Div(code_point, Math.pow(64, count)) + offset);
                while (count > 0) {
                    let temp = this.Div(code_point, Math.pow(64, count - 1));
                    outputBytes.push(0x80 + (temp % 64));
                    count -= 1;
                }
            }
        }
        return new Uint8Array(outputBytes);
    }
    /**
     * @private
     *
     * @param data
     * @returns
     */
    DecodeUTF8(data) {
        let fatal = false;
        let pos = 0;
        let result = "";
        let code_point;
        let utf8_code_point = 0;
        let utf8_bytes_needed = 0;
        let utf8_bytes_seen = 0;
        let utf8_lower_boundary = 0;
        while (data.length > pos) {
            let _byte = data[pos++];
            if (_byte == this.EOF_byte) {
                if (utf8_bytes_needed != 0) {
                    code_point = this.DecoderError(fatal);
                }
                else {
                    code_point = this.EOF_code_point;
                }
            }
            else {
                if (utf8_bytes_needed == 0) {
                    if (this.InRange(_byte, 0x00, 0x7F)) {
                        code_point = _byte;
                    }
                    else {
                        if (this.InRange(_byte, 0xC2, 0xDF)) {
                            utf8_bytes_needed = 1;
                            utf8_lower_boundary = 0x80;
                            utf8_code_point = _byte - 0xC0;
                        }
                        else if (this.InRange(_byte, 0xE0, 0xEF)) {
                            utf8_bytes_needed = 2;
                            utf8_lower_boundary = 0x800;
                            utf8_code_point = _byte - 0xE0;
                        }
                        else if (this.InRange(_byte, 0xF0, 0xF4)) {
                            utf8_bytes_needed = 3;
                            utf8_lower_boundary = 0x10000;
                            utf8_code_point = _byte - 0xF0;
                        }
                        else {
                            this.DecoderError(fatal);
                        }
                        utf8_code_point = utf8_code_point * Math.pow(64, utf8_bytes_needed);
                        code_point = null;
                    }
                }
                else if (!this.InRange(_byte, 0x80, 0xBF)) {
                    utf8_code_point = 0;
                    utf8_bytes_needed = 0;
                    utf8_bytes_seen = 0;
                    utf8_lower_boundary = 0;
                    pos--;
                    code_point = this.DecoderError(fatal, _byte);
                }
                else {
                    utf8_bytes_seen += 1;
                    utf8_code_point = utf8_code_point + (_byte - 0x80) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);
                    if (utf8_bytes_seen !== utf8_bytes_needed) {
                        code_point = null;
                    }
                    else {
                        let cp = utf8_code_point;
                        let lower_boundary = utf8_lower_boundary;
                        utf8_code_point = 0;
                        utf8_bytes_needed = 0;
                        utf8_bytes_seen = 0;
                        utf8_lower_boundary = 0;
                        if (this.InRange(cp, lower_boundary, 0x10FFFF) && !this.InRange(cp, 0xD800, 0xDFFF)) {
                            code_point = cp;
                        }
                        else {
                            code_point = this.DecoderError(fatal, _byte);
                        }
                    }
                }
            }
            //Decode string
            if (code_point !== null && code_point !== this.EOF_code_point) {
                if (code_point <= 0xFFFF) {
                    if (code_point > 0)
                        result += String.fromCharCode(code_point);
                }
                else {
                    code_point -= 0x10000;
                    result += String.fromCharCode(0xD800 + ((code_point >> 10) & 0x3ff));
                    result += String.fromCharCode(0xDC00 + (code_point & 0x3ff));
                }
            }
        }
        return result;
    }
    /**
     * @private
     *
     * @param code_point
     */
    EncoderError(code_point) {
        console.error(1026, code_point);
    }
    /**
     * @private
     *
     * @param fatal
     * @param opt_code_point
     * @returns
     */
    DecoderError(fatal, opt_code_point) {
        if (fatal) {
            console.error(1027);
        }
        return opt_code_point || 0xFFFD;
    }
    /**
     * @private
     */
    EOF_byte = -1;
    /**
     * @private
     */
    EOF_code_point = -1;
    /**
     * @private
     *
     * @param a
     * @param min
     * @param max
     */
    InRange(a, min, max) {
        return min <= a && a <= max;
    }
    /**
     * @private
     *
     * @param n
     * @param d
     */
    Div(n, d) {
        return Math.floor(n / d);
    }
    /**
     * @private
     *
     * @param string
     */
    StringToCodePoints(str) {
        /** @type {Array.<number>} */
        let cps = [];
        // Based on http://www.w3.org/TR/WebIDL/#idl-DOMString
        let i = 0, n = str.length;
        while (i < str.length) {
            let c = str.charCodeAt(i);
            if (!this.InRange(c, 0xD800, 0xDFFF)) {
                cps.push(c);
            }
            else if (this.InRange(c, 0xDC00, 0xDFFF)) {
                cps.push(0xFFFD);
            }
            else { // (inRange(c, 0xD800, 0xDBFF))
                if (i == n - 1) {
                    cps.push(0xFFFD);
                }
                else {
                    let d = str.charCodeAt(i + 1);
                    if (this.InRange(d, 0xDC00, 0xDFFF)) {
                        let a = c & 0x3FF;
                        let b = d & 0x3FF;
                        i += 1;
                        cps.push(0x10000 + (a << 10) + b);
                    }
                    else {
                        cps.push(0xFFFD);
                    }
                }
            }
            i += 1;
        }
        return cps;
    }
}

/**
 * 处理器
 */
class Handler {
    method;
    caller;
    once = true;
    isOver = false;
    /**
     * 运行
     * @param args
     */
    Run(...args) {
        if (this.method && !this.isOver) {
            this.method.apply(this.caller, args);
            if (this.once) {
                this.isOver = true;
            }
        }
    }
    /**
     * 判断是否相同
     * @param value
     * @returns
     */
    Equal(value) {
        if (this.method == value.method && this.caller == value.caller) {
            return true;
        }
        return false;
    }
    /**
     * 创建一个实例
     * @param caller
     * @param method
     * @param once
     * @returns
     */
    static Create(caller, method, once = false) {
        var h = new Handler();
        h.caller = caller;
        h.method = method;
        h.once = once;
        h.isOver = false;
        return h;
    }
}

export { BitFlag, ByteArray, CCLoaderImpl, Dictionary, Event, EventDispatcher, FullURL, GetClassName, Handler, Injector, Key2URL, List, Loader, LoaderQueue, Res, ResImpl, ResManager, ResManagerImpl, ResRef, ResRequest, ResourceImpl, StringUtils, TickerManager, TickerManagerImpl, Timer, TimerImpl, URL2Key };
