/**
 * 事件分发器
 */
interface IEventDispatcher {
    /**
     * 添加事件
     * @param key
     * @param caller
     * @param handler
     * @param priority 优先级 数字越小优先级越高
     */
    On(key: string, handler: (type: string, target?: any, data?: any) => void, caller: any, priority?: number): void;
    /**
     * 删除事件监听
     * @param key
     * @param caller
     * @param handler
     */
    Off(key: string, handler: (type: string, target?: any, data?: any) => void, caller: any): void;
    /**
     * 删除指定对象所有的事件处理
     * @param caller
     */
    OffByCaller(caller: any): void;
    /**
     * 删除所有事件监听
     */
    OffAllEvent(): void;
    /**
     * 派发事件
     * @param key
     * @param data
     */
    Emit(key: string, data?: any): void;
    /**
     * 是否有事件监听
     * @param key
     */
    HasEvent(key: string): boolean;
    /**
     * 是否包含指定函数事件监听
     * @param key
     * @param caller
     * @param handler
     */
    HasEventHandler(key: string, handler: (type: string, target?: any, data?: any) => void, caller: any): boolean;
}

/**
 * 事件分发器(只有一对多的情况下去使用)
 */
declare class EventDispatcher implements IEventDispatcher {
    /**
    * 对象已经注册的处理器
    */
    private callerMap;
    /**
     * 事件派发器上所监听的处理器
     */
    private keyMap;
    /**
     * 需要派发的事件
     */
    private needEmit;
    constructor();
    /**
     * 添加事件
     * @param key
     * @param caller
     * @param func
     * @param priority 优先级（数字越小优先级越高）
     */
    On(key: string, handler: (type: string, target?: any, data?: any) => void, caller: any, priority?: number): void;
    /**
     * 删除事件监听
     * @param key
     * @param caller
     * @param handler
     */
    Off(key: string, handler: (type: string, target?: any, data?: any) => void, caller: any): void;
    /**
     * 删除指定对象所有的事件处理
     * @param caller
     */
    OffByCaller(caller: any): void;
    /**
     * 删除所有事件监听
     */
    OffAllEvent(): void;
    /**
     * 派发事件
     * @param type
     * @param data
     */
    Emit(type: string, data?: any): void;
    private __emit;
    /**
     * 是否有事件监听
     * @param key
     */
    HasEvent(key: string): boolean;
    /**
     * 是否包含指定函数事件监听
     * @param key
     * @param caller
     * @param func
     */
    HasEventHandler(key: string, handler: (type: string, target?: any, data?: any) => void, caller: any): boolean;
    Destroy(): void;
}

/**
 * 字典
 */
declare class Dictionary<TKey, TValue> extends EventDispatcher {
    private __map;
    private __list;
    constructor();
    /**
     * 设置
     * @param key
     * @param value
     */
    Set(key: TKey, value: TValue): void;
    /**
     * 是否拥有指定KEY的元素
     * @param key
     * @returns
     */
    Has(key: TKey): boolean;
    /**
     * 获取指定元素
     * @param key
     * @returns
     */
    Get(key: TKey): TValue | undefined;
    /**
     * 通过索引获取元素
     * @param index
     * @returns
     */
    GetValue(index: number): TValue | undefined;
    /**
     * 删除指定元素
     * @param key
     * @returns
     */
    Delete(key: TKey): TValue | undefined;
    /**
     * 清除所有元素
     */
    Clear(): void;
    /**
    * 元素列表
    */
    get elements(): Array<TValue>;
    get size(): number;
    Destroy(): void;
}

/**
 * 列表
 */
