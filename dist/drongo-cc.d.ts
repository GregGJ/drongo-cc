import { Node, AudioSource, Color, Vec2, Component, Mask, Constructor, EventTarget, Event as Event$2, Size, Sprite, Rect, SpriteFrame, AssetManager, Asset, dragonBones, UITransform, UIOpacity, Graphics, AudioClip, Label, Font, LabelOutline, LabelShadow, HorizontalTextAlignment, VerticalTextAlignment, RichText, EditBox, sp } from 'cc';

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

/**
 * 音频通道
 */
interface IAudioChannel {
    readonly isPlaying: boolean;
    readonly url: ResURL;
    readonly curVolume: number;
    /**
     * 音量
     */
    volume: number;
    mute: boolean;
    /**
     * 播放
     * @param url
     * @param playedComplete
     * @param volume
     * @param fade
     * @param loop
     * @param speed
     */
    Play(url: ResURL, playedComplete: Function, volume: number, fade: {
        time: number;
        startVolume: number;
        complete?: Function;
    }, loop: boolean, speed: number): void;
    /**
     * 停止
     */
    Stop(): void;
    /**
     *
     * @param time
     * @param startVolume
     * @param endVolume
     * @param complete
     * @param completeStop  结束后是否停止播放
     */
    Fade(time: number, endVolume: number, startVolume?: number, complete?: Function, completeStop?: boolean): void;
    /**
     * 心跳
     * @param dt
     */
    Tick(dt: number): void;
    /**
     * 暂停
     */
    Pause(): void;
    /**
     * 继续播放
     */
    Resume(): void;
}

/**
 * 音频管理器
 */
declare class AudioManager {
    /**
     * 全局唯一注入KEY
     */
    static KEY: string;
    /**
     * 最大音频轨道数量
     */
    static MAX_SOUND_CHANNEL_COUNT: number;
    /**
     * 总音量
     */
    static get volume(): number;
    static set volume(value: number);
    /**
     * 音乐音量
     */
    static get musicVolume(): number;
    static set musicVolume(value: number);
    /**
     * 声音音量
     */
    static get soundVolume(): number;
    static set soundVolume(value: number);
    /**
     * 静音总开关
     */
    static get mute(): boolean;
    static set mute(value: boolean);
    /**
     * 音乐静音开关
     */
    static get muteMusic(): boolean;
    static set muteMusic(value: boolean);
    /**
     * 声音静音开关
     */
    static get muteSound(): boolean;
    static set muteSound(value: boolean);
    /**
     * 播放音乐
     * @param value
     */
    static PlayMusic(url: ResURL, volume?: number, speed?: number, loop?: boolean): void;
    /**
     * 停止音乐
     */
    static StopMusic(): void;
    /**
     * 暂停
     */
    static PauseMusic(): void;
    /**
     * 继续播放
     */
    static ResumeMusic(): void;
    /**
     * 播放声音
     * @param value
     */
    static PlaySound(url: ResURL, playedCallBack: Function, volume: number, speed: number, loop: boolean): void;
    /**
     * 获取正在播放指定音频的轨道
     * @param url
     */
    static GetPlaying(url: ResURL): IAudioChannel;
    private static __impl;
    private static get impl();
}

/**
 * 音频组
 */
interface IAudioGroup {
    key: number;
    volume: number;
    mute: boolean;
    CalculateVolume(): void;
    CalculateMute(): void;
    Tick(dt: number): void;
    Play(url: ResURL, playedCallBack: Function, volume: number, speed: number, loop: boolean): void;
    GetPlayingChannel(url: ResURL): IAudioChannel;
    StopAll(): void;
}

/**
 * 音频管理器
 */
interface IAudioManager {
    /**
     * 总音量
     */
    volume: number;
    /**
     * 音乐音量
     */
    musicVolume: number;
    /**
     * 声音音量
     */
    soundVolume: number;
    mute: boolean;
    muteMusic: boolean;
    muteSound: boolean;
    /**
     * 播放音乐
     * @param value
     */
    PlayMusic(url: ResURL, volume: number, speed: number, loop: boolean): void;
    /**
     * 停止音乐
     */
    StopMusic(): void;
    /**
     * 暂停
     */
    PauseMusic(): void;
    /**
     * 继续播放
     */
    ResumeMusic(): void;
    /**
     * 播放声音
     * @param value
     */
    PlaySound(url: ResURL, playedCallBack: Function, volume: number, speed: number, loop: boolean): void;
    /**
     * 获取正在播放指定音频的轨道
     * @param url
     */
    GetPlaying(url: ResURL): IAudioChannel;
}

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