declare class List<T> extends EventDispatcher {
    private __element;
    /**
     * 是否保证元素的唯一性
     */
    private __only;
    /**
     * 元素数量(内部再增删时会修改这个参数，外部只做计算和绑定使用，切记不可做赋值操作！)
     */
    count: number;
    constructor(only?: boolean);
    /**
     * 添加到末尾(注意如果保证唯一性，那么重复时就直接返回)
     * @param value
     */
    Push(value: T): boolean;
    /**
     * 添加到列表头部(注意如果保证唯一性，那么重复时就直接返回)
     * @param value
     * @returns
     */
    Unshift(value: T): boolean;
    /**
     * 获取并删除最后一个元素
     * @returns
     */
    Pop(): T;
    /**
     * 获取并删除第一个元素
     * @returns
     */
    Shift(): T;
    /**
     * 删除指定索引的元素
     * @param index
     */
    RemoveAt(index: number): T;
    /**
     * 删除元素
     * @param value
     */
    Remove(value: T): void;
    /**
     * 移除所有元素
     */
    Clear(): void;
    /**
     * 判断是否包含
     * @param value
     * @returns
     */
    Has(value: T): boolean;
    /**
     * 查找元素下标
     * @param value
     * @returns
     */
    Find(value: T): number;
    /**
     * 查找元素下标
     * @param predicate
     * @returns
     */
    FindIndex(predicate: (value: T, index: number, obj: T[]) => unknown): number;
    /**
     * 获取指定元素
     * @param index
     * @returns
     */
    Get(index: number): T;
    /**
     * 源列表数据(注意不要直接进行增删操作，而是通过List.push....等接口进行操作)
     */
    get elements(): Array<T>;
}

declare class Event {
    static readonly START: string;
    static readonly PROGRESS: string;
    static readonly COMPLETE: string;
    static readonly ERROR: string;
    static readonly SHOW: string;
    static readonly HIDE: string;
    static readonly ADD: string;
    static readonly REMOVE: string;
    static readonly UPDATE: string;
    static readonly CLEAR: string;
    static readonly State_Changed: string;
    /**事件通道 */
    private static channels;
    /**
     * 获取事件通道
     * @param key
     * @returns
     */
    static GetChannel(key?: string): EventDispatcher;
    /**
     * 派发事件
     * @param eventType
     * @param data
     * @param channel   通道
     */
    static Emit(eventType: string, data?: any, channel?: string): void;
    /**
     * 添加事件监听
     * @param type
     * @param handler
     * @param caller
     * @param priority  优先级
     * @param channel   事件通道
     */
    static On(type: string, handler: (type: string, target?: any, ...arg: any[]) => void, caller: any, priority?: number, channel?: string): void;
    /**
     * 删除事件监听
     * @param type
     * @param handler
     * @param caller
     * @param channel
     * @returns
     */
    static Off(type: string, handler: (type: string, target?: any, ...arg: any[]) => void, caller: any, channel?: string): void;
    /**
     * 删除指定对象上的所有事件监听
     * @param caller
     * @param channel
     * @returns
     */
    static OffByCaller(caller: any, channel?: string): void;
    /**
     * 删除指定通道上的所有事件监听
     * @param channel
     * @returns
     */
    static OffAll(channel?: string): void;
}

/**
 * 获取类名
 * @param clazz
 * @returns
 */
declare function GetClassName(clazz: any): string;

/**
 * 资源地址
 */
type ResURL = string | {
    url: string;
    bundle: string;
    type: string | any;
};
/**
 * 资源地址转唯一KEY
 * @param url
 * @returns
 */
declare function URL2Key(url: ResURL): string;
/**
 * 唯一key转URL
 * @param key
 * @returns
 */
declare function Key2URL(key: string): ResURL;
/**
 * 获取全路径
 * @param url
 * @returns
 */
declare function FullURL(url: ResURL): string;

interface ILoader extends IEventDispatcher {
    /**
     * 加载
     * @param url
     */
    Load(url: ResURL): void;
    /**
     * 重置
     */
    Reset(): void;
}

/**
 * 加载器CC实现
 */
declare class CCLoaderImpl extends EventDispatcher implements ILoader {
    url: ResURL;
    constructor();
    Load(url: ResURL): void;
    Reset(): void;
}

declare class ResRef {
    /**唯一KEY */
    key: string;
    /**引用KEY */
    refKey: string | undefined;
    /**资源内容 */
    content: any;
    /**是否已释放 */
    private __isDispose;
    constructor();
    /**释放 */
    Dispose(): void;
    get isDispose(): boolean;
    Reset(): void;
    /**
     * 彻底销毁(注意内部接口，请勿调用)
     */
    Destroy(): void;
}

interface IRes {
    /**
     * 设置加载器
     * @param key
     * @param loader
     */
    SetResLoader(key: any, loader: new () => ILoader): void;
    /**
     * 获取加载器
     * @param key
     */
    GetResLoader(key: any): new () => ILoader;
    /**
    * 获取资源
    * @param url
    * @param refKey
    * @param progress
    */
    GetResRef(url: ResURL, refKey: string, progress?: (progress: number) => void): Promise<ResRef>;
    /**
     * 获取资源列表
     * @param urls
     * @param refKey
     * @param progress
     */
    GetResRefList(urls: Array<ResURL>, refKey: string, progress?: (progress: number) => void): Promise<Array<ResRef>>;
    /**
     * 获取资源列表按照URL存放到字典中
     * @param urls
     * @param refKey
     * @param result
     * @param progress
     */
    GetResRefMap(urls: Array<ResURL>, refKey: string, result?: Map<string, ResRef>, progress?: (progress: number) => void): Promise<Map<string, ResRef>>;
}

declare class ResImpl implements IRes {
    private loaderClass;
    constructor();
    SetResLoader(key: any, loader: new () => ILoader): void;
    GetResLoader(key: any): new () => ILoader;
    GetResRef(url: ResURL, refKey: string, progress?: (progress: number) => void): Promise<ResRef>;
    GetResRefList(urls: ResURL[], refKey: string, progress?: (progress: number) => void): Promise<ResRef[]>;
    GetResRefMap(urls: ResURL[], refKey: string, result?: Map<string, ResRef>, progress?: (progress: number) => void): Promise<Map<string, ResRef>>;
}

/**
 * 心跳接口
 */
interface ITicker {
    /**
     * 心跳
     * @param dt    间隔时间(秒)
     */
    Tick(dt: number): void;
}

/**
 * 资源接口
 */
interface IResource {
    /**
     * 资源全局唯一KEY
     */
    key: string;
    /**
     * 最后一次操作的时间点
     */
    lastOpTime: number;
    /**
     * 资源
     */
    content: any;
    /**
     * 资源引用数量
     */
    readonly refCount: number;
    /**
     * 资源引用列表长度
     */
    readonly refLength: number;
    /**
     * 添加一个引用
     * @param refKey
     */
    AddRef(refKey?: string): ResRef;
    /**
     * 删除引用
     * @param value
     */
    RemoveRef(value: ResRef): void;
    /**销毁*/
    Destroy(): void;
}

/**
 * 资源管理器接口
 */
interface IResManager extends ITicker {
    /**
     * 添加一个资源
     * @param value
     */
    AddRes(value: IResource): void;
    /**
     * 获取资源(内部接口)
     * @param key
     */
    _getRes(key: string): IResource;
    /**
     * 是否包含该资源
     * @param key
     */
    HasRes(key: string): boolean;
    /**
     * 添加并返回一个资源引用
     * @param key
     * @param refKey
     */
    AddResRef(key: string, refKey?: string): ResRef;
    /**
     * 删除一个资源引用
     * @param value
     */
    RemoveResRef(value: ResRef): void;
    /**
     * 资源清理
     */
    GC(ignoreTime?: boolean): void;
    /**
     * 资源列表
     */
    readonly resList: Array<IResource>;
}

/**
 * 默认资源管理器
 * @internal
 */
declare class ResManagerImpl implements IResManager {
    /**
     * 资源
     */
    protected __resDic: Dictionary<string, IResource>;
    /**
     * 等待销毁的资源
     */
    protected _waitDestroy: Array<IResource>;
    constructor();
    Tick(dt: number): void;
    AddRes(value: IResource): void;
    HasRes(key: string): boolean;
    _getRes(key: string): IResource;
    AddResRef(key: string, refKey?: string): ResRef;
    RemoveResRef(value: ResRef): void;
    GC(ignoreTime?: boolean): void;
    /**
     * 销毁
     * @param value
     */
    protected DestroyRes(value: IResource): void;
    get resList(): Array<IResource>;
}

declare class ResourceImpl implements IResource {
    /**
     * 状态 0 正常 1待删除
     */
    state: number;
    key: string;
    lastOpTime: number;
    /**
     * @internal
     */
    private __refs;
    constructor();
    set content(value: any);
    private __content;
    get content(): any;
    AddRef(refKey?: string): ResRef;
    RemoveRef(value: ResRef): void;
    Destroy(): void;
    /**
     * 引用数量
     */
    get refCount(): number;
    /**
     * 引用列表长度
     */
    get refLength(): number;
}

/**
 * 心跳管理器
 */
interface ITickerManager {
    /**
     * 心跳驱动函数
     * @param dt
     */
    Tick(dt: number): void;
    /**
     * 添加心跳
     * @param value
     */
    AddTicker(value: ITicker): void;
    /**
     * 删除心跳
     * @param value
     */
    RemoveTicker(value: ITicker): void;
    /**
     * 下一帧回调
     * @param value
     * @param caller
     */
    CallNextFrame(value: Function, caller: any): void;
    /**
     * 清理下一帧回调请求(如果存在的话)
     * @param value
     * @param caller
     */
    ClearNextFrame(value: Function, caller: any): void;
}