declare class Event$1 {
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

declare class AudioChannelImpl implements IAudioChannel {
    private __node;
    private __source;
    private __isPlaying;
    private __url;
    private __volume;
    private __speed;
    private __loop;
    private __startTime;
    private __time;
    private __fadeData;
    private __paused;
    private __pauseTime;
    private __playedComplete;
    private __ref;
    private __mute;
    volume: number;
    constructor(node: Node, source?: AudioSource);
    get url(): ResURL;
    get mute(): boolean;
    set mute(value: boolean);
    Play(url: ResURL, playedComplete: Function, volume: number, fade?: {
        time: number;
        startVolume?: number;
        complete?: Function;
        completeStop?: boolean;
    }, loop?: boolean, speed?: number): void;
    Stop(): void;
    get isPlaying(): boolean;
    /**
     *
     * @param time
     * @param endVolume
     * @param startVolume
     * @param complete
     * @param completeStop
     * @returns
     */
    Fade(time: number, endVolume: number, startVolume?: number, complete?: Function, completeStop?: boolean): void;
    private __reset;
    private __clipLoaded;
    private __play;
    Tick(dt: number): void;
    Resume(): void;
    Pause(): void;
    get curVolume(): number;
}

/**
 * 音频播放管理器
 */
declare class AudioManagerImpl implements IAudioManager {
    private __audioRoot;
    private __musicChannels;
    private __musicChannelIndex;
    private __soundChannels;
    constructor();
    /**
     * 总音量
     */
    get volume(): number;
    private __volume;
    set volume(value: number);
    /**
     * 音乐总音量控制
     */
    set musicVolume(value: number);
    private __musicVolume;
    get musicVolume(): number;
    /**
     * 声音总音量
     */
    get soundVolume(): number;
    private __soundVolume;
    set soundVolume(value: number);
    set mute(value: boolean);
    private __mute;
    get mute(): boolean;
    get muteMusic(): boolean;
    private __muteMusic;
    set muteMusic(value: boolean);
    get muteSound(): boolean;
    private __muteSound;
    set muteSound(value: boolean);
    private __changedMutes;
    PlayMusic(url: ResURL, volume: number, speed: number, loop: boolean): void;
    StopMusic(): void;
    PauseMusic(): void;
    ResumeMusic(): void;
    PlaySound(url: ResURL, playedCallBack: Function, volume: number, speed: number, loop: boolean): void;
    GetPlaying(url: ResURL): IAudioChannel;
    private GetIdleChannel;
    Tick(dt: number): void;
}

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
    private checkComplete;
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

declare class ByteBuffer {
    stringTable: Array<string>;
    version: number;
    littleEndian: boolean;
    protected _view: DataView;
    protected _bytes: Uint8Array;
    protected _pos: number;
    protected _length: number;
    constructor(buffer: ArrayBuffer, offset?: number, length?: number);
    get data(): Uint8Array;
    get position(): number;
    set position(value: number);
    skip(count: number): void;
    private validate;
    readByte(): number;
    readBool(): boolean;
    readShort(): number;
    readUshort(): number;
    readInt(): number;
    readUint(): number;
    readFloat(): number;
    readString(len?: number): string;
    readS(): string;
    readSArray(cnt: number): Array<string>;
    writeS(value: string): void;
    readColor(hasAlpha?: boolean): Color;
    readChar(): string;
    readBuffer(): ByteBuffer;
    seek(indexTablePos: number, blockIndex: number): boolean;
}

interface IHitTest {
    hitTest(pt: Vec2, globalPt: Vec2): boolean;
}
declare class PixelHitTestData {
    pixelWidth: number;
    scale: number;
    pixels: Uint8Array;
    constructor(ba: ByteBuffer);
}

declare enum ButtonMode {
    Common = 0,
    Check = 1,
    Radio = 2
}
declare enum AutoSizeType {
    None = 0,
    Both = 1,
    Height = 2,
    Shrink = 3
}
declare enum AlignType {
    Left = 0,
    Center = 1,
    Right = 2
}
declare enum VertAlignType {
    Top = 0,
    Middle = 1,
    Bottom = 2
}
declare enum LoaderFillType {
    None = 0,
    Scale = 1,
    ScaleMatchHeight = 2,
    ScaleMatchWidth = 3,
    ScaleFree = 4,
    ScaleNoBorder = 5
}
declare enum ListLayoutType {
    SingleColumn = 0,
    SingleRow = 1,
    FlowHorizontal = 2,
    FlowVertical = 3,
    Pagination = 4
}
declare enum ListSelectionMode {
    Single = 0,
    Multiple = 1,
    Multiple_SingleClick = 2,
    None = 3
}
declare enum OverflowType {
    Visible = 0,
    Hidden = 1,
    Scroll = 2
}
declare enum PackageItemType {
    Image = 0,
    MovieClip = 1,
    Sound = 2,
    Component = 3,
    Atlas = 4,
    Font = 5,
    Swf = 6,
    Misc = 7,
    Unknown = 8,
    Spine = 9,
    DragonBones = 10
}
declare enum ObjectType {
    Image = 0,
    MovieClip = 1,
    Swf = 2,
    Graph = 3,
    Loader = 4,
    Group = 5,
    Text = 6,
    RichText = 7,
    InputText = 8,
    Component = 9,
    List = 10,
    Label = 11,
    Button = 12,
    ComboBox = 13,
    ProgressBar = 14,
    Slider = 15,
    ScrollBar = 16,
    Tree = 17,
    Loader3D = 18
}
declare enum ProgressTitleType {
    Percent = 0,
    ValueAndMax = 1,
    Value = 2,
    Max = 3
}
declare enum FlipType {
    None = 0,
    Horizontal = 1,
    Vertical = 2,
    Both = 3
}
declare enum ChildrenRenderOrder {
    Ascent = 0,
    Descent = 1,
    Arch = 2
}
declare enum PopupDirection {
    Auto = 0,
    Up = 1,
    Down = 2
}
declare enum RelationType {
    Left_Left = 0,
    Left_Center = 1,
    Left_Right = 2,
    Center_Center = 3,
    Right_Left = 4,
    Right_Center = 5,
    Right_Right = 6,
    Top_Top = 7,
    Top_Middle = 8,
    Top_Bottom = 9,
    Middle_Middle = 10,
    Bottom_Top = 11,
    Bottom_Middle = 12,
    Bottom_Bottom = 13,
    Width = 14,
    Height = 15,
    LeftExt_Left = 16,
    LeftExt_Right = 17,
    RightExt_Left = 18,
    RightExt_Right = 19,
    TopExt_Top = 20,
    TopExt_Bottom = 21,
    BottomExt_Top = 22,
    BottomExt_Bottom = 23,
    Size = 24
}
declare enum FillMethod {
    None = 0,
    Horizontal = 1,
    Vertical = 2,
    Radial90 = 3,
    Radial180 = 4,
    Radial360 = 5
}
declare enum FillOrigin {
    Top = 0,
    Bottom = 1,
    Left = 2,
    Right = 3
}

declare class Margin {
    left: number;
    right: number;
    top: number;
    bottom: number;
    constructor();
    copy(source: Margin): void;
    isNone(): boolean;
}

declare class GScrollBar extends GComponent {
    private _grip;
    private _arrowButton1;
    private _arrowButton2;
    private _bar;
    private _target;
    private _vertical;
    private _scrollPerc;
    private _fixedGripSize;
    private _dragOffset;
    private _gripDragging;
    constructor();
    setScrollPane(target: ScrollPane, vertical: boolean): void;
    setDisplayPerc(value: number): void;
    setScrollPerc(val: number): void;
    get minSize(): number;
    get gripDragging(): boolean;
    protected constructExtension(buffer: ByteBuffer): void;
    private onGripTouchDown;
    private onGripTouchMove;
    private onGripTouchEnd;
    private onClickArrow1;
    private onClickArrow2;
    private onBarTouchBegin;
}

declare class ScrollPane extends Component {
    private _owner;
    private _container;
    private _maskContainer;
    private _scrollType;
    private _scrollStep;
    private _mouseWheelStep;
    private _decelerationRate;
    private _scrollBarMargin;
    private _bouncebackEffect;
    private _touchEffect;
    private _scrollBarDisplayAuto?;
    private _vScrollNone;
    private _hScrollNone;
    private _needRefresh;
    private _refreshBarAxis;
    private _displayOnLeft?;
    private _snapToItem?;
    private _snappingPolicy?;
    _displayInDemand?: boolean;
    private _mouseWheelEnabled;
    private _pageMode?;
    private _inertiaDisabled?;
    private _floating?;
    private _dontClipMargin?;
    private _xPos;
    private _yPos;
    private _viewSize;
    private _contentSize;
    private _overlapSize;
    private _pageSize;
    private _containerPos;
    private _beginTouchPos;
    private _lastTouchPos;
    private _lastTouchGlobalPos;
    private _velocity;
    private _velocityScale;
    private _lastMoveTime;
    private _isHoldAreaDone;
    private _aniFlag;
    _loop: number;
    private _headerLockedSize;
    private _footerLockedSize;
    private _refreshEventDispatching;
    private _dragged;
    private _hover;
    private _tweening;
    private _tweenTime;
    private _tweenDuration;
    private _tweenStart;
    private _tweenChange;
    private _pageController?;
    private _hzScrollBar?;
    private _vtScrollBar?;
    private _header?;
    private _footer?;
    static draggingPane: ScrollPane;
    setup(buffer: ByteBuffer): void;
    protected onDestroy(): void;
    hitTest(pt: Vec2, globalPt: Vec2): GObject;
    get owner(): GComponent;
    get hzScrollBar(): GScrollBar;
    get vtScrollBar(): GScrollBar;
    get header(): GComponent;
    get footer(): GComponent;
    get bouncebackEffect(): boolean;
    set bouncebackEffect(sc: boolean);
    get touchEffect(): boolean;
    set touchEffect(sc: boolean);
    set scrollStep(val: number);
    get decelerationRate(): number;
    set decelerationRate(val: number);
    get scrollStep(): number;
    get snapToItem(): boolean;
    set snapToItem(value: boolean);
    get snappingPolicy(): number;
    set snappingPolicy(value: number);
    get mouseWheelEnabled(): boolean;
    set mouseWheelEnabled(value: boolean);
    get isDragged(): boolean;
    get percX(): number;
    set percX(value: number);
    setPercX(value: number, ani?: boolean): void;
    get percY(): number;
    set percY(value: number);
    setPercY(value: number, ani?: boolean): void;
    get posX(): number;
    set posX(value: number);
    setPosX(value: number, ani?: boolean): void;
    get posY(): number;
    set posY(value: number);
    setPosY(value: number, ani?: boolean): void;
    get contentWidth(): number;
    get contentHeight(): number;
    get viewWidth(): number;
    set viewWidth(value: number);
    get viewHeight(): number;
    set viewHeight(value: number);
    get currentPageX(): number;
    set currentPageX(value: number);
    get currentPageY(): number;
    set currentPageY(value: number);
    setCurrentPageX(value: number, ani?: boolean): void;
    setCurrentPageY(value: number, ani?: boolean): void;
    get isBottomMost(): boolean;
    get isRightMost(): boolean;
    get pageController(): Controller;
    set pageController(value: Controller);
    get scrollingPosX(): number;
    get scrollingPosY(): number;
    scrollTop(ani?: boolean): void;
    scrollBottom(ani?: boolean): void;
    scrollUp(ratio?: number, ani?: boolean): void;
    scrollDown(ratio?: number, ani?: boolean): void;
    scrollLeft(ratio?: number, ani?: boolean): void;
    scrollRight(ratio?: number, ani?: boolean): void;
    scrollToView(target: any, ani?: boolean, setFirst?: boolean): void;
    isChildInView(obj: GObject): boolean;
    cancelDragging(): void;
    lockHeader(size: number): void;
    lockFooter(size: number): void;
    onOwnerSizeChanged(): void;
    handleControllerChanged(c: Controller): void;
    private updatePageController;
    adjustMaskContainer(): void;
    setSize(aWidth: number, aHeight: number): void;
    setContentSize(aWidth: number, aHeight: number): void;
    changeContentSizeOnScrolling(deltaWidth: number, deltaHeight: number, deltaPosX: number, deltaPosY: number): void;
    private handleSizeChanged;
    private posChanged;
    private refresh;
    private refresh2;
    private onTouchBegin;
    private onTouchMove;
    private onTouchEnd;
    private onRollOver;
    private onRollOut;
    private onMouseWheel;
    private updateScrollBarPos;
    updateScrollBarVisible(): void;
    private updateScrollBarVisible2;
    private __barTweenComplete;
    private getLoopPartSize;
    private loopCheckingCurrent;
    private loopCheckingTarget;
    private loopCheckingTarget2;
    private loopCheckingNewPos;
    private alignPosition;
    private alignByPage;
    private updateTargetAndDuration;
    private updateTargetAndDuration2;
    private fixDuration;
    private startTween;
    private killTween;
    private checkRefreshBar;
    protected update(dt: number): boolean;
    private runTween;
}

declare class Transition {
    name: string;
    private _owner;
    private _ownerBaseX;
    private _ownerBaseY;
    private _items;
    private _totalTimes;
    private _totalTasks;
    private _playing;
    private _paused?;
    private _onComplete?;
    private _options;
    private _reversed?;
    private _totalDuration;
    private _autoPlay?;
    private _autoPlayTimes;
    private _autoPlayDelay;
    private _timeScale;
    private _startTime;
    private _endTime;
    constructor(owner: GComponent);
    play(onComplete?: (() => void) | null, times?: number, delay?: number, startTime?: number, endTime?: number): void;
    playReverse(onComplete?: (() => void) | null, times?: number, delay?: number): void;
    changePlayTimes(value: number): void;
    setAutoPlay(value: boolean, times?: number, delay?: number): void;
    private _play;
    stop(setToComplete?: boolean, processCallback?: boolean): void;
    private stopItem;
    setPaused(paused: boolean): void;
    dispose(): void;
    get playing(): boolean;
    setValue(label: string, ...args: any[]): void;
    setHook(label: string, callback: (label?: string) => void): void;
    clearHooks(): void;
    setTarget(label: string, newTarget: GObject): void;
    setDuration(label: string, value: number): void;
    getLabelTime(label: string): number;
    get timeScale(): number;
    set timeScale(value: number);
    updateFromRelations(targetId: string, dx: number, dy: number): void;
    onEnable(): void;
    onDisable(): void;
    private onDelayedPlay;
    private internalPlay;
    private playItem;
    private skipAnimations;
    private onDelayedPlayItem;
    private onTweenStart;
    private onTweenUpdate;
    private onTweenComplete;
    private onPlayTransCompleted;
    private callHook;
    private checkAllComplete;
    private applyValue;
    setup(buffer: ByteBuffer): void;
    private decodeValue;
}

declare class GComponent extends GObject {
    hitArea?: IHitTest;
    private _sortingChildCount;
    private _opaque;
    private _applyingController?;
    private _rectMask?;
    private _maskContent?;
    protected _margin: Margin;
    protected _trackBounds: boolean;
    protected _boundsChanged: boolean;
    protected _childrenRenderOrder: ChildrenRenderOrder;
    protected _apexIndex: number;
    _buildingDisplayList: boolean;
    _children: Array<GObject>;
    _controllers: Array<Controller>;
    _transitions: Array<Transition>;
    _container: Node;
    _scrollPane?: ScrollPane;
    _alignOffset: Vec2;
    _customMask?: Mask;
    constructor();
    dispose(): void;
    get displayListContainer(): Node;
    addChild(child: GObject): GObject;
    addChildAt(child: GObject, index: number): GObject;
    private getInsertPosForSortingChild;
    removeChild(child: GObject, dispose?: boolean): GObject;
    removeChildAt(index: number, dispose?: boolean): GObject;
    removeChildren(beginIndex?: number, endIndex?: number, dispose?: boolean): void;
    getChildAt<T extends GObject>(index: number, classType?: Constructor<T>): T;
    getChild<T extends GObject>(name: string, classType?: Constructor<T>): T;
    getChildByPath<T extends GObject>(path: String, classType?: Constructor<T>): T;
    getVisibleChild(name: string): GObject;
    getChildInGroup(name: string, group: GGroup): GObject;
    getChildById(id: string): GObject;
    getChildIndex(child: GObject): number;
    setChildIndex(child: GObject, index: number): void;
    setChildIndexBefore(child: GObject, index: number): number;
    private _setChildIndex;
    swapChildren(child1: GObject, child2: GObject): void;
    swapChildrenAt(index1: number, index2: number): void;
    get numChildren(): number;
    isAncestorOf(child: GObject): boolean;
    addController(controller: Controller): void;
    getControllerAt(index: number): Controller;
    getController(name: string): Controller;
    removeController(c: Controller): void;
    get controllers(): Array<Controller>;
    private onChildAdd;
    private buildNativeDisplayList;
    applyController(c: Controller): void;
    applyAllControllers(): void;
    adjustRadioGroupDepth(obj: GObject, c: Controller): void;
    getTransitionAt(index: number): Transition;
    getTransition(transName: string): Transition;
    isChildInView(child: GObject): boolean;
    getFirstChildInView(): number;
    get scrollPane(): ScrollPane;
    get opaque(): boolean;
    set opaque(value: boolean);
    get margin(): Margin;
    set margin(value: Margin);
    get childrenRenderOrder(): ChildrenRenderOrder;
    set childrenRenderOrder(value: ChildrenRenderOrder);
    get apexIndex(): number;
    set apexIndex(value: number);
    get mask(): GObject;
    set mask(value: GObject);
    setMask(value: GObject, inverted: boolean): void;
    private onMaskReady;
    private onMaskContentChanged;
    get _pivotCorrectX(): number;
    get _pivotCorrectY(): number;
    get baseUserData(): string;
    protected setupScroll(buffer: ByteBuffer): void;
    protected setupOverflow(overflow: OverflowType): void;
    protected handleAnchorChanged(): void;
    protected handleSizeChanged(): void;
    protected handleGrayedChanged(): void;
    handleControllerChanged(c: Controller): void;
    protected _hitTest(pt: Vec2, globalPt: Vec2): GObject;
    setBoundsChangedFlag(): void;
    private refresh;
    ensureBoundsCorrect(): void;
    protected updateBounds(): void;
    setBounds(ax: number, ay: number, aw: number, ah?: number): void;
    get viewWidth(): number;
    set viewWidth(value: number);
    get viewHeight(): number;
    set viewHeight(value: number);
    getSnappingPosition(xValue: number, yValue: number, resultPoint?: Vec2): Vec2;
    childSortingOrderChanged(child: GObject, oldValue: number, newValue?: number): void;
    constructFromResource(): void;
    constructFromResource2(objectPool: Array<GObject>, poolIndex: number): void;
    protected constructExtension(buffer: ByteBuffer): void;
    protected onConstruct(): void;
    setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
    protected onEnable(): void;
    protected onDisable(): void;
}

declare class Controller extends EventTarget {
    private _selectedIndex;
    private _previousIndex;
    private _pageIds;
    private _pageNames;
    private _actions?;
    name: string;
    parent: GComponent;
    autoRadioGroupDepth?: boolean;
    changing?: boolean;
    constructor();
    dispose(): void;
    get selectedIndex(): number;
    set selectedIndex(value: number);
    onChanged<TFunction extends (...any: any[]) => void>(callback: TFunction, thisArg?: any): void;
    offChanged<TFunction extends (...any: any[]) => void>(callback: TFunction, thisArg?: any): void;
    setSelectedIndex(value: number): void;
    get previsousIndex(): number;
    get selectedPage(): string;
    set selectedPage(val: string);
    setSelectedPage(value: string): void;
    get previousPage(): string;
    get pageCount(): number;
    getPageName(index: number): string;
    addPage(name?: string): void;
    addPageAt(name?: string, index?: number): void;
    removePage(name: string): void;
    removePageAt(index: number): void;
    clearPages(): void;
    hasPage(aName: string): boolean;
    getPageIndexById(aId: string): number;
    getPageIdByName(aName: string): string | null;
    getPageNameById(aId: string): string | null;
    getPageId(index: number): string | null;
    get selectedPageId(): string | null;
    set selectedPageId(val: string | null);
    set oppositePageId(val: string | null);
    get previousPageId(): string | null;
    runActions(): void;
    setup(buffer: ByteBuffer): void;
}

declare enum BlendMode {
    Normal = 0,
    None = 1,
    Add = 2,
    Multiply = 3,
    Screen = 4,
    Erase = 5,
    Mask = 6,
    Below = 7,
    Off = 8,
    Custom1 = 9,
    Custom2 = 10,
    Custom3 = 11
}

declare class GPathPoint {
    x: number;
    y: number;
    control1_x: number;
    control1_y: number;
    control2_x: number;
    control2_y: number;
    curveType: number;
    constructor();
    static newPoint(x: number, y: number, curveType: number): GPathPoint;
    static newBezierPoint(x: number, y: number, control1_x: number, control1_y: number): GPathPoint;
    static newCubicBezierPoint(x: number, y: number, control1_x: number, control1_y: number, control2_x: number, control2_y: number): GPathPoint;
    clone(): GPathPoint;
}

declare class GPath {
    private _segments;
    private _points;
    private _fullLength;
    constructor();
    get length(): number;
    create2(pt1: GPathPoint, pt2: GPathPoint, pt3?: GPathPoint, pt4?: GPathPoint): void;
    create(points: Array<GPathPoint>): void;
    private createSplineSegment;
    clear(): void;
    getPointAt(t: number, result?: Vec2): Vec2;
    get segmentCount(): number;
    getAnchorsInSegment(segmentIndex: number, points?: Array<Vec2>): Array<Vec2>;
    getPointsInSegment(segmentIndex: number, t0: number, t1: number, points?: Array<Vec2>, ts?: Array<number>, pointDensity?: number): Array<Vec2>;
    getAllPoints(points?: Array<Vec2>, ts?: Array<number>, pointDensity?: number): Array<Vec2>;
    private onCRSplineCurve;
    private onBezierCurve;
}

declare class TweenValue {
    x: number;
    y: number;
    z: number;
    w: number;
    constructor();
    get color(): number;
    set color(value: number);
    getField(index: number): number;
    setField(index: number, value: number): void;
    setZero(): void;
}

declare class GTweener {
    _target: any;
    _propType: any;
    _killed: boolean;
    _paused: boolean;
    private _delay;
    private _duration;
    private _breakpoint;
    private _easeType;
    private _easeOvershootOrAmplitude;
    private _easePeriod;
    private _repeat;
    private _yoyo;
    private _timeScale;
    private _snapping;
    private _userData;
    private _path;
    private _onUpdate;
    private _onStart;
    private _onComplete;
    private _onUpdateCaller;
    private _onStartCaller;
    private _onCompleteCaller;
    private _startValue;
    private _endValue;
    private _value;
    private _deltaValue;
    private _valueSize;
    private _started;
    private _ended;
    private _elapsedTime;
    private _normalizedTime;
    constructor();
    setDelay(value: number): GTweener;
    get delay(): number;
    setDuration(value: number): GTweener;
    get duration(): number;
    setBreakpoint(value: number): GTweener;
    setEase(value: number): GTweener;
    setEasePeriod(value: number): GTweener;
    setEaseOvershootOrAmplitude(value: number): GTweener;
    setRepeat(repeat: number, yoyo?: boolean): GTweener;
    get repeat(): number;
    setTimeScale(value: number): GTweener;
    setSnapping(value: boolean): GTweener;
    setTarget(value: any, propType?: any): GTweener;
    get target(): any;
    setPath(value: GPath): GTweener;
    setUserData(value: any): GTweener;
    get userData(): any;
    onUpdate(callback: Function, target?: any): GTweener;
    onStart(callback: Function, target?: any): GTweener;
    onComplete(callback: Function, target?: any): GTweener;
    get startValue(): TweenValue;
    get endValue(): TweenValue;
    get value(): TweenValue;
    get deltaValue(): TweenValue;
    get normalizedTime(): number;
    get completed(): boolean;
    get allCompleted(): boolean;
    setPaused(paused: boolean): GTweener;
    /**
     * seek position of the tween, in seconds.
     */
    seek(time: number): void;
    kill(complete?: boolean): void;
    _to(start: number, end: number, duration: number): GTweener;
    _to2(start: number, start2: number, end: number, end2: number, duration: number): GTweener;
    _to3(start: number, start2: number, start3: number, end: number, end2: number, end3: number, duration: number): GTweener;
    _to4(start: number, start2: number, start3: number, start4: number, end: number, end2: number, end3: number, end4: number, duration: number): GTweener;
    _toColor(start: number, end: number, duration: number): GTweener;
    _shake(startX: number, startY: number, amplitude: number, duration: number): GTweener;
    _init(): void;
    _reset(): void;
    _update(dt: number): void;
    private update;
    private callStartCallback;
    private callUpdateCallback;
    private callCompleteCallback;
}

declare class GearBase {
    static disableAllTweenEffect?: boolean;
    _owner: GObject;
    protected _controller: Controller;
    protected _tweenConfig: GearTweenConfig;
    dispose(): void;
    get controller(): Controller;
    set controller(val: Controller);
    get tweenConfig(): GearTweenConfig;
    protected get allowTween(): boolean;
    setup(buffer: ByteBuffer): void;
    updateFromRelations(dx: number, dy: number): void;
    protected addStatus(pageId: string, buffer: ByteBuffer): void;
    protected init(): void;
    apply(): void;
    updateState(): void;
}
declare class GearTweenConfig {
    tween: boolean;
    easeType: number;
    duration: number;
    delay: number;
    _displayLockToken: number;
    _tweener: GTweener;
    constructor();
}

declare class GearLook extends GearBase {
    private _storage;
    private _default;
    protected init(): void;
    protected addStatus(pageId: string, buffer: ByteBuffer): void;
    apply(): void;
    private __tweenUpdate;
    private __tweenComplete;
    updateState(): void;
}

declare class GearSize extends GearBase {
    private _storage;
    private _default;
    protected init(): void;
    protected addStatus(pageId: string, buffer: ByteBuffer): void;
    apply(): void;
    private __tweenUpdate;
    private __tweenComplete;
    updateState(): void;
    updateFromRelations(dx: number, dy: number): void;
}

declare class GearXY extends GearBase {
    positionsInPercent: boolean;
    private _storage;
    private _default;
    protected init(): void;
    protected addStatus(pageId: string, buffer: ByteBuffer): void;
    addExtStatus(pageId: string, buffer: ByteBuffer): void;
    apply(): void;
    private __tweenUpdate;
    private __tweenComplete;
    updateState(): void;
    updateFromRelations(dx: number, dy: number): void;
}

declare class InputProcessor extends Component {
    private _owner;
    private _touchListener;
    private _touchPos;
    private _touches;
    private _rollOutChain;
    private _rollOverChain;
    _captureCallback: (evt: FGUIEvent) => void;
    constructor();
    onLoad(): void;
    onEnable(): void;
    onDisable(): void;
    getAllTouches(touchIds?: Array<number>): Array<number>;
    getTouchPosition(touchId?: number): Vec2;
    getTouchTarget(): GObject;
    addTouchMonitor(touchId: number, target: GObject): void;
    removeTouchMonitor(target: GObject): void;
    cancelClick(touchId: number): void;
    simulateClick(target: GObject): void;
    private touchBeginHandler;
    private touchMoveHandler;
    private touchEndHandler;
    private touchCancelHandler;
    private mouseDownHandler;
    private mouseUpHandler;
    private mouseMoveHandler;
    private mouseWheelHandler;
    private updateInfo;
    private getInfo;
    private setBegin;
    private setEnd;
    private clickTest;
    private handleRollOver;
    private getEvent;
}

declare class FGUIEvent extends Event$2 {
    static TOUCH_BEGIN: string;
    static TOUCH_MOVE: string;
    static TOUCH_END: string;
    static CLICK: string;
    static ROLL_OVER: string;
    static ROLL_OUT: string;
    static MOUSE_WHEEL: string;
    static DISPLAY: string;
    static UNDISPLAY: string;
    static GEAR_STOP: string;
    static LINK: string;
    static Submit: string;
    static TEXT_CHANGE: string;
    static STATUS_CHANGED: string;
    static XY_CHANGED: string;
    static SIZE_CHANGED: string;
    static SIZE_DELAY_CHANGE: string;
    static DRAG_START: string;
    static DRAG_MOVE: string;
    static DRAG_END: string;
    static DROP: string;
    static SCROLL: string;
    static SCROLL_END: string;
    static PULL_DOWN_RELEASE: string;
    static PULL_UP_RELEASE: string;
    static CLICK_ITEM: string;
    initiator: GObject;
    pos: Vec2;
    touchId: number;
    clickCount: number;
    button: number;
    keyModifiers: number;
    mouseWheelDelta: number;
    _processor: InputProcessor;
    constructor(type: string, bubbles: boolean);
    get sender(): GObject | null;
    get isShiftDown(): boolean;
    get isCtrlDown(): boolean;
    captureTouch(): void;
}

declare class GObjectPool {
    private _pool;
    private _count;
    constructor();
    clear(): void;
    get count(): number;
    getObject(url: string): GObject;
    returnObject(obj: GObject): void;
}

type ListItemRenderer = (index: number, item: GObject) => void;
declare class GList extends GComponent {
    itemRenderer: ListItemRenderer;
    itemProvider: (index: number) => string;
    scrollItemToViewOnClick: boolean;
    foldInvisibleItems: boolean;
    private _layout;
    private _lineCount;
    private _columnCount;
    private _lineGap;
    private _columnGap;
    private _defaultItem;
    private _autoResizeItem;
    private _selectionMode;
    private _align;
    private _verticalAlign;
    private _selectionController?;
    private _lastSelectedIndex;
    private _pool;
    private _virtual?;
    private _loop?;
    private _numItems;
    private _realNumItems;
    private _firstIndex;
    private _curLineItemCount;
    private _curLineItemCount2;
    private _itemSize?;
    private _virtualListChanged;
    private _virtualItems?;
    private _eventLocked?;
    private itemInfoVer;
    constructor();
    dispose(): void;
    get layout(): ListLayoutType;
    set layout(value: ListLayoutType);
    get lineCount(): number;
    set lineCount(value: number);
    get columnCount(): number;
    set columnCount(value: number);
    get lineGap(): number;
    set lineGap(value: number);
    get columnGap(): number;
    set columnGap(value: number);
    get align(): AlignType;
    set align(value: AlignType);
    get verticalAlign(): VertAlignType;
    set verticalAlign(value: VertAlignType);
    get virtualItemSize(): Size;
    set virtualItemSize(value: Size);
    get defaultItem(): string | null;
    set defaultItem(val: string | null);
    get autoResizeItem(): boolean;
    set autoResizeItem(value: boolean);
    get selectionMode(): ListSelectionMode;
    set selectionMode(value: ListSelectionMode);
    get selectionController(): Controller;
    set selectionController(value: Controller);
    get itemPool(): GObjectPool;
    getFromPool(url?: string): GObject;
    returnToPool(obj: GObject): void;
    addChildAt(child: GObject, index: number): GObject;
    addItem(url?: string): GObject;
    addItemFromPool(url?: string): GObject;
    removeChildAt(index: number, dispose?: boolean): GObject;
    removeChildToPoolAt(index: number): void;
    removeChildToPool(child: GObject): void;
    removeChildrenToPool(beginIndex?: number, endIndex?: number): void;
    get selectedIndex(): number;
    set selectedIndex(value: number);
    getSelection(result?: number[]): number[];
    addSelection(index: number, scrollItToView?: boolean): void;
    removeSelection(index: number): void;
    clearSelection(): void;
    private clearSelectionExcept;
    selectAll(): void;
    selectNone(): void;
    selectReverse(): void;
    handleArrowKey(dir: number): void;
    private onClickItem;
    protected dispatchItemEvent(item: GObject, evt: FGUIEvent): void;
    private setSelectionOnEvent;
    resizeToFit(itemCount?: number, minSize?: number): void;
    getMaxItemWidth(): number;
    protected handleSizeChanged(): void;
    handleControllerChanged(c: Controller): void;
    private updateSelectionController;
    getSnappingPosition(xValue: number, yValue: number, resultPoint?: Vec2): Vec2;
    scrollToView(index: number, ani?: boolean, setFirst?: boolean): void;
    getFirstChildInView(): number;
    childIndexToItemIndex(index: number): number;
    itemIndexToChildIndex(index: number): number;
    setVirtual(): void;
    setVirtualAndLoop(): void;
    private _setVirtual;
    get numItems(): number;
    set numItems(value: number);
    refreshVirtualList(): void;
    private checkVirtualList;
    private setVirtualListChangedFlag;
    private _refreshVirtualList;
    private __scrolled;
    private getIndexOnPos1;
    private getIndexOnPos2;
    private getIndexOnPos3;
    private handleScroll;
    private static pos_param;
    private handleScroll1;
    private handleScroll2;
    private handleScroll3;
    private handleArchOrder1;
    private handleArchOrder2;
    private handleAlign;
    protected updateBounds(): void;
    setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
    protected readItems(buffer: ByteBuffer): void;
    protected setupItem(buffer: ByteBuffer, obj: GObject): void;
    setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
}

declare class GTree extends GList {
    treeNodeRender: (node: GTreeNode, obj: GComponent) => void;
    treeNodeWillExpand: (node: GTreeNode, expanded: boolean) => void;
    private _indent;
    private _clickToExpand;
    private _rootNode;
    private _expandedStatusInEvt;
    constructor();
    get rootNode(): GTreeNode;
    get indent(): number;
    set indent(value: number);
    get clickToExpand(): number;
    set clickToExpand(value: number);
    getSelectedNode(): GTreeNode;
    getSelectedNodes(result?: Array<GTreeNode>): Array<GTreeNode>;
    selectNode(node: GTreeNode, scrollItToView?: boolean): void;
    unselectNode(node: GTreeNode): void;
    expandAll(folderNode?: GTreeNode): void;
    collapseAll(folderNode?: GTreeNode): void;
    private createCell;
    _afterInserted(node: GTreeNode): void;
    private getInsertIndexForNode;
    _afterRemoved(node: GTreeNode): void;
    _afterExpanded(node: GTreeNode): void;
    _afterCollapsed(node: GTreeNode): void;
    _afterMoved(node: GTreeNode): void;
    private getFolderEndIndex;
    private checkChildren;
    private hideFolderNode;
    private removeNode;
    private __cellMouseDown;
    private __expandedStateChanged;
    protected dispatchItemEvent(item: GObject, evt: FGUIEvent): void;
    setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
    protected readItems(buffer: ByteBuffer): void;
}

declare class GTreeNode {
    data?: any;
    private _parent;
    private _children;
    private _expanded;
    private _level;
    private _tree;
    _cell: GComponent;
    _resURL?: string;
    constructor(hasChild?: boolean, resURL?: string);
    set expanded(value: boolean);
    get expanded(): boolean;
    get isFolder(): boolean;
    get parent(): GTreeNode;
    get text(): string | null;
    set text(value: string | null);
    get icon(): ResURL | null;
    set icon(value: ResURL | null);
    get cell(): GComponent;
    get level(): number;
    _setLevel(value: number): void;
    addChild(child: GTreeNode): GTreeNode;
    addChildAt(child: GTreeNode, index: number): GTreeNode;
    removeChild(child: GTreeNode): GTreeNode;
    removeChildAt(index: number): GTreeNode;
    removeChildren(beginIndex?: number, endIndex?: number): void;
    getChildAt(index: number): GTreeNode;
    getChildIndex(child: GTreeNode): number;
    getPrevSibling(): GTreeNode;
    getNextSibling(): GTreeNode;
    setChildIndex(child: GTreeNode, index: number): void;
    swapChildren(child1: GTreeNode, child2: GTreeNode): void;
    swapChildrenAt(index1: number, index2: number): void;
    get numChildren(): number;
    expandToRoot(): void;
    get tree(): GTree;
    _setTree(value: GTree): void;
}

declare class Image extends Sprite {
    private _flip;
    private _fillMethod;
    private _fillOrigin;
    private _fillAmount;
    private _fillClockwise;
    constructor();
    get flip(): FlipType;
    set flip(value: FlipType);
    get fillMethod(): FillMethod;
    set fillMethod(value: FillMethod);
    get fillOrigin(): FillOrigin;
    set fillOrigin(value: FillOrigin);
    get fillClockwise(): boolean;
    set fillClockwise(value: boolean);
    get fillAmount(): number;
    set fillAmount(value: number);
    private setupFill;
}

interface Frame {
    rect: Rect;
    addDelay: number;
    texture: SpriteFrame | null;
}
declare class MovieClip extends Image {
    interval: number;
    swing: boolean;
    repeatDelay: number;
    timeScale: number;
    private _playing;
    private _frameCount;
    private _frames;
    private _frame;
    private _start;
    private _end;
    private _times;
    private _endAt;
    private _status;
    private _callback;
    private _smoothing;
    private _frameElapsed;
    private _reversed;
    private _repeatedCount;
    constructor();
    get frames(): Array<Frame>;
    set frames(value: Array<Frame>);
    get frameCount(): number;
    get frame(): number;
    set frame(value: number);
    get playing(): boolean;
    set playing(value: boolean);
    get smoothing(): boolean;
    set smoothing(value: boolean);
    rewind(): void;
    syncStatus(anotherMc: MovieClip): void;
    advance(timeInSeconds: number): void;
    setPlaySettings(start?: number, end?: number, times?: number, endAt?: number, endCallback?: (() => void) | null): void;
    protected update(dt: number): void;
    private drawFrame;
}

type PackageDependency = {
    id: string;
    name: string;
};
declare class UIPackage {
    private _id;
    private _name;
    private _path;
    private _items;
    private _itemsById;
    private _itemsByName;
    private _sprites;
    private _dependencies;
    private _branches;
    _branchIndex: number;
    private _bundle;
    constructor();
    static get branch(): string | null;
    static set branch(value: string | null);
    static getVar(key: string): string | null;
    static setVar(key: string, value: string | null): void;
    static getById(id: string): UIPackage;
    static getByName(name: string): UIPackage;
    /**
     * 注册一个包。包的所有资源必须放在resources下，且已经预加载。
     * @param path 相对 resources 的路径。
     */
    static addPackage(path: string): UIPackage;
    /**
     * 载入一个包。包的资源从Asset Bundle加载.
     * @param bundle Asset Bundle 对象.
     * @param path 资源相对 Asset Bundle 目录的路径.
     * @param onComplete 载入成功后的回调.
     */
    static loadPackage(bundle: AssetManager.Bundle, path: string, onComplete?: (error: any, pkg: UIPackage) => void): void;
    /**
     * 载入一个包。包的资源从Asset Bundle加载.
     * @param bundle Asset Bundle 对象.
     * @param path 资源相对 Asset Bundle 目录的路径.
     * @param onProgress 加载进度回调.
     * @param onComplete 载入成功后的回调.
     */
    static loadPackage(bundle: AssetManager.Bundle, path: string, onProgress?: (finish: number, total: number, item: AssetManager.RequestItem) => void, onComplete?: (error: any, pkg: UIPackage) => void): void;
    /**
     * 载入一个包。包的资源从resources加载.
     * @param path 资源相对 resources 的路径.
     * @param onComplete 载入成功后的回调.
     */
    static loadPackage(path: string, onComplete?: (error: any, pkg: UIPackage) => void): void;
    /**
     * 载入一个包。包的资源从resources加载.
     * @param path 资源相对 resources 的路径.
     * @param onProgress 加载进度回调.
     * @param onComplete 载入成功后的回调.
     */
    static loadPackage(path: string, onProgress?: (finish: number, total: number, item: AssetManager.RequestItem) => void, onComplete?: (error: Error, pkg: UIPackage) => void): void;
    static removePackage(packageIdOrName: string): void;
    static createObject(pkgName: string, resName: string, userClass?: new () => GObject): GObject;
    static createObjectFromURL(url: string, userClass?: new () => GObject): GObject;
    static getItemURL(pkgName: string, resName: string): string;
    static getItemByURL(url: string): PackageItem;
    static normalizeURL(url: string): string;
    static setStringsSource(source: string): void;
    private loadPackage;
    dispose(): void;
    get id(): string;
    get name(): string;
    get path(): string;
    get dependencies(): Array<PackageDependency>;
    createObject(resName: string, userClass?: new () => GObject): GObject;
    internalCreateObject(item: PackageItem, userClass?: new () => GObject): GObject;
    getItemById(itemId: string): PackageItem;
    getItemByName(resName: string): PackageItem;
    getItemAssetByName(resName: string): Asset;
    getItemAsset(item: PackageItem): Asset;
    getItemAssetAsync(item: PackageItem, onComplete?: (err: Error, item: PackageItem) => void): void;
    loadAllAssets(): void;
    private loadMovieClip;
    private loadFont;
    private loadSpine;
    private loadDragonBones;
}

declare class PackageItem {
    owner: UIPackage;
    type: PackageItemType;
    objectType?: ObjectType;
    id: string;
    name: string;
    width: number;
    height: number;
    file: string;
    decoded?: boolean;
    loading?: Array<Function>;
    rawData?: ByteBuffer;
    asset?: Asset;
    highResolution?: Array<string>;
    branches?: Array<string>;
    scale9Grid?: Rect;
    scaleByTile?: boolean;
    tileGridIndice?: number;
    smoothing?: boolean;
    hitTestData?: PixelHitTestData;
    interval?: number;
    repeatDelay?: number;
    swing?: boolean;
    frames?: Array<Frame>;
    extensionType?: any;
    skeletonAnchor?: Vec2;
    atlasAsset?: dragonBones.DragonBonesAtlasAsset;
    constructor();
    load(): Asset;
    getBranch(): PackageItem;
    getHighResolution(): PackageItem;
    toString(): string;
}

declare class Relations {
    private _owner;
    private _items;
    handling: GObject | null;
    sizeDirty: boolean;
    constructor(owner: GObject);
    add(target: GObject, relationType: number, usePercent?: boolean): void;
    remove(target: GObject, relationType?: number): void;
    contains(target: GObject): boolean;
    clearFor(target: GObject): void;
    clearAll(): void;
    copyFrom(source: Relations): void;
    dispose(): void;
    onOwnerSizeChanged(dWidth: number, dHeight: number, applyPivot: boolean): void;
    ensureRelationsSizeCorrect(): void;
    get empty(): boolean;
    setup(buffer: ByteBuffer, parentToChild: boolean): void;
}

/**
 * tooltips数据
 */
type TooltipsData = string | {
    type: string;
    data: any;
};

declare class GObject {
    data?: any;
    packageItem?: PackageItem;
    static draggingObject: GObject | null;
    protected _x: number;
    protected _y: number;
    protected _alpha: number;
    protected _visible: boolean;
    protected _touchable: boolean;
    protected _grayed?: boolean;
    protected _draggable?: boolean;
    protected _skewX: number;
    protected _skewY: number;
    protected _pivotAsAnchor?: boolean;
    protected _sortingOrder: number;
    protected _internalVisible: boolean;
    protected _handlingController?: boolean;
    protected _tooltips?: TooltipsData;
    protected _blendMode: BlendMode;
    protected _pixelSnapping?: boolean;
    protected _dragTesting?: boolean;
    protected _dragStartPos?: Vec2;
    protected _relations: Relations;
    protected _group: GGroup | null;
    protected _gears: GearBase[];
    protected _node: Node;
    protected _dragBounds?: Rect;
    sourceWidth: number;
    sourceHeight: number;
    initWidth: number;
    initHeight: number;
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
    _parent: GComponent | null;
    _width: number;
    _height: number;
    _rawWidth: number;
    _rawHeight: number;
    _id: string;
    _name: string;
    _underConstruct: boolean;
    _gearLocked?: boolean;
    _sizePercentInGroup: number;
    _touchDisabled?: boolean;
    _partner: GObjectPartner;
    _treeNode?: GTreeNode;
    _uiTrans: UITransform;
    _uiOpacity: UIOpacity;
    private _hitTestPt?;
    constructor();
    get id(): string;
    get name(): string;
    set name(value: string);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    setPosition(xv: number, yv: number): void;
    get xMin(): number;
    set xMin(value: number);
    get yMin(): number;
    set yMin(value: number);
    get pixelSnapping(): boolean;
    set pixelSnapping(value: boolean);
    center(restraint?: boolean): void;
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
    setSize(wv: number, hv: number, ignorePivot?: boolean): void;
    makeFullScreen(): void;
    ensureSizeCorrect(): void;
    get actualWidth(): number;
    get actualHeight(): number;
    get scaleX(): number;
    set scaleX(value: number);
    get scaleY(): number;
    set scaleY(value: number);
    setScale(sx: number, sy: number): void;
    get skewX(): number;
    get pivotX(): number;
    set pivotX(value: number);
    get pivotY(): number;
    set pivotY(value: number);
    setPivot(xv: number, yv: number, asAnchor?: boolean): void;
    get pivotAsAnchor(): boolean;
    get touchable(): boolean;
    set touchable(value: boolean);
    get grayed(): boolean;
    set grayed(value: boolean);
    get enabled(): boolean;
    set enabled(value: boolean);
    get rotation(): number;
    set rotation(value: number);
    get alpha(): number;
    set alpha(value: number);
    get visible(): boolean;
    set visible(value: boolean);
    get _finalVisible(): boolean;
    get internalVisible3(): boolean;
    get sortingOrder(): number;
    set sortingOrder(value: number);
    requestFocus(): void;
    get tooltips(): TooltipsData | null;
    set tooltips(value: TooltipsData | null);
    get blendMode(): BlendMode;
    set blendMode(value: BlendMode);
    get onStage(): boolean;
    get resourceURL(): string | null;
    set group(value: GGroup);
    get group(): GGroup;
    getGear(index: number): GearBase;
    protected updateGear(index: number): void;
    checkGearController(index: number, c: Controller): boolean;
    updateGearFromRelations(index: number, dx: number, dy: number): void;
    addDisplayLock(): number;
    releaseDisplayLock(token: number): void;
    private checkGearDisplay;
    get gearXY(): GearXY;
    get gearSize(): GearSize;
    get gearLook(): GearLook;
    get relations(): Relations;
    addRelation(target: GObject, relationType: number, usePercent?: boolean): void;
    removeRelation(target: GObject, relationType: number): void;
    get node(): Node;
    get parent(): GComponent;
    removeFromParent(): void;
    findParent(): GObject;
    get asCom(): GComponent;
    static cast(obj: Node): GObject;
    get text(): string | null;
    set text(value: string | null);
    get icon(): ResURL | null;
    set icon(value: ResURL | null);
    get treeNode(): GTreeNode;
    get isDisposed(): boolean;
    dispose(): void;
    protected onEnable(): void;
    protected onDisable(): void;
    protected onUpdate(): void;
    protected onDestroy(): void;
    onClick(listener: Function, target?: any): void;
    onceClick(listener: Function, target?: any): void;
    offClick(listener: Function, target?: any): void;
    clearClick(): void;
    hasClickListener(): boolean;
    on(type: string, listener: Function, target?: any): void;
    once(type: string, listener: Function, target?: any): void;
    off(type: string, listener?: Function, target?: any): void;
    get draggable(): boolean;
    set draggable(value: boolean);
    get dragBounds(): Rect;
    set dragBounds(value: Rect);
    startDrag(touchId?: number): void;
    stopDrag(): void;
    get dragging(): boolean;
    localToGlobal(ax?: number, ay?: number, result?: Vec2): Vec2;
    globalToLocal(ax?: number, ay?: number, result?: Vec2): Vec2;
    localToGlobalRect(ax?: number, ay?: number, aw?: number, ah?: number, result?: Rect): Rect;
    globalToLocalRect(ax?: number, ay?: number, aw?: number, ah?: number, result?: Rect): Rect;
    handleControllerChanged(c: Controller): void;
    protected handleAnchorChanged(): void;
    handlePositionChanged(): void;
    protected handleSizeChanged(): void;
    protected handleGrayedChanged(): void;
    handleVisibleChanged(): void;
    hitTest(globalPt: Vec2, forTouch?: boolean): GObject;
    protected _hitTest(pt: Vec2, globalPt: Vec2): GObject;
    getProp(index: number): any;
    setProp(index: number, value: any): void;
    constructFromResource(): void;
    setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
    setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
    private onRollOver;
    private onRollOut;
    private initDrag;
    private dragBegin;
    private dragEnd;
    private onTouchBegin_0;
    private onTouchMove_0;
    private onTouchEnd_0;
}
declare class GObjectPartner extends Component {
    _emitDisplayEvents?: boolean;
    callLater(callback: any, delay?: number): void;
    onClickLink(evt: Event, text: string): void;
    protected onEnable(): void;
    protected onDisable(): void;
    protected update(dt: number): void;
    protected onDestroy(): void;
}

declare class GGroup extends GObject {
    private _layout;
    private _lineGap;
    private _columnGap;
    private _excludeInvisibles;
    private _autoSizeDisabled;
    private _mainGridIndex;
    private _mainGridMinSize;
    private _boundsChanged;
    private _percentReady;
    private _mainChildIndex;
    private _totalSize;
    private _numChildren;
    _updating: number;
    constructor();
    dispose(): void;
    get layout(): number;
    set layout(value: number);
    get lineGap(): number;
    set lineGap(value: number);
    get columnGap(): number;
    set columnGap(value: number);
    get excludeInvisibles(): boolean;
    set excludeInvisibles(value: boolean);
    get autoSizeDisabled(): boolean;
    set autoSizeDisabled(value: boolean);
    get mainGridMinSize(): number;
    set mainGridMinSize(value: number);
    get mainGridIndex(): number;
    set mainGridIndex(value: number);
    setBoundsChangedFlag(positionChangedOnly?: boolean): void;
    private _ensureBoundsCorrect;
    ensureSizeCorrect(): void;
    ensureBoundsCorrect(): void;
    private updateBounds;
    private handleLayout;
    moveChildren(dx: number, dy: number): void;
    resizeChildren(dw: number, dh: number): void;
    handleAlphaChanged(): void;
    handleVisibleChanged(): void;
    setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
    setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
}

declare class GGraph extends GObject {
    _content: Graphics;
    private _type;
    private _lineSize;
    private _lineColor;
    private _fillColor;
    private _cornerRadius?;
    private _sides?;
    private _startAngle?;
    private _polygonPoints?;
    private _distances?;
    private _hasContent;
    constructor();
    drawRect(lineSize: number, lineColor: Color, fillColor: Color, corner?: Array<number>): void;
    drawEllipse(lineSize: number, lineColor: Color, fillColor: Color): void;
    drawRegularPolygon(lineSize: number, lineColor: Color, fillColor: Color, sides: number, startAngle?: number, distances?: number[]): void;
    drawPolygon(lineSize: number, lineColor: Color, fillColor: Color, points: Array<number>): void;
    get distances(): number[];
    set distances(value: number[]);
    clearGraphics(): void;
    get type(): number;
    get color(): Color;
    set color(value: Color);
    private updateGraph;
    private drawPath;
    protected handleSizeChanged(): void;
    protected handleAnchorChanged(): void;
    getProp(index: number): any;
    setProp(index: number, value: any): void;
    protected _hitTest(pt: Vec2): GObject;
    setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
}

declare class GImage extends GObject {
    _content: Image;
    constructor();
    get color(): Color;
    set color(value: Color);
    get flip(): FlipType;
    set flip(value: FlipType);
    get fillMethod(): FillMethod;
    set fillMethod(value: FillMethod);
    get fillOrigin(): FillOrigin;
    set fillOrigin(value: FillOrigin);
    get fillClockwise(): boolean;
    set fillClockwise(value: boolean);
    get fillAmount(): number;
    set fillAmount(value: number);
    constructFromResource(): void;
    protected handleGrayedChanged(): void;
    getProp(index: number): any;
    setProp(index: number, value: any): void;
    setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
}

declare class GMovieClip extends GObject {
    _content: MovieClip;
    constructor();
    get color(): Color;
    set color(value: Color);
    get playing(): boolean;
    set playing(value: boolean);
    get frame(): number;
    set frame(value: number);
    get timeScale(): number;
    set timeScale(value: number);
    rewind(): void;
    syncStatus(anotherMc: GMovieClip): void;
    advance(timeInSeconds: number): void;
    setPlaySettings(start?: number, end?: number, times?: number, endAt?: number, endCallback?: (() => void) | null): void;
    protected handleGrayedChanged(): void;
    protected handleSizeChanged(): void;
    getProp(index: number): any;
    setProp(index: number, value: any): void;
    constructFromResource(): void;
    setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
}

interface IUISource {
    fileName: string;
    loaded: boolean;
    load(callback: () => void, target: any): void;
}
declare class Window extends GComponent {
    private _contentPane;
    private _modalWaitPane;
    private _closeButton;
    private _dragArea;
    private _contentArea;
    private _frame;
    private _modal;
    private _uiSources?;
    private _inited?;
    private _loading?;
    protected _requestingCmd: number;
    bringToFontOnClick: boolean;
    constructor();
    addUISource(source: IUISource): void;
    set contentPane(val: GComponent);
    get contentPane(): GComponent;
    get frame(): GComponent;
    get closeButton(): GObject;
    set closeButton(value: GObject);
    get dragArea(): GObject;
    set dragArea(value: GObject);
    get contentArea(): GObject;
    set contentArea(value: GObject);
    show(): void;
    showOn(root: GRoot): void;
    hide(): void;
    hideImmediately(): void;
    centerOn(r: GRoot, restraint?: boolean): void;
    toggleStatus(): void;
    get isShowing(): boolean;
    get isTop(): boolean;
    get modal(): boolean;
    set modal(val: boolean);
    bringToFront(): void;
    showModalWait(requestingCmd?: number): void;
    protected layoutModalWaitPane(): void;
    closeModalWait(requestingCmd?: number): boolean;
    get modalWaiting(): boolean;
    init(): void;
    protected onInit(): void;
    protected onShown(): void;
    protected onHide(): void;
    protected doShowAnimation(): void;
    protected doHideAnimation(): void;
    private __uiLoadComplete;
    private _init;
    dispose(): void;
    protected closeEventHandler(evt: Event): void;
    protected onEnable(): void;
    protected onDisable(): void;
    private onTouchBegin_1;
    private onDragStart_1;
}

declare class GRoot extends GComponent {
    private _modalLayer;
    private _popupStack;
    private _justClosedPopups;
    private _modalWaitPane;
    private _tooltipWin;
    private _defaultTooltipWin;
    private _volumeScale;
    private _inputProcessor;
    private _thisOnResized;
    private audioEngine;
    private static _inst;
    static get inst(): GRoot;
    static create(root?: Node): GRoot;
    constructor();
    protected onDestroy(): void;
    getTouchPosition(touchId?: number): Vec2;
    get touchTarget(): GObject;
    get inputProcessor(): InputProcessor;
    showWindow(win: Window): void;
    hideWindow(win: Window): void;
    hideWindowImmediately(win: Window): void;
    bringToFront(win: Window): void;
    showModalWait(msg?: string): void;
    closeModalWait(): void;
    closeAllExceptModals(): void;
    closeAllWindows(): void;
    getTopWindow(): Window;
    get modalLayer(): GGraph;
    get hasModalWindow(): boolean;
    get modalWaiting(): boolean;
    getPopupPosition(popup: GObject, target?: GObject, dir?: PopupDirection | boolean, result?: Vec2): Vec2;
    showPopup(popup: GObject, target?: GObject | null, dir?: PopupDirection | boolean): void;
    togglePopup(popup: GObject, target?: GObject, dir?: PopupDirection | boolean): void;
    hidePopup(popup?: GObject): void;
    get hasAnyPopup(): boolean;
    private closePopup;
    showTooltips(msg: string): void;
    showTooltipsWin(tooltipWin: GObject): void;
    hideTooltips(): void;
    get volumeScale(): number;
    set volumeScale(value: number);
    playOneShotSound(clip: AudioClip, volumeScale?: number): void;
    private adjustModalLayer;
    private onTouchBegin_1;
    onWinResize(): void;
    handlePositionChanged(): void;
}

declare class GTextField extends GObject {
    _label: Label;
    protected _font: string;
    protected _realFont: string | Font;
    protected _fontSize: number;
    protected _color: Color;
    protected _strokeColor?: Color;
    protected _shadowOffset?: Vec2;
    protected _shadowColor?: Color;
    protected _leading: number;
    protected _text: string;
    protected _ubbEnabled: boolean;
    protected _templateVars?: {
        [index: string]: string;
    };
    protected _autoSize: AutoSizeType;
    protected _updatingSize: boolean;
    protected _sizeDirty: boolean;
    protected _outline?: LabelOutline;
    protected _shadow?: LabelShadow;
    constructor();
    protected createRenderer(): void;
    set text(value: string | null);
    get text(): string | null;
    get font(): string | null;
    set font(value: string | null);
    get fontSize(): number;
    set fontSize(value: number);
    get color(): Color;
    set color(value: Color);
    get align(): HorizontalTextAlignment;
    set align(value: HorizontalTextAlignment);
    get verticalAlign(): VerticalTextAlignment;
    set verticalAlign(value: VerticalTextAlignment);
    get leading(): number;
    set leading(value: number);
    get letterSpacing(): number;
    set letterSpacing(value: number);
    get underline(): boolean;
    set underline(value: boolean);
    get bold(): boolean;
    set bold(value: boolean);
    get italic(): boolean;
    set italic(value: boolean);
    get singleLine(): boolean;
    set singleLine(value: boolean);
    get stroke(): number;
    set stroke(value: number);
    get strokeColor(): Color;
    set strokeColor(value: Color);
    get shadowOffset(): Vec2;
    set shadowOffset(value: Vec2);
    get shadowColor(): Color;
    set shadowColor(value: Color);
    set ubbEnabled(value: boolean);
    get ubbEnabled(): boolean;
    set autoSize(value: AutoSizeType);
    get autoSize(): AutoSizeType;
    protected parseTemplate(template: string): string;
    get templateVars(): {
        [index: string]: string;
    };
    set templateVars(value: {
        [index: string]: string;
    });
    setVar(name: string, value: string): GTextField;
    flushVars(): void;
    get textWidth(): number;
    ensureSizeCorrect(): void;
    protected updateText(): void;
    protected assignFont(label: any, value: string | Font): void;
    protected assignFontColor(label: any, value: Color): void;
    protected updateFont(): void;
    protected updateFontColor(): void;
    protected updateStrokeColor(): void;
    protected updateShadowColor(): void;
    protected updateFontSize(): void;
    protected updateOverflow(): void;
    protected markSizeChanged(): void;
    protected onLabelSizeChanged(): void;
    protected handleSizeChanged(): void;
    protected handleGrayedChanged(): void;
    getProp(index: number): any;
    setProp(index: number, value: any): void;
    setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
    setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
}

declare class GRichTextField extends GTextField {
    _richText: RichText;
    private _bold;
    private _italics;
    private _underline;
    linkUnderline: boolean;
    linkColor: string;
    constructor();
    protected createRenderer(): void;
    get align(): HorizontalTextAlignment;
    set align(value: HorizontalTextAlignment);
    get underline(): boolean;
    set underline(value: boolean);
    get bold(): boolean;
    set bold(value: boolean);
    get italic(): boolean;
    set italic(value: boolean);
    protected markSizeChanged(): void;
    protected updateText(): void;
    protected updateFont(): void;
    protected updateFontColor(): void;
    protected updateFontSize(): void;
    protected updateOverflow(): void;
    protected handleSizeChanged(): void;
}

declare class GTextInput extends GTextField {
    _editBox: EditBox;
    private _promptText;
    constructor();
    protected createRenderer(): void;
    set editable(val: boolean);
    get editable(): boolean;
    set maxLength(val: number);
    get maxLength(): number;
    set promptText(val: string | null);
    get promptText(): string | null;
    set restrict(value: string | null);
    get restrict(): string | null;
    get password(): boolean;
    set password(val: boolean);
    get align(): HorizontalTextAlignment;
    set align(value: HorizontalTextAlignment);
    get verticalAlign(): VerticalTextAlignment;
    set verticalAlign(value: VerticalTextAlignment);
    get singleLine(): boolean;
    set singleLine(value: boolean);
    requestFocus(): void;
    protected markSizeChanged(): void;
    protected updateText(): void;
    protected updateFont(): void;
    protected updateFontColor(): void;
    protected updateFontSize(): void;
    protected updateOverflow(): void;
    private onTextChanged;
    private onTouchEnd1;
    setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
}

declare class GLoader extends GObject {
    _content: MovieClip;
    private _url;
    private _align;
    private _verticalAlign;
    private _autoSize;
    private _fill;
    private _shrinkOnly;
    private _showErrorSign;
    private _playing;
    private _frame;
    private _color;
    private _contentItem;
    private _container;
    private _errorSign?;
    private _content2?;
    private _updatingLayout;
    private static _errorSignPool;
    constructor();
    dispose(): void;
    get url(): ResURL | null;
    set url(value: ResURL | null);
    get icon(): ResURL | null;
    set icon(value: ResURL | null);
    get align(): AlignType;
    set align(value: AlignType);
    get verticalAlign(): VertAlignType;
    set verticalAlign(value: VertAlignType);
    get fill(): LoaderFillType;
    set fill(value: LoaderFillType);
    get shrinkOnly(): boolean;
    set shrinkOnly(value: boolean);
    get autoSize(): boolean;
    set autoSize(value: boolean);
    get playing(): boolean;
    set playing(value: boolean);
    get frame(): number;
    set frame(value: number);
    get color(): Color;
    set color(value: Color);
    get fillMethod(): FillMethod;
    set fillMethod(value: FillMethod);
    get fillOrigin(): FillOrigin;
    set fillOrigin(value: FillOrigin);
    get fillClockwise(): boolean;
    set fillClockwise(value: boolean);
    get fillAmount(): number;
    set fillAmount(value: number);
    get showErrorSign(): boolean;
    set showErrorSign(value: boolean);
    get component(): GComponent;
    get texture(): SpriteFrame;
    set texture(value: SpriteFrame);
    protected loadContent(): void;
    protected loadFromPackage(itemURL: string): void;
    protected loadExternal(): void;
    protected freeExternal(texture: SpriteFrame): void;
    protected onExternalLoadSuccess(texture: SpriteFrame): void;
    protected onExternalLoadFailed(): void;
    private setErrorState;
    private clearErrorState;
    private updateLayout;
    private clearContent;
    protected handleSizeChanged(): void;
    protected handleAnchorChanged(): void;
    protected handleGrayedChanged(): void;
    protected _hitTest(pt: Vec2, globalPt: Vec2): GObject;
    getProp(index: number): any;
    setProp(index: number, value: any): void;
    setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
}

declare class GLoader3D extends GObject {
    private _url;
    private _align;
    private _verticalAlign;
    private _autoSize;
    private _fill;
    private _shrinkOnly;
    private _playing;
    private _frame;
    private _loop;
    private _animationName;
    private _skinName;
    private _color;
    private _contentItem;
    private _container;
    private _content;
    private _updatingLayout;
    constructor();
    dispose(): void;
    get url(): string | null;
    set url(value: string | null);
    get icon(): string | null;
    set icon(value: string | null);
    get align(): AlignType;
    set align(value: AlignType);
    get verticalAlign(): VertAlignType;
    set verticalAlign(value: VertAlignType);
    get fill(): LoaderFillType;
    set fill(value: LoaderFillType);
    get shrinkOnly(): boolean;
    set shrinkOnly(value: boolean);
    get autoSize(): boolean;
    set autoSize(value: boolean);
    get playing(): boolean;
    set playing(value: boolean);
    get frame(): number;
    set frame(value: number);
    get animationName(): string | null;
    set animationName(value: string | null);
    get skinName(): string | null;
    set skinName(value: string | null);
    get loop(): boolean;
    set loop(value: boolean);
    get color(): Color;
    set color(value: Color);
    get content(): sp.Skeleton | dragonBones.ArmatureDisplay;
    protected loadContent(): void;
    protected loadFromPackage(itemURL: string): void;
    private onLoaded;
    setSpine(asset: sp.SkeletonData, anchor: Vec2, pma?: boolean): void;
    freeSpine(): void;
    setDragonBones(asset: dragonBones.DragonBonesAsset, atlasAsset: dragonBones.DragonBonesAtlasAsset, anchor: Vec2, pma?: boolean): void;
    freeDragonBones(): void;
    private onChange;
    private onChangeSpine;
    private onChangeDragonBones;
    protected loadExternal(): void;
    private onLoaded2;
    private updateLayout;
    private clearContent;
    protected handleSizeChanged(): void;
    protected handleAnchorChanged(): void;
    protected handleGrayedChanged(): void;
    getProp(index: number): any;
    setProp(index: number, value: any): void;
    setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
}

declare class GLabel extends GComponent {
    protected _titleObject: GObject;
    protected _iconObject: GObject;
    private _sound;
    private _soundVolumeScale;
    constructor();
    get icon(): ResURL | null;
    set icon(value: ResURL | null);
    get title(): string | null;
    set title(value: string | null);
    get text(): string | null;
    set text(value: string | null);
    get titleColor(): Color;
    set titleColor(value: Color);
    get titleFontSize(): number;
    set titleFontSize(value: number);
    set editable(val: boolean);
    get editable(): boolean;
    getTextField(): GTextField;
    getProp(index: number): any;
    setProp(index: number, value: any): void;
    protected constructExtension(buffer: ByteBuffer): void;
    setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
    private onClick_1;
}

declare class GButton extends GComponent {
    protected _titleObject: GObject;
    protected _iconObject: GObject;
    private _mode;
    private _selected;
    private _title;
    private _selectedTitle;
    private _icon;
    private _selectedIcon;
    private _sound;
    private _soundVolumeScale;
    private _buttonController;
    private _relatedController?;
    private _relatedPageId;
    private _changeStateOnClick;
    private _linkedPopup?;
    private _downEffect;
    private _downEffectValue;
    private _downColor?;
    private _downScaled?;
    private _down;
    private _over;
    static UP: string;
    static DOWN: string;
    static OVER: string;
    static SELECTED_OVER: string;
    static DISABLED: string;
    static SELECTED_DISABLED: string;
    constructor();
    get icon(): ResURL | null;
    set icon(value: ResURL | null);
    get selectedIcon(): ResURL | null;
    set selectedIcon(value: ResURL | null);
    get title(): string | null;
    set title(value: string | null);
    get text(): string | null;
    set text(value: string | null);
    get selectedTitle(): string | null;
    set selectedTitle(value: string | null);
    get titleColor(): Color;
    set titleColor(value: Color);
    get titleFontSize(): number;
    set titleFontSize(value: number);
    get sound(): string | null;
    set sound(val: string | null);
    get soundVolumeScale(): number;
    set soundVolumeScale(value: number);
    set selected(val: boolean);
    get selected(): boolean;
    get mode(): ButtonMode;
    set mode(value: ButtonMode);
    get relatedController(): Controller;
    set relatedController(val: Controller);
    get relatedPageId(): string | null;
    set relatedPageId(val: string | null);
    get changeStateOnClick(): boolean;
    set changeStateOnClick(value: boolean);
    get linkedPopup(): GObject;
    set linkedPopup(value: GObject);
    getTextField(): GTextField;
    fireClick(): void;
    protected setState(val: string): void;
    protected setCurrentState(): void;
    handleControllerChanged(c: Controller): void;
    protected handleGrayedChanged(): void;
    getProp(index: number): any;
    setProp(index: number, value: any): void;
    protected constructExtension(buffer: ByteBuffer): void;
    setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
    private onRollOver_1;
    private onRollOut_1;
    private onTouchBegin_1;
    private onTouchEnd_1;
    private onClick_1;
}

declare class GComboBox extends GComponent {
    dropdown: GComponent;
    protected _titleObject: GObject;
    protected _iconObject: GObject;
    protected _list: GList;
    private _items;
    private _values;
    private _icons?;
    private _visibleItemCount;
    private _itemsUpdated;
    private _selectedIndex;
    private _buttonController;
    private _popupDirection;
    private _selectionController;
    private _over;
    private _down;
    constructor();
    get text(): string | null;
    set text(value: string | null);
    get icon(): ResURL | null;
    set icon(value: ResURL | null);
    get titleColor(): Color;
    set titleColor(value: Color);
    get titleFontSize(): number;
    set titleFontSize(value: number);
    get visibleItemCount(): number;
    set visibleItemCount(value: number);
    get popupDirection(): PopupDirection;
    set popupDirection(value: PopupDirection);
    get items(): Array<string>;
    set items(value: Array<string>);
    get icons(): Array<string>;
    set icons(value: Array<string>);
    get values(): Array<string>;
    set values(value: Array<string>);
    get selectedIndex(): number;
    set selectedIndex(val: number);
    get value(): string | null;
    set value(val: string | null);
    get selectionController(): Controller;
    set selectionController(value: Controller);
    getTextField(): GTextField;
    protected setState(val: string): void;
    getProp(index: number): any;
    setProp(index: number, value: any): void;
    protected constructExtension(buffer: ByteBuffer): void;
    handleControllerChanged(c: Controller): void;
    private updateSelectionController;
    dispose(): void;
    setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
    protected showDropdown(): void;
    private onPopupClosed;
    private onClickItem;
    private onClickItem2;
    private onRollOver_1;
    private onRollOut_1;
    private onTouchBegin_1;
    private onTouchEnd_1;
}

declare class GSlider extends GComponent {
    private _min;
    private _max;
    private _value;
    private _titleType;
    private _reverse;
    private _wholeNumbers;
    private _titleObject;
    private _barObjectH;
    private _barObjectV;
    private _barMaxWidth;
    private _barMaxHeight;
    private _barMaxWidthDelta;
    private _barMaxHeightDelta;
    private _gripObject;
    private _clickPos;
    private _clickPercent;
    private _barStartX;
    private _barStartY;
    changeOnClick: boolean;
    canDrag: boolean;
    constructor();
    get titleType(): ProgressTitleType;
    set titleType(value: ProgressTitleType);
    get wholeNumbers(): boolean;
    set wholeNumbers(value: boolean);
    get min(): number;
    set min(value: number);
    get max(): number;
    set max(value: number);
    get value(): number;
    set value(value: number);
    update(): void;
    private updateWithPercent;
    protected constructExtension(buffer: ByteBuffer): void;
    protected handleSizeChanged(): void;
    setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
    private onGripTouchBegin;
    private onGripTouchMove;
    private onBarTouchBegin;
}

declare class GProgressBar extends GComponent {
    private _min;
    private _max;
    private _value;
    private _titleType;
    private _reverse;
    private _titleObject;
    private _aniObject;
    private _barObjectH;
    private _barObjectV;
    private _barMaxWidth;
    private _barMaxHeight;
    private _barMaxWidthDelta;
    private _barMaxHeightDelta;
    private _barStartX;
    private _barStartY;
    constructor();
    get titleType(): ProgressTitleType;
    set titleType(value: ProgressTitleType);
    get min(): number;
    set min(value: number);
    get max(): number;
    set max(value: number);
    get value(): number;
    set value(value: number);
    tweenValue(value: number, duration: number): GTweener;
    update(newValue: number): void;
    private setFillAmount;
    protected constructExtension(buffer: ByteBuffer): void;
    protected handleSizeChanged(): void;
    setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
}

declare class PopupMenu {
    protected _contentPane: GComponent;
    protected _list: GList;
    constructor(url?: string);
    dispose(): void;
    addItem(caption: string, callback?: (item?: GObject, evt?: Event) => void): GButton;
    addItemAt(caption: string, index: number, callback?: (item?: GObject, evt?: Event) => void): GButton;
    addSeperator(): void;
    getItemName(index: number): string;
    setItemText(name: string, caption: string): void;
    setItemVisible(name: string, visible: boolean): void;
    setItemGrayed(name: string, grayed: boolean): void;
    setItemCheckable(name: string, checkable: boolean): void;
    setItemChecked(name: string, checked: boolean): void;
    isItemChecked(name: string): boolean;
    removeItem(name: string): boolean;
    clearItems(): void;
    get itemCount(): number;
    get contentPane(): GComponent;
    get list(): GList;
    show(target?: GObject | null, dir?: PopupDirection | boolean): void;
    private onClickItem;
    private onClickItem2;
    private onDisplay;
}

declare class UIObjectFactory {
    static counter: number;
    static extensions: {
        [index: string]: new () => GComponent;
    };
    static loaderType: new () => GLoader;
    constructor();
    static setExtension(url: string, type: new () => GComponent): void;
    static setLoaderExtension(type: new () => GLoader): void;
    static resolveExtension(pi: PackageItem): void;
    static newObject(type: number | PackageItem, userClass?: new () => GObject): GObject;
}

interface ITooltipsView {
    /**
     * view
     */
    viewComponent: any;
    /**
     * 更新数据
     * @param data
     */
    update(data: TooltipsData): void;
    /**
     * 销毁
     */
    destroy(): void;
}

/**
 * tooltip管理器
 */
interface ITooltipsManager {
    /**
     * 注册
     * @param type
     * @param value
     */
    register(type: string, value: ITooltipsView): void;
    /**
     * 注销
     * @param type
     */
    unregister(type: string): void;
    /**
     * 是否正在显示中
     */
    readonly isShowing: boolean;
    /**
     * 显示
     * @param data
     */
    show(data: TooltipsData | undefined): void;
    /**
     * 隐藏
     */
    hide(): void;
}

declare class UIConfig {
    constructor();
    static defaultFont: string;
    static windowModalWaiting: string;
    static globalModalWaiting: string;
    static modalLayerColor: Color;
    static buttonSound: string;
    static buttonSoundVolumeScale: number;
    static horizontalScrollBar: string;
    static verticalScrollBar: string;
    static defaultScrollStep: number;
    static defaultScrollDecelerationRate: number;
    static defaultScrollBarDisplay: number;
    static defaultScrollTouchEffect: boolean;
    static defaultScrollBounceEffect: boolean;
    static popupMenu: string;
    static popupMenu_seperator: string;
    static loaderErrorSign: string;
    static tooltipsWin: string;
    /**提示管理器 */
    static tooltipsManager: ITooltipsManager;
    static defaultComboBoxVisibleItemCount: number;
    static touchScrollSensitivity: number;
    static touchDragSensitivity: number;
    static clickDragSensitivity: number;
    static bringWindowToFrontOnClick: boolean;
    static frameTimeForAsyncUIConstruction: number;
    static linkUnderline: boolean;
    static defaultUILayer: number;
}
declare function registerFont(name: string, font: Font | string, bundle?: AssetManager.Bundle): void;

declare class DragDropManager {
    private _agent;
    private _sourceData;
    private static _inst;
    static get inst(): DragDropManager;
    constructor();
    get dragAgent(): GObject;
    get dragging(): boolean;
    startDrag(source: GObject, icon: string | null, sourceData?: any, touchId?: number): void;
    cancel(): void;
    private onDragEnd;
}

declare class AsyncOperation {
    callback: (obj: GObject) => void;
    private _node;
    createObject(pkgName: string, resName: string): void;
    createObjectFromURL(url: string): void;
    cancel(): void;
    private internalCreateObject;
    private completed;
}

declare class TranslationHelper {
    static strings: {
        [index: string]: {
            [index: string]: string;
        };
    };
    static loadFromXML(source: string): void;
    static translateComponent(item: PackageItem): void;
}

declare class GearAnimation extends GearBase {
    private _storage;
    private _default;
    protected init(): void;
    protected addStatus(pageId: string, buffer: ByteBuffer): void;
    apply(): void;
    updateState(): void;
}

declare class GearColor extends GearBase {
    private _storage;
    private _default;
    protected init(): void;
    protected addStatus(pageId: string, buffer: ByteBuffer): void;
    apply(): void;
    updateState(): void;
}

declare class GearDisplay extends GearBase {
    pages: string[];
    private _visible;
    private _displayLockToken;
    protected init(): void;
    addLock(): number;
    releaseLock(token: number): void;
    get connected(): boolean;
    apply(): void;
}

declare class GearDisplay2 extends GearBase {
    pages: string[];
    condition: number;
    private _visible;
    protected init(): void;
    apply(): void;
    evaluate(connected: boolean): boolean;
}

declare class GearFontSize extends GearBase {
    private _storage;
    private _default;
    protected init(): void;
    protected addStatus(pageId: string, buffer: ByteBuffer): void;
    apply(): void;
    updateState(): void;
}

declare class GearIcon extends GearBase {
    private _storage;
    private _default;
    protected init(): void;
    protected addStatus(pageId: string, buffer: ByteBuffer): void;
    apply(): void;
    updateState(): void;
}

declare class GearText extends GearBase {
    private _storage;
    private _default;
    protected init(): void;
    protected addStatus(pageId: string, buffer: ByteBuffer): void;
    apply(): void;
    updateState(): void;
}

declare class GTween {
    static catchCallbackExceptions: boolean;
    static to(start: number, end: number, duration: number): GTweener;
    static to2(start: number, start2: number, end: number, end2: number, duration: number): GTweener;
    static to3(start: number, start2: number, start3: number, end: number, end2: number, end3: number, duration: number): GTweener;
    static to4(start: number, start2: number, start3: number, start4: number, end: number, end2: number, end3: number, end4: number, duration: number): GTweener;
    static toColor(start: number, end: number, duration: number): GTweener;
    static delayedCall(delay: number): GTweener;
    static shake(startX: number, startY: number, amplitude: number, duration: number): GTweener;
    static isTweening(target: any, propType?: any): Boolean;
    static kill(target: any, complete?: boolean, propType?: any): void;
    static getTween(target: any, propType?: any): GTweener;
}

declare enum EaseType {
    Linear = 0,
    SineIn = 1,
    SineOut = 2,
    SineInOut = 3,
    QuadIn = 4,
    QuadOut = 5,
    QuadInOut = 6,
    CubicIn = 7,
    CubicOut = 8,
    CubicInOut = 9,
    QuartIn = 10,
    QuartOut = 11,
    QuartInOut = 12,
    QuintIn = 13,
    QuintOut = 14,
    QuintInOut = 15,
    ExpoIn = 16,
    ExpoOut = 17,
    ExpoInOut = 18,
    CircIn = 19,
    CircOut = 20,
    CircInOut = 21,
    ElasticIn = 22,
    ElasticOut = 23,
    ElasticInOut = 24,
    BackIn = 25,
    BackOut = 26,
    BackInOut = 27,
    BounceIn = 28,
    BounceOut = 29,
    BounceInOut = 30,
    Custom = 31
}

declare class UBBParser {
    private _text;
    private _readPos;
    protected _handlers: {
        [index: string]: (tagName: string, end: boolean, attr: string) => string;
    };
    lastColor: string;
    lastSize: string;
    linkUnderline: boolean;
    linkColor: string;
    constructor();
    protected onTag_URL(tagName: string, end: boolean, attr: string): string;
    protected onTag_IMG(tagName: string, end: boolean, attr: string): string;
    protected onTag_Simple(tagName: string, end: boolean, attr: string): string;
    protected onTag_COLOR(tagName: string, end: boolean, attr: string): string;
    protected onTag_FONT(tagName: string, end: boolean, attr: string): string;
    protected onTag_SIZE(tagName: string, end: boolean, attr: string): string;
    protected getTagText(remove?: boolean): string;
    parse(text: string, remove?: boolean): string;
}

declare class Drongo {
    /**
     * UI资源AssetBundle
     */
    static UIBundle: string;
    /**
     * UI遮罩颜色值
     */
    static MaskColor: Color;
    static Init(root: Node, cb: () => void): void;
}

export { AsyncOperation, AudioChannelImpl, AudioManager, AudioManagerImpl, BitFlag, BlendMode, ByteArray, ByteBuffer, CCLoaderImpl, Controller, Dictionary, DragDropManager, Drongo, EaseType, Event$1 as Event, EventDispatcher, FGUIEvent, Frame, FullURL, GButton, GComboBox, GComponent, GGraph, GGroup, GImage, GLabel, GList, GLoader, GLoader3D, GMovieClip, GObject, GObjectPool, GProgressBar, GRichTextField, GRoot, GScrollBar, GSlider, GTextField, GTextInput, GTree, GTreeNode, GTween, GTweener, GearAnimation, GearBase, GearColor, GearDisplay, GearDisplay2, GearFontSize, GearIcon, GearLook, GearSize, GearText, GearXY, GetClassName, Handler, IAudioChannel, IAudioGroup, IAudioManager, IEventDispatcher, ILoader, IRes, IResManager, IResource, ITicker, ITickerManager, ITimer, Image, Injector, Key2URL, List, ListItemRenderer, Loader, LoaderQueue, MovieClip, PackageItem, PopupMenu, RelationType, Res, ResImpl, ResManager, ResManagerImpl, ResRef, ResRequest, ResURL, ResourceImpl, ScrollPane, StringUtils, TickerManager, TickerManagerImpl, Timer, TimerImpl, Transition, TranslationHelper, UBBParser, UIConfig, UIObjectFactory, UIPackage, URL2Key, Window, registerFont };