declare class TickerManagerImpl implements ITickerManager {
    private __tickerList;
    private __nextFrameCallBacks;
    Tick(dt: number): void;
    AddTicker(value: ITicker): void;
    RemoveTicker(value: ITicker): void;
    CallNextFrame(value: Function, caller: any): void;
    ClearNextFrame(value: Function, caller: any): void;
}

/**
 * 计时器接口
 */
interface ITimer {
    /**
     * 当前时间(推荐使用)
     */
    readonly currentTime: number;
    /**
     * 绝对时间(注意效率较差，不推荐使用！)
     */
    readonly absTime: number;
    /**
     * 重新校准
     */
    Reset(time?: number): void;
}

declare class TimerImpl implements ITimer, ITicker {
    private __lastTime;
    constructor();
    Reset(): void;
    Tick(dt: number): void;
    get currentTime(): number;
    get absTime(): number;
}

declare class Loader {
    private requests;
    constructor();
    /**
     * 加载
     * @param url
     * @param resKey
     * @param cb
     * @param progress
     */
    Load(url: ResURL | Array<ResURL>, cb?: (err: Error) => void, progress?: (progress: number) => void): void;
    ChildComplete(url: ResURL): void;
    ChildError(url: ResURL, err: Error): void;
    ChildProgress(url: ResURL, progress: number): void;
    /**
     * 添加
     * @param request
     */
    private __addReqeuset;
    /**
     * 删除
     * @param request
     */
    private __deleteReqeuset;
    private static __instance;
    static get single(): Loader;
}

declare class LoaderQueue implements ITicker {
    /**
     * 加载中
     */
    private running;
    /**
     * 等待加载
     */
    private waiting;
    /**
     * 对象池
     */
    private pool;
    constructor();
    Tick(dt: number): void;
    private __addEvent;
    private __eventHandler;
    Load(url: ResURL): void;
    private static __instance;
    static get single(): LoaderQueue;
}

declare class ResRequest {
    /**
     * 资源地址
     */
    urls: Array<ResURL>;
    /**
     * 完成回调
     */
    cb?: (err: Error) => void;
    /**
     * 进度处理器
     */
    progress?: (progress: number) => void;
    private __loadedMap;
    constructor(url: ResURL | Array<ResURL>, cb?: (err: Error) => void, progress?: (progress: number) => void);
    Load(): void;
    ChildComplete(resURL: ResURL): void;
    ChildProgress(resURL: ResURL, progress: number): void;
    ChildError(err: Error): void;
    UpdateProgress(): void;
    private getLoaded;
    Destroy(): void;
}

declare class Res {
    static KEY: string;
    /**
     * 最大加载线程
     */
    static MAX_LOADER_THREAD: number;
    /**
     * 设置资源加载器
     * @param key
     * @param loader
     */
    static SetResLoader(key: any, loader: new () => ILoader): void;
    /**
     * 获取资源加载器
     * @param key
     * @returns
     */
    static GetResLoader(key: any): new () => ILoader;
    /**
     * 获取资源
     * @param url
     * @param refKey
     * @param cb
     * @param progress
     */
    static GetResRef(url: ResURL, refKey: string, progress?: (progress: number) => void): Promise<ResRef>;
    /**
     * 获取资源列表
     * @param url
     * @param refKey
     * @param cb
     * @param progress
     */
    static GetResRefList(url: Array<ResURL>, refKey: string, progress?: (progress: number) => void): Promise<Array<ResRef>>;
    /**
     * 获取资源列表并放入字典中
     * @param url
     * @param refKey
     * @param result
     * @param cb
     * @param progress
     */
    static GetResRefMap(url: Array<ResURL>, refKey: string, result?: Map<string, ResRef>, progress?: (progress: number) => void): Promise<Map<string, ResRef>>;
    private static __impl;
    private static get impl();
}

/**
 * 资源管理器
 */
declare class ResManager {
    static KEY: string;
    /**
     * 资源保留长时间GC
     */
    static GC_TIME: number;
    /**
     * 自动清理
     */
    static AUTO_GC: boolean;
    /**
     * 添加一个资源
     * @param value
     */
    static AddRes(value: IResource): void;
    /**
     * 是否包含该资源
     * @param key
     */
    static HasRes(key: string): boolean;
    /**
     * 获取资源（内部接口）
     * @param key
     * @returns
     */
    static _getRes(key: string): IResource;
    /**
     * 添加并返回一个资源引用
     * @param key
     * @param refKey
     */
    static AddResRef(key: string, refKey?: string): ResRef;
    /**
     * 删除一个资源引用
     * @param value
     */
    static RemoveResRef(value: ResRef): void;
    /**
     * 资源清理
     */
    static GC(ignoreTime?: boolean): void;
    /**
     * 资源列表
     * @returns
     */
    static get resList(): Array<IResource>;
    private static __impl;
    private static get impl();
}

/**
 * 心跳管理器
 */
declare class TickerManager {
    static KEY: string;
    /**
     * 心跳驱动接口
     * @param dt
     */
    static Tick(dt: number): void;
    /**
     * 添加
     * @param value
     */
    static AddTicker(value: ITicker): void;
    /**
     * 删除
     * @param value
     */
    static RemoveTicker(value: ITicker): void;
    /**
     * 下一帧回调
     * @param value
     */
    static CallNextFrame(value: Function, caller: any): void;
    /**
     * 清理回调
     * @param value
     * @param caller
     */
    static ClearNextFrame(value: Function, caller: any): void;
    private static __impl;
    static get impl(): ITickerManager;
}

/**
 * 计时器工具类
 */
declare class Timer {
    static KEY: string;
    /**
     * 当前时间(推荐使用)
     */
    static get currentTime(): number;
    /**
     * 绝对时间(注意效率较差，不推荐使用！)
     */
    static get absTime(): number;
    /**
     * 重新校准
     * @param time  时间起点，如果不设置则获取系统当前时间点
     */
    static Reset(time?: number): void;
    private static __impl;
    private static get impl();
}

/**
 * bit位操作
 */
declare class BitFlag {
    private __flags;
    private __elements;
    constructor();
    Add(flag: number): void;
    Remove(flag: number): void;
    /**
     * 是否包含
     * @param flag
     * @returns
     */
    Has(flag: number): boolean;
    /**
     * 位码
     */
    get flags(): number;
    get elements(): Array<number>;
    Destroy(): void;
}

declare const enum EndianConst {
    LITTLE_ENDIAN = 0,
    BIG_ENDIAN = 1
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
declare class ByteArray {
    /**
     * @private
     */
    protected bufferExtSize: number;
    protected data: DataView;
    protected _bytes: Uint8Array;
    /**
     * @private
     */
    protected _position: number;
    /**
     *
     * 已经使用的字节偏移量
     * @protected
     * @type {number}
     * @memberOf ByteArray
     */
    protected write_position: number;
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
    get endian(): string;
    set endian(value: string);
    protected $endian: EndianConst;
    /**
     * @version Egret 2.4
     * @platform Web,Native
     */
    constructor(buffer?: ArrayBuffer | Uint8Array, bufferExtSize?: number);
    Reset(): void;
    Destroy(): void;
    /**
     * @deprecated
     * @version Egret 2.4
     * @platform Web,Native
     */
    SetArrayBuffer(buffer: ArrayBuffer): void;
    /**
     * 可读的剩余字节数
     *
     * @returns
     *
     * @memberOf ByteArray
     */
    get readAvailable(): number;
    get buffer(): ArrayBuffer;
    get rawBuffer(): ArrayBuffer;
    /**
     * @private
     */
    set buffer(value: ArrayBuffer);
    get bytes(): Uint8Array;
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    get dataView(): DataView;
    /**
     * @private
     */
    set dataView(value: DataView);
    /**
     * @private
     */
    get bufferOffset(): number;
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
    get position(): number;
    set position(value: number);
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
    get length(): number;
    set length(value: number);
    protected _validateBuffer(value: number): void;
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
    get bytesAvailable(): number;
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
    Clear(): void;
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
    ReadBoolean(): boolean;
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
    ReadByte(): number;
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
    ReadBytes(bytes: ByteArray, offset?: number, length?: number): void;
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
    ReadDouble(): number;
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
    ReadFloat(): number;
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
    ReadInt(): number;
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
    ReadShort(): number;
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
    ReadUnsignedByte(): number;
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
    ReadUnsignedInt(): number;
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
    ReadUnsignedShort(): number;
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
    ReadUTF(): string;
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
    ReadUTFBytes(length: number): string;
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
    WriteBoolean(value: boolean): void;
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
    WriteByte(value: number): void;
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
    WriteBytes(bytes: ByteArray, offset?: number, length?: number): void;
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
    WriteDouble(value: number): void;
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
    WriteFloat(value: number): void;
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
    WriteInt(value: number): void;
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
    WriteShort(value: number): void;
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
    WriteUnsignedInt(value: number): void;
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
    WriteUnsignedShort(value: number): void;
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
    WriteUTF(value: string): void;
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
    WriteUTFBytes(value: string): void;
    /**
     *
     * @returns
     * @version Egret 2.4
     * @platform Web,Native
     */
    ToString(): string;
    /**
     * @private
     * 将 Uint8Array 写入字节流
     * @param bytes 要写入的Uint8Array
     * @param validateBuffer
     */
    _writeUint8Array(bytes: Uint8Array | ArrayLike<number>, validateBuffer?: boolean): void;
    /**
     * @param len
     * @returns
     * @version Egret 2.4
     * @platform Web,Native
     * @private
     */
    Validate(len: number): boolean;
    /**********************/
    /**********************/
    /**
     * @private
     * @param len
     * @param needReplace
     */
    protected ValidateBuffer(len: number): void;
    /**
     * @private
     * UTF-8 Encoding/Decoding
     */
    private EncodeUTF8;
    /**
     * @private
     *
     * @param data
     * @returns
     */
    private DecodeUTF8;
    /**
     * @private
     *
     * @param code_point
     */
    private EncoderError;
    /**
     * @private
     *
     * @param fatal
     * @param opt_code_point
     * @returns
     */
    private DecoderError;
    /**
     * @private
     */
    private EOF_byte;
    /**
     * @private
     */
    private EOF_code_point;
    /**
     * @private
     *
     * @param a
     * @param min
     * @param max
     */
    private InRange;
    /**
     * @private
     *
     * @param n
     * @param d
     */
    private Div;
    /**
     * @private
     *
     * @param string
     */
    private StringToCodePoints;
}

/**
 * 处理器
 */
declare class Handler {
    method?: Function;
    caller: any;
    once: boolean;
    private isOver;
    /**
     * 运行
     * @param args
     */
    Run(...args: any[]): void;
    /**
     * 判断是否相同
     * @param value
     * @returns
     */
    Equal(value: Handler): boolean;
    /**
     * 创建一个实例
     * @param caller
     * @param method
     * @param once
     * @returns
     */
    static Create(caller: any, method: Function | undefined, once?: boolean): Handler;
}

/**
 * 注入器
 */
declare class Injector {
    /**类型字典*/
    private static __injectedMap;
    /**实例字典*/
    private static __instanceMap;
    /**
     * 注入
     * @param key
     * @param clazz   类型或实例
     */
    static Inject(customKey: string, clazz: any): void;
    /**
     * 获取已注入的类型实例
     */
    static GetInject(customKey: string): any | null;
}

declare class StringUtils {
    /**
     * 是否为空
     * @param str
     */
    static IsEmpty(str: string): boolean;
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
    static Substitute(str: string, ...rest: any[]): string;
    /**
    * 替换全部字符串
    * @param string src 源串
    * @param string from_ch 被替换的字符
    * @param string to_ch 替换的字符
    *
    * @return string 结果字符串
    */
    static ReplaceAll(src: string, from_ch: string, to_ch: string): string;
    /**
     * 拆分字符串
     * @param str
     */
    static SplitString(str: string, split0: string, split1: string): string[][];
    /**
     * 获取文件后缀名
     * @param url
     */
    static GetFileSuffix(url: string): string;
    /**
     * 替换后缀
     * @param url
     * @param suff      后缀
     * @returns
     */
    static ReplaceSuffix(url: string, suff: string): string;
}

export { BitFlag, ByteArray, CCLoaderImpl, Dictionary, Event, EventDispatcher, FullURL, GetClassName, Handler, IEventDispatcher, ILoader, IRes, IResManager, IResource, ITicker, ITickerManager, ITimer, Injector, Key2URL, List, Loader, LoaderQueue, Res, ResImpl, ResManager, ResManagerImpl, ResRef, ResRequest, ResURL, ResourceImpl, StringUtils, TickerManager, TickerManagerImpl, Timer, TimerImpl, URL2Key };
