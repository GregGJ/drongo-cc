import { Color, Vec2, Component, Node, Mask, Constructor, EventTarget, Event as Event$1, Size, Sprite, Rect as Rect$1, SpriteFrame, AssetManager, Asset, dragonBones, UITransform, UIOpacity, Graphics, AudioClip, Label, Font, HorizontalTextAlignment, VerticalTextAlignment, RichText, EditBox, sp, Vec3, Texture2D, gfx } from 'cc';

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
    private _maskContainerUITrans;
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
    private _invertedMask?;
    private _containerUITrans;
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

declare class FGUIEvent extends Event$1 {
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
    rect: Rect$1;
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
    scale9Grid?: Rect$1;
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
    protected _dragBounds?: Rect$1;
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
    get dragBounds(): Rect$1;
    set dragBounds(value: Rect$1);
    startDrag(touchId?: number): void;
    stopDrag(): void;
    get dragging(): boolean;
    localToGlobal(ax?: number, ay?: number, result?: Vec2): Vec2;
    globalToLocal(ax?: number, ay?: number, result?: Vec2): Vec2;
    localToGlobalRect(ax?: number, ay?: number, aw?: number, ah?: number, result?: Rect$1): Rect$1;
    globalToLocalRect(ax?: number, ay?: number, aw?: number, ah?: number, result?: Rect$1): Rect$1;
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
    private _assetBundle;
    private _containerUITrans;
    private static _errorSignPool;
    constructor();
    dispose(): void;
    get url(): ResURL | null;
    set url(value: ResURL | null);
    /**
     * 设置图片
     * @param url
     * @param bundleStr 远程包名称
     */
    setUrlWithBundle(url: ResURL, bundleStr?: string): void;
    set bundle(val: string);
    get bundle(): string;
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
    static defaultComboBoxVisibleItemCount: number;
    static touchScrollSensitivity: number;
    static loaderAssetsBundleName: string;
    static touchDragSensitivity: number;
    static clickDragSensitivity: number;
    static bringWindowToFrontOnClick: boolean;
    static frameTimeForAsyncUIConstruction: number;
    static linkUnderline: boolean;
    static defaultUILayer: number;
    /**提示管理器 */
    static tooltipsManager: ITooltipsManager;
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

/**
 * 资源地址
 */
type ResURL = string | {
    url: string;
    bundle: string;
    type: string | any;
    data?: string;
};
/**
 * 资源地址转唯一KEY
 * @param url
 * @returns
 */
declare function URL2Key(url: ResURL): string;
/**
 * 是否相等
 * @param a
 * @param b
 */
declare function URLEqual(a: ResURL, b: ResURL): boolean;
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
     * 淡入
     * @param time          过度时间(秒为单位)
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
    static PlayMusic(url: ResURL, volume?: number, speed?: number): void;
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
    PlayMusic(url: ResURL, volume: number, speed: number): void;
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
 * 绑定器工具类
 */
declare class BinderUtils {
    constructor();
    /**
     * 绑定
     * @param group
     * @param source
     * @param property
     * @param targetOrCallBack
     * @param tPropertyOrCaller
     */
    static Bind(group: any, source: any, property: string | Array<string>, targetOrCallBack: any | Function, tPropertyOrCaller: string | any): void;
    /**
     * 取消绑定
     * @param group
     * @param source
     * @param property
     * @param targetOrCallBack
     * @param tPropertyOrCaller
     * @returns
     */
    static Unbind(group: any, source: any, property?: string | Array<string>, targetOrCallBack?: any | Function, tPropertyOrCaller?: string | any): void;
    /**
     * 添加函数钩子
     * @param group
     * @param source
     * @param functionName
     * @param preHandler
     * @param laterHandler
     */
    static AddHook(group: any, source: any, functionName: string, preHandler: Handler, laterHandler: Handler): void;
    /**
     * 删除函数钩子
     * @param group
     * @param source
     * @param functionName
     * @param preHandler
     * @param laterHandler
     * @returns
     */
    static RemoveHook(group: any, source: any, functionName?: string, preHandler?: Handler, laterHandler?: Handler): void;
}

/**
 * 绑定工具类
 */
declare class BindingUtils {
    /**属性绑定记录 */
    private __bindRecords;
    /**方法绑定记录 */
    private __hookRecords;
    constructor();
    /**
     * 数据绑定
     * @param source
     * @param property
     * @param targetOrCallBack
     * @param tPropertyKeyOrCaller
     */
    private __bind;
    /**
     * 取消绑定
     * @param source
     * @param property
     * @param targetOrCallBack
     * @param tPropertyKeyOrCaller
     */
    private __unbind;
    /**
     * 添加函数钩子
     * @param source
     * @param functionName
     * @param preHandles
     * @param laterHandlers
     */
    private __addHook;
    /**
     * 删除函数钩子
     * @param source
     * @param functionName
     * @param preHandle
     * @param laterHandler
     */
    private __removeHook;
    /**
     * 属性和属性的绑定
     * @param source            数据源
     * @param property          数据源属性名
     * @param target            目标对象
     * @param targetProperty    目标对象属性名
     */
    BindAA(source: any, property: string, target: any, targetProperty: string): void;
    /**
     * 取消属性和属性的绑定
     * @param source
     * @param property
     * @param target
     * @param targetProperty
     */
    UnbindAA(source: any, property: string, target: any, targetProperty: string): void;
    /**
     * 属性和函数的绑定
     * @param source
     * @param property
     * @param callBack
     * @param caller
     */
    BindAM(source: any, property: string | Array<string>, callBack: (prepertys: Array<string>) => void, caller: any): void;
    /**
     * 取消属性和函数的绑定
     * @param source
     * @param propertys
     * @param callBack
     * @param caller
     */
    UnbidAM(source: any, propertys: string | Array<string>, callBack: (prepertys: Array<string>) => void, caller: any): void;
    /**
     * 函数和函数的绑定
     * @param source
     * @param functionName  目标函数
     * @param preHandle     该函数将在目标函数调用前调用
     * @param laterHandler  该函数将在目标函数调用后调用
     */
    BindMM(source: any, functionName: string, preHandle: Handler, laterHandler?: Handler): void;
    /**
     * 取消方法和方法的绑定关系
     * @param source
     * @param functionName
     * @param preHandle
     * @param laterHandler
     */
    UnbindMM(source: any, functionName: string, preHandle: Handler, laterHandler: Handler): void;
    BindByRecords(): void;
    UnbindByRecords(): void;
    /**
     * 销毁
     */
    Destroy(): void;
}

declare class FunctionHook {
    data: any;
    /**
     * 已添加好钩子的方法
     */
    private __functions;
    private __preHandlerMap;
    private __laterHandlerMap;
    private __groupMap;
    constructor(data: any);
    /**
     * 添加钩子
     * @param group
     * @param functionName
     * @param preHandlers
     * @param laterHandlers
     */
    AddHook(group: any, functionName: string, preHandler: Handler, laterHandler: Handler): void;
    /**
     * 删除钩子
     * @param group
     * @param functionName
     * @param preHandler
     * @param laterHandler
     * @returns
     */
    RemoveHook(group: any, functionName?: string, preHandler?: Handler, laterHandler?: Handler): void;
}

/**
 * 属性绑定器
 */
declare class PropertyBinder {
    data: any;
    /**
     * 代理过的数据
     */
    private __propertys;
    /**
     * 属性改变列表
     */
    private __changedPropertys;
    private __bindedMap;
    private __bindedGroupMap;
    constructor(data: any);
    /**
     * 绑定
     * @param group
     * @param property
     * @param targetOrCallBack
     * @param tPropertyOrCaller
     * @returns
     */
    Bind(group: any, property: string | Array<string>, targetOrCallBack: any | Function, tPropertyOrCaller: string | any): void;
    /**
     * 取消绑定
     * @param group
     * @param property
     * @param targetOrCallBack
     * @param tPropertyOrCaller
     * @returns
     */
    Unbind(group: any, property?: string | Array<string>, targetOrCallBack?: any | Function, tPropertyOrCaller?: string | any): void;
    /**
    * 检测属性
    * @param propertyKey
    */
    private __checkProperty;
    /**定义 */
    private __defineReactive;
    private __propertyChanged;
    private __nextFramePropertyUpdate;
    /**
     * 属性更新
     * @param pKey
     */
    private __updateProperty;
}

/**
 * 配置存取器接口
 */
interface IConfigAccessor {
    /**
     * 保存
     * @param value
     */
    Save(value: any): boolean;
    /**
     * 获取所有元素
     */
    GetElements<T>(): Array<T>;
    /**
     * 清理
     */
    Destroy(): void;
}

/**
 * 配置存取器基类
 */
declare class BaseConfigAccessor implements IConfigAccessor {
    protected $configs: Array<any>;
    constructor();
    Save(value: any): boolean;
    /**
     * 获取
     * @param key
     * @param value
     * @returns
     */
    GetElements<T>(): Array<T>;
    Destroy(): void;
}

/**
 * 配置表管理器
 */
declare class ConfigManager {
    static KEY: string;
    /**配置表名转地址 */
    static Sheet2URL: (sheet: string) => ResURL;
    /**地址转配置表名 */
    static URL2Sheet: (url: ResURL) => string;
    /**
      * 注册存取器
      * @param sheet
      * @param accessors
      */
    static Register(sheet: string, accessors: new () => IConfigAccessor): void;
    /**
     * 获取存取器类
     * @param sheet
     * @returns
     */
    static GetAccessorClass(sheet: string): new () => IConfigAccessor;
    /**
     * 获取配置存取器
     * @param sheet
     */
    static GetAccessor(sheet: string): IConfigAccessor;
    private static __impl;
    private static get impl();
}

declare class ConfigStorage {
    key: string;
    keys: Array<string>;
    map: Map<string, any>;
    constructor(keys: Array<string>);
    Save(value: any): void;
    Get<T>(key: string): T;
    Destroy(): void;
}

declare class MapConfigAccessor extends BaseConfigAccessor implements IConfigAccessor {
    protected $storages: Map<string, ConfigStorage>;
    constructor();
    /**
     * 增加存储方式
     * @param keys
     */
    protected AddStorage(keys: Array<string>): void;
    Save(value: any): boolean;
    /**
      * 获取
      * @param keys
      * @param values
      * @returns
      */
    Get<T>(keys?: Array<string>, values?: Array<any>): T;
    /**
     * 获取存储器
     * @param keys
     * @returns
     */
    GetStorage(keys: Array<string>): ConfigStorage;
    Destroy(): void;
}

/**
 * 单key存储器默认key="id"
 */
declare class OneKeyConfigAccessor extends BaseConfigAccessor {
    private __map;
    private __key;
    constructor(key?: string);
    Save(value: any): boolean;
    Get<T>(key: any): T | null;
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
    On(key: string, handler: (e: DEvent) => void, caller: any, priority?: number): void;
    /**
     * 删除事件监听
     * @param key
     * @param caller
     * @param handler
     */
    Off(key: string, handler: (e: DEvent) => void, caller: any): void;
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
    HasEventHandler(key: string, handler: (e: DEvent) => void, caller: any): boolean;
    /**
     * 销毁
     */
    Destroy(): void;
}

declare class DEvent {
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
    static readonly STATE_CHANGED: string;
    static readonly VALUE_CHANGED: string;
    static readonly ADD_CHILD: string;
    static readonly REMOVE_CHILD: string;
    static readonly CHILD_VALUE_CHANGED: string;
    /**
     * 事件类型
     */
    type: string;
    /**
     * 事件派发者
     */
    target: IEventDispatcher;
    /**
     * 停止派发
     */
    propagationStopped: boolean;
    /**
     * 错误对象
     */
    error: Error;
    /**
     * 进度
     */
    progress: number;
    /**
     * 事件数据
     */
    data: any;
    constructor(type: string, target: IEventDispatcher, data?: any, err?: Error, progress?: number);
    /**
     * 初始化
     * @param type
     * @param target
     * @param data
     * @param err
     * @param progress
     */
    Init(type: string, target: IEventDispatcher, data?: any, err?: Error, progress?: number): void;
    Reset(): void;
    private static __pool;
    /**
     * 创建事件对象,优先从池中获取
     * @param type
     * @param target
     * @param data
     * @param err
     * @param progress
     */
    static Create(type: string, target: IEventDispatcher, data?: any, err?: Error, progress?: number): DEvent;
    /**
     * 退还
     * @param value
     */
    static BackToPool(value: DEvent): void;
}

/**
 * 事件分发器(只有一对多的情况下去使用)
 */
declare class EventDispatcher implements IEventDispatcher {
    /**
     * 全局事件通道
     */
    static Global: EventDispatcher;
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
    On(key: string, handler: (e: DEvent) => void, caller: any, priority?: number): void;
    /**
     * 删除事件监听
     * @param key
     * @param caller
     * @param handler
     */
    Off(key: string, handler: (e: DEvent) => void, caller: any): void;
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
    Emit(type: string, data?: any, err?: Error, progress?: number): void;
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
    HasEventHandler(key: string, handler: (e: DEvent) => void, caller: any): boolean;
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

declare class Debuger {
    static KEY: string;
    /**
     * 引擎
     */
    static DRONGO: string;
    /**
     * 最大保存条数
     */
    static MaxCount: number;
    /**
     * 设置过滤
     * @param key
     * @param isOpen
     */
    static Debug(type: string, isOpen: boolean): void;
    /**
     * 获取已保存的日志
     * @param type
     * @returns
     */
    static GetLogs(type?: string): Array<string>;
    static Log(type: string, msg: any): void;
    static Err(type: string, msg: any): void;
    static Warn(type: string, msg: any): void;
    static Info(type: string, msg: any): void;
    private static __impl;
    private static get impl();
}

/**
 * 状态接口
 */
interface IState {
    name: string;
    /**初始化 */
    Init(fsm: FSM): void;
    /**进入 */
    Enter(data?: any): void;
    /**心跳 */
    Tick(dt: number): void;
    /**退出 */
    Exit(): void;
    /**销毁 */
    Destroy(): void;
}

/**
 * 状态机
 */
declare class FSM extends EventDispatcher {
    /**所属*/
    owner: any;
    debug: boolean;
    private __current;
    private __state;
    private __states;
    private __name;
    constructor(owner: any, name: string);
    Tick(dt: number): void;
    /**
     * 添加
     * @param key
     * @param v
     */
    AddState(key: number, v: IState): void;
    /**
     * 切换状态
     * @param value
     * @param data
     * @returns
     */
    SwitchState(value: number, data?: any): void;
    get state(): number;
    get current(): IState;
    Destroy(): void;
}

declare enum GUIState {
    /**
     * 未使用状态
     */
    Null = 0,
    /**
     * 显示处理中
     */
    Showing = 1,
    /**
     * 已显示
     */
    Showed = 2,
    /**
     * 关闭处理中
     */
    Closeing = 3,
    /**
     * 已关闭
     */
    Closed = 4
}

/**
 * 服务接口
 */
interface IService {
    /**
     * 名称
     */
    name: string;
    /**
     * 依赖的配置资源
     */
    configs: Array<string>;
    /**
     * 依赖的资源
     */
    assets: Array<ResURL>;
    /**
     * 初始化
     */
    Init(): void;
    /**
     * 销毁(内部接口，请在不需要该服务时调用ServiceManager.Dispose()接口)
     */
    Destroy(): void;
}

interface IViewComponent {
    /**
     * 可见性
     */
    visible: boolean;
}

interface IGUIMediator {
    info: any;
    /**
     * 依赖的配置
     */
    configs: Array<string>;
    /**依赖的资源*/
    assets: Array<ResURL>;
    /**
     * 依赖的服务
     */
    services: Array<{
        new (): IService;
    }>;
    /**
     * 是否显示进度条
     */
    showLoadingView: boolean;
    /**
     * 显示界面时是否关闭进度条
     */
    closeLoadingView: boolean;
    /**
     * 界面准备时汇报总比值
     */
    loadingViewTotalRatio: number;
    /**初始化完毕 */
    inited: boolean;
    /**
     * 显示节点
     */
    viewComponent: IViewComponent | null;
    /**
     * 播放显示动画
     * @param complete
     */
    PlayShowAnimation?: (complete: () => void) => void;
    /**
     * 界面关闭时播放的动画
     * @param complete
     */
    PlayHideAnimation?: (complete: () => void) => void;
    /**
     * 创建UI
     * @param info
     * @param created
     */
    CreateUI(info: any, created: Function): void;
    /**
     * 初始化
     */
    Init(): void;
    /**
     * 心跳
     * @param dt
     */
    Tick(dt: number): void;
    /**
     * 显示(内部接口，请勿调用)
     * @param data
     */
    Show(data?: any): void;
    /**
     * 当已经处在显示中 GUIManager.call时 则调用该方法而不调用showedUpdate
     * @param data
     */
    ShowedUpdate(data?: any): void;
    /**
     * 隐藏(内部接口，请勿调用)
     * @param info
     */
    Hide(): void;
    /**
     * 销毁
     */
    Destroy(): void;
    /**
     * 获取组件
     * @param path
     */
    GetUIComponent(path: string): any;
}

/**
     * GUI 管理器
     */
declare class GUIManager {
    static KEY: string;
    /**
     * 在界面关闭后多长时间不使用则销毁(秒)
     */
    static GUI_GC_INTERVAL: number;
    /**
     * 注册
     * @param info
     * @returns
     */
    static Register(info: {
        key: string;
    }): void;
    /**
     * 注销
     * @param key
     * @returns
     */
    static Unregister(key: string): void;
    /**
     * 打开指定UI界面
     * @param key
     * @param data
     */
    static Open(key: string, data?: any): void;
    /**
     * 关闭
     * @param key
     * @param checkLayer 是否检查全屏记录
     */
    static Close(key: string, checkLayer?: boolean): void;
    /**
     * 关闭所有界面
     */
    static CloseAll(): void;
    /**
     * 获取界面状态
     * @param key
     * @returns  0 未显示  1显示中
     */
    static GetGUIState(key: string): GUIState;
    /**
     * 是否已打开或再打开中
     * @param key
     * @returns
     */
    static IsOpen(key: string): boolean;
    /**
     * 获取GUI中的某个组件
     * @param key    界面全局唯一KEY
     * @param path   组件名称/路径
     */
    static GetUIComponent(key: string, path: string): any;
    /**
     * 获取界面的mediator
     */
    static GetMediatorByKey(key: string): IGUIMediator;
    /**
     * 获得前一个打开的全屏界面
     * @param curLayerKey 当前打开的全屏界面
     */
    static GetPrevLayer(): string;
    private static __impl;
    private static get impl();
}

interface ILayer {
    AddChild(child: any): void;
    AddChildAt(child: any, index: number): void;
    RemoveChild(child: any): void;
    RemoveChildAt(index: number): void;
    /**
     * 获取指定索引内容
     * @param index
     */
    GetChildAt(index: number): any;
    /**
     * 当前层拥有的子对象数量
     */
    GetCount(): number;
}

/**
 * 层管理器
 */
declare class LayerManager {
    static KEY: string;
    /**
     * 添加一个层
     * @param key
     * @param layer
     */
    static AddLayer(key: string, layer: ILayer): void;
    /**
     * 删除层
     * @param key
     */
    static RemoveLayer(key: string): void;
    /**
     * 获取层对象
     * @param key
     */
    static GetLayer(key: string): ILayer | undefined;
    /**
     * 获得所有层
     */
    static GetAllLayer(): ILayer[];
    private static __impl;
    private static get impl();
}

/**
 * 加载界面
 */
interface ILoadingView {
    /**
     * 更新
     * @param data
     */
    ChangeData(data: {
        progress?: number;
        label?: string;
        tip?: string;
    }): void;
    /**
     * 显示
     */
    Show(): void;
    /**
     * 隐藏
     */
    Hide(): void;
}

/**
 * 加载界面
 */
declare class LoadingView {
    static KEY: string;
    static Show(): void;
    static Hide(): void;
    static ChangeData(data: {
        progress?: number;
        label?: string;
        tip?: string;
    }): void;
    private static __impl;
    static get impl(): ILoadingView;
}

/**
 * UI关联数据列表
 */
interface IRelationList {
    /**
     * 要显示的UI列表
     */
    show: Array<string>;
    /**
     * 要隐藏的UI列表
     */
    hide: Array<string>;
}

/**
 * UI关联数据
 */
interface IRelationInfo {
    /**
     * 显示时的关联
     */
    show: IRelationList;
    /**
     * 隐藏时的关联
     */
    hide: IRelationList;
}

/**
* GUI 关联关系
*/
declare class RelationManager {
    static DEBUG: boolean;
    private static __map;
    constructor();
    /**
     * 添加UI关联关系
     * @param key
     * @param value
     */
    static AddRelation(key: string, value: IRelationInfo): void;
    static RemoveRelation(key: string): void;
    /**
     * 检测合法性
     * @param value
     */
    private static __checkValidity;
    static GetRelation(key: string): IRelationInfo;
}

/**
 * UI管理器接口
 */
interface IGUIManager {
    /**
     * 注册
     * @param key
     * @param mediatorClass
     * @param data
     */
    Register(info: {
        key: string;
    }): void;
    /**
     * 注销
     * @param key
     */
    Unregister(key: string): void;
    /**
     * 心跳
     * @param dt
     */
    Tick(dt: number): void;
    /**
     * 打开
     * @param key
     * @param data
     */
    Open(key: string, data?: any): void;
    /**
     * 关闭
     * @param key
     * @param checkLayer  是否检查全屏打开记录
     */
    Close(key: string, checkLayer: boolean): void;
    /**
     * 关闭所有
     * @param key
     */
    CloseAll(): void;
    /**
     * 是否已打开
     * @param key
     * @returns
     */
    GetGUIState(key: string): GUIState;
    /**
     * 获取GUI中的某个组件
     * @param key    界面全局唯一KEY
     * @param path   组件名称/路径
     */
    GetUIComponent(key: string, path: string): any;
    /**
     * 获取界面Mediator
     * @param key 界面全局唯一KEY
     */
    GetMediatorByKey(key: string): IGUIMediator;
    /**
     * 获得前一个打开的全屏界面
     */
    GetPrevLayer(): string;
    /**
     * 是否已打开或打开中
     * @param key
     */
    IsOpen(key: string): boolean;
}

interface IViewCreator {
    /**
     * 创建Mediator
     */
    createMediator(): IGUIMediator;
}

/**
 * 基础UIMediator类
 */
declare class BaseMediator {
    /**UI组件 */
    ui: GComponent | null;
    /**初始化完毕*/
    inited: boolean;
    /**外部传参*/
    data: any;
    /**需要注册和删除的事件*/
    private __bindEvents;
    private __bindingUtils;
    constructor();
    Init(): void;
    Tick(dt: number): void;
    Show(data: any): void;
    ShowedUpdate(data?: any): void;
    Hide(): void;
    Destroy(): void;
    /**
     * 根据名称或路径获取组件
     * @param path
     * @returns
     */
    GetUIComponent(path: string): any;
    /**
     * 属性和属性的绑定
     */
    BindAA(source: any, property: string, target: any, tProperty: string): void;
    /**
     * 取消属性和属性的绑定
     * @param source
     * @param property
     * @param target
     * @param tProperty
     */
    UnbindAA(source: any, property: string, target: any, tProperty: string): void;
    /**
     * 属性和函数的绑定
     * @param source
     * @param property
     * @param callBack
     * @param caller
     */
    BindAM(source: any, property: string | Array<string>, callBack: (prepertys: Array<string>) => void, caller: any): void;
    /**
     * 取消属性和函数的绑定
     * @param source
     * @param propertys
     * @param callBack
     * @param caller
     */
    UnbidAM(source: any, propertys: string | Array<string>, callBack: (prepertys: Array<string>) => void, caller: any): void;
    /**
     * 函数和函数的绑定
     * @param source
     * @param functionName  目标函数
     * @param preHandle     该函数将在目标函数调用前调用
     * @param laterHandler  该函数将在目标函数调用后调用
     */
    BindMM(source: any, functionName: string, preHandle: Handler, laterHandler?: Handler): void;
    /**
     * 取消方法和方法的绑定关系
     * @param source
     * @param functionName
     * @param preHandle
     * @param laterHandler
     */
    UnbindMM(source: any, functionName: string, preHandle: Handler, laterHandler: Handler): void;
    /**
     * 绑定事件
     * @param target
     * @param type
     * @param handler
     * @param caller
     */
    BindEvent(target: any, type: string, handler: Function, caller: any): void;
    /**
     * 取消事件绑定
     * @param target
     * @param type
     * @param handler
     * @param caller
     */
    UnbindEvent(target: any, type: string, handler: Function, caller: any): void;
    /**
     * 按照绑定记录添加事件
     */
    _addBindedEvents(): void;
    /**
     * 删除已绑定事件
     */
    _removeBindedEvents(): void;
}

interface IGUIInfo {
    /**
     * UI 全局唯一KEY
     */
    key: string;
    /**
     * 是否永久存在
     */
    permanence: boolean;
    /**
     * UI所在层
     */
    layer: string;
    /**
     * 是否使用遮罩
     */
    modal: boolean;
    /**
     * 点击蒙版时时候关闭界面
     */
    modalClose: boolean;
    /**
     * 资源包
     */
    bundleName: string;
    /**
     * UIPackage名称
     */
    packageName: string;
    /**
     * FGUI 组件名
     */
    comName: string;
    /**UI所属状态 */
    state: GUIState;
}

/**
 * 子UI 逻辑划分
 */
declare class SubGUIMediator extends BaseMediator {
    /**所属GUI*/
    owner: GUIMediator | null;
    constructor(ui: GComponent | null, owner: GUIMediator | null);
    /**
     * 子类必须在构造函数中调用
     */
    Init(): void;
    Show(data: any): void;
    Hide(): void;
    Destroy(): void;
}

/**
 * UI中介者
 */
declare class GUIMediator extends BaseMediator implements IGUIMediator {
    info: IGUIInfo | null;
    /**依赖的服务 */
    services: Array<{
        new (): IService;
    }>;
    /**依赖的配置表 */
    configs: Array<string>;
    /**依赖的资源*/
    assets: Array<ResURL>;
    /**是否显示进度界面 */
    showLoadingView: boolean;
    /**显示界面时是否关闭进度条*/
    closeLoadingView: boolean;
    /**界面从开始加载到底层调用Show方法之前的进度总比值 */
    loadingViewTotalRatio: number;
    /**根节点 */
    viewComponent: GComponent | null;
    /**遮罩 */
    private __mask;
    /**创建UI完成回调*/
    private __createdCallBack;
    /**子Mediator(用于代码拆分),记住只能在Init函数中赋值*/
    protected $subMediators: Array<SubGUIMediator>;
    /**
     * 播放显示动画
     * @param complete
     */
    PlayShowAnimation?: (complete: () => void) => void;
    /**
     * 界面关闭时播放的动画
     * @param complete
     */
    PlayHideAnimation?: (complete: () => void) => void;
    constructor();
    /**
     * 创建UI
     * @param info
     * @param created
     */
    CreateUI(info: any, created: () => void): void;
    private __asyncCreator;
    private __createUI;
    private __uiCreated;
    protected _maskClickHandler(): void;
    Init(): void;
    Show(data?: any): void;
    ShowedUpdate(data?: any): void;
    Hide(): void;
    /**
     * 关闭
     * @param checkLayer 是否检查全屏层记录
     */
    Close(checkLayer?: boolean): void;
    Tick(dt: number): void;
    /**
     * 获取服务
     * @param clazz
     * @returns
     */
    GetService(clazz: {
        new (): IService;
    }): IService;
    Destroy(): void;
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

/**
 * GUI代理，将资源加载和Mediator逻辑隔离开
 */
declare class GUIProxy {
    /**用于Creator创建器的统一帮助节点 */
    private static createNode;
    info?: IGUIInfo;
    /**GUI中介*/
    mediator?: IGUIMediator;
    /**关闭时间*/
    closeTime: number;
    /**数据 */
    data: any;
    /**引用的资源 */
    urls: Array<ResURL>;
    assets: Array<ResRef>;
    /**是否在显示中*/
    private __showing;
    /**加载状态 */
    private __loadState;
    constructor(info: IGUIInfo);
    /**
     * 加载代码包
     */
    private __loadCodeBundle;
    /**
     * 代码包加载完成
     */
    private __codeBundleLoaded;
    private __loadAssets;
    /**
    * 初始化服务
    */
    private __initServices;
    /**
     * 创建UI
     */
    private __createUI;
    /**
     * UI创建完成回调
     */
    private __createUICallBack;
    private __addToLayer;
    Tick(dt: number): void;
    Show(data?: any): void;
    ShowedUpdate(data: any): void;
    private __show;
    private __showAnimationPlayed;
    Hide(): void;
    private __hideAnimationPlayed;
    private __hide;
    Destroy(): void;
    private getLayerChildCount;
    private get layer();
    /**
     * 获取组件
     * @param path
     */
    getComponent(path: string): any;
}

declare class Layer extends GComponent implements ILayer {
    isFullScrene: boolean;
    openRecord: Array<string>;
    constructor(name: string, isFullScrene?: boolean);
    AddChild(child: any): void;
    AddChildAt(child: any, index: number): void;
    RemoveChild(child: any): void;
    RemoveChildAt(index: number): void;
    GetChildAt(index: number): GObject;
    GetCount(): number;
}

declare enum FindPosition {
    ShortSideFit = 0,
    BottomLeft = 1,
    ContactPoint = 2,
    LongSideFit = 3,
    AreaFit = 4
}

declare class Rect {
    /**
     * 起点 x 坐标
     */
    x: number;
    /**
     * 起点 y 坐标
     */
    y: number;
    /**
     * 宽度
     */
    width: number;
    /**
     * 高度
     */
    height: number;
    /**
     * 当前是否被旋转了
     */
    isRotated: boolean;
    /**
     * 自定义信息
     */
    info: any;
    /**
     * 克隆
     */
    Clone(): Rect;
    /**
     * 矩形是否在另一个矩形内部
     * @param otherRect {Rect}
     */
    IsIn(otherRect: Rect): boolean;
    get isEmpty(): boolean;
}

declare class MaxRectBinPack {
    private containerHeight;
    private containerWidth;
    private allowRotate;
    private freeRects;
    private usedRects;
    /**
     * 构建方程
     * @param width {number} 画板宽度
     * @param height {number} 画板高度
     * @param allowRotate {boolean} 允许旋转
     */
    constructor(width: number, height: number, allowRotate?: boolean);
    /**
     * 在线算法入口 插入矩形方法
     * @param width {number}
     * @param height {number}
     * @param method {FindPosition}
     */
    Insert(width: number, height: number, method: FindPosition): Rect;
    /**
     * 占有率
     * @returns
     */
    get occupancy(): number;
    /**
     * 擦除节点
     * @param rect
     */
    EraseNoce(rect: Rect): void;
    /**
     *
     * @param node
     */
    private PlaceRectangle;
    private ScoreRectangle;
    private FindPositionForNewNodeBottomLeft;
    private FindPositionForNewNodeBestShortSideFit;
    private FindPositionForNewNodeBestLongSideFit;
    private FindPositionForNewNodeBestAreaFit;
    private CommonIntervalLength;
    private ContactPointScoreNode;
    private FindPositionForNewNodeContactPoint;
    private SplitFreeNode;
    private PruneFreeList;
}

/**
 * 可重复利用对象接口
 */
interface IRecyclable {
    /**
     * 重置到可复用状态
     */
    Reset(): void;
    /**
     * 销毁
     */
    Destroy(): void;
}

/**
 * 对象池
 */
declare class Pool {
    private static __pools;
    /**
     * 分配
     * @param clazz
     * @param maxCount
     * @returns
     */
    static allocate<T extends IRecyclable>(clazz: {
        new (): T;
    }, maxCount?: number): T;
    /**
     * 回收
     * @param value
     */
    static recycle(value: IRecyclable): void;
    /**
     * 回收多个对象
     * @param list
     */
    static recycleList(list: Array<IRecyclable>): void;
    /**
     * 回收该类型的所有对象
     * @param clazz
     */
    static recycleAll<T extends IRecyclable>(clazz: {
        new (): T;
    }): void;
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
    /**
     * 资源的引用列表
     */
    readonly refList: Array<ResRef>;
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

declare class Resource implements IResource {
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
    /**
     * 引用列表
     */
    get refList(): Array<ResRef>;
}

/**
 *  服务基类
 */
declare class BaseService implements IService {
    /**名称 */
    name: string;
    /**
     * 依赖的配置表名称
     */
    configs: Array<string>;
    /**
     * 依赖的资源
     */
    assets: Array<ResURL>;
    constructor();
    Init(): void;
    Destroy(): void;
}

declare class ServiceProxy {
    service: IService;
    refs: Array<ResRef>;
    /**
     * 引用计数器
     */
    refCount: number;
    constructor(service: IService, refs: Array<ResRef>);
    AddRef(): void;
    RemoveRef(): void;
    Destroy(): void;
}

declare class ServiceManager {
    /**
     * 最大启动线程
     */
    static MAX_LOADER_THREAD: number;
    private static __requests;
    /**
     * 加载
     * @param services
     * @param progress
     * @param callback
     */
    static Load(services: Array<{
        new (): IService;
    }>, progress: (progress: number) => void, callback: (err: Error) => void): void;
    static ChildComplete(service: new () => IService, proxy: ServiceProxy): void;
    static ChildError(service: new () => IService, err: Error): void;
    static ChildProgress(service: new () => IService, progress: number): void;
    private static __addRequest;
    private static __removeRequest;
    private static __services;
    /**
     * 获取代理
     * @param clazz
     * @returns
     */
    static GetServiceProxy(clazz: new () => IService): ServiceProxy;
    /**
     * 获取服务
     * @param clazz
     */
    static GetService(clazz: {
        new (): IService;
    }): IService;
    /**
     * 尝试销毁服务
     * @param clazz
     */
    static Dispose(clazz: {
        new (): IService;
    }): void;
}

/**
 * 任务接口
 */
interface ITask extends IEventDispatcher {
    /**
     * 开始(请在完成后派发Event.COMPLETE事件),例外可以派发PROGRESS和ERROR
     * @param data
     */
    Start(data?: any): void;
    /**
     * 销毁
     */
    Destroy(): void;
}

/**
 * 任务队列
 */
declare class TaskQueue extends EventDispatcher implements ITask {
    private __taskList;
    private __index;
    private __data;
    constructor();
    AddTask(value: ITask): void;
    RemoveTask(value: ITask): void;
    Start(data?: any): void;
    private __tryNext;
    private __subTaskEventHandler;
    Destroy(): void;
}

/**
 * 任务序列（并行）
 */
declare class TaskSequence extends EventDispatcher implements ITask {
    private __taskList;
    private __index;
    private __data;
    constructor();
    AddTask(value: ITask): void;
    RemoveTask(value: ITask): void;
    Start(data?: any): void;
    private __subTaskEventHandler;
    Destroy(): void;
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

declare class Tr {
    /**
    * 当前语言
    */
    static lang: string;
    /**
     * 语言数据
     */
    private static langPacks;
    /**
     * 初始化
     * @param langPacks
     */
    static init(langPacks: any): void;
    /**
     * 转换文字语言
     */
    static Traslate(value: string, ...rest: any[]): string;
    /**
     * 替换参数
     * substitute("你好{0},你吃{1}了吗?","蝈蝈","饭")
     * 返回 你好蝈蝈你吃饭了吗?
     * @param value
     * @param rest
     * @returns
     */
    static Substitute(value: string, ...rest: any[]): string;
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
     *  let str:string = "here is some info '{0}' and {1}";
     *  console.log(StringUtil.substitute(str, 15.4, true));
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
     * 获取父文件夹路径
     * @param url
     * @param separator
     * @returns
     */
    static GetDir(url: string, separator?: string): string;
    /**
     * 替换后缀
     * @param url
     * @param suff      后缀
     * @returns
     */
    static ReplaceSuffix(url: string, suff: string): string;
    /**
     * 拼装
     * @param keys
     * @param sp
     * @returns
     */
    static PieceTogether(keys: Array<string>, sp?: string): string;
    /**
     * 获取单词指定位置单词
     * @param str
     * @param n
     * @returns
     */
    static GetWord(str: string, n: number | Array<number>): string | Array<string>;
    static GetContractName(code: string): string;
    static GetFunctionName(code: string): string;
    static GetClassName(value: any): string;
}

declare class MathUtils {
    /**
     * 环形映射
     * @param value
     * @param min
     * @param max
     */
    static CircularMapping(value: number, max: number, min?: number): number;
    /**
     * 绕点旋转
     * @param angle
     * @param point
     * @param origin
     * @param out
     */
    static RotationFormOrigin(angle: number, point: Vec3, origin: Vec3, out: Vec3): void;
    /**
     * 求圆内多边形的中心点的高度
     * @param l     边长
     * @param n     内角
     */
    static InCirclePolygonCentre(l: number, n: number): number;
    /**
     * 随机范围值
     * @param min
     * @param max
     */
    static RandomRange(min: number, max: number): number;
    /**
     * 获取速度分量 从2个点及速度计算
     * @param currentPoint
     * @param targetPoint
     * @param speed
     * @param result
     */
    static getSpeed2dByPoint(currentPoint: Vec2, targetPoint: Vec2, speed: number, result?: Vec2): Vec2;
    /**
     * 速度转2维速度
     * @param angle         角度
     * @param speed         速度
     * @param result        结果
     */
    static getSpeed2D(angle: number, speed: number, result?: Vec2): Vec2;
    static getSpeed2DR(radian: number, speed: number, result?: Vec2): Vec2;
    /**
     * 根据角度和X轴计算Y轴速度
     * @param angle
     * @param speedX
     * @param result
     */
    static getSpeed2DByX(angle: number, speedX: number, result?: Vec2): Vec2;
    /**
     * 求旋转后的点坐标
     * @param angle         角度
     * @param point         旋转前的坐标点
     * @param result
     */
    static rotationPoint(angle: number, point: {
        x: number;
        y: number;
    }, result: {
        x: number;
        y: number;
    }): void;
    static getAngle(a: Vec2, b: Vec2): number;
    static getRadianByPoint(a: Vec2, b: Vec2): number;
    static getRadian(ax: number, ay: number, bx: number, by: number): number;
    static angle2Radian(angle: number): number;
    static radian2Angle(radian: number): number;
    /**
     * 计算两线段相交点坐标
     * @param line1Point1
     * @param line1Point2
     * @param line2Point1
     * @param line2Point2
     * @return 返回该点
     */
    static getIntersectionPoint(line1Point1: Vec2, line1Point2: Vec2, line2Point1: Vec2, line2Point2: Vec2, result?: Vec2): Vec2;
    /**
     * 判断点是否在线段内
     * @param Pi
     * @param Pj
     * @param Q
     */
    static onSegment(Pi: Vec2, Pj: Vec2, Q: Vec2): boolean;
    /**
     * 求两个向量之间的夹角
     * @param av        单位向量
     * @param bv        单位向量
     */
    static calculateAngle(av: Vec3, bv: Vec3): number;
    static calculateAngleByPoints(a: Vec3, b: Vec3, c: Vec3): number;
}

declare enum SerializationMode {
    JSON = 0
}

declare class ChangedData {
    key: string;
    newValue: any;
    oldValue: any;
    constructor();
    static Create(newValue?: any, oldValue?: any, key?: string): ChangedData;
}

/**
 * 序列化接口
 */
interface ISerialization {
    /**
     * 编码
     * @param type
     * @param data
     */
    Encode(type: number, data?: any): any;
    /**
     * 解码
     * @param type
     * @param data
     */
    Decode(type: number, data: any): void;
}

/**
 * 值接口
 */
interface IValue extends IEventDispatcher, ISerialization {
    /**
     * 值对象（用于绑定）
     */
    value: any;
    /**
     * 获取值
     */
    GetValue(): any;
    /**
     * 设置值
     * @param value
     */
    SetValue(value: any): void;
    /**
     * 对比函数
     * @param value
     */
    Equality(value: IValue): boolean;
}

/**
 * 属性接口
 */
interface IProperty extends IValue {
    key: string;
}

declare class ModelFactory {
    /**
     * 根据数据创建值对象
     * @param data
     */
    static CreateValue(data: any): IValue;
    /**
     * 根据数据创建
     * @param type
     * @param key
     */
    static CreateProperty(key: string, data: any): IProperty;
}

/**
 * 值抽象类
 */
declare class BaseValue extends EventDispatcher implements IValue {
    value: any;
    constructor();
    GetValue(): any;
    SetValue(value: any): void;
    protected SendEvent(newValue: any, oldValue: any): void;
    /**
     * 检测值是否合法
     * @param value
     */
    protected CheckValue(value: any): boolean;
    /**
     * 反序列化
     * @param type
     * @param data
     */
    Decode(type: number, data: any): void;
    /**
     * 序列化
     * @param type
     * @param data
     * @returns
     */
    Encode(type: number, data?: any): any;
    Equality(value: IValue): boolean;
}

/**
 * 字符串类型值
 */
declare class StringValue extends BaseValue {
    constructor();
    protected CheckValue(value: any): boolean;
}

/**
 * 数值类型值
 */
declare class NumberValue extends BaseValue {
    constructor();
    protected CheckValue(value: any): boolean;
}

/**
 * 数组型数值
 */
declare class ArrayValue extends BaseValue {
    constructor();
    protected CheckValue(value: any): boolean;
    /**
     * 添加到指定位置
     * @param index
     * @param value
     */
    AddAt(index: number, value: IValue): void;
    /**
     * 删除
     * @param value
     */
    Remove(value: IValue): void;
    /**
     * 通过索引删除并返回元素
     * @param index
     */
    RemoveAt(index: number): IValue;
    /**
     * 添加到末尾
     * @param value
     */
    Push(value: IValue): void;
    /**
     * 添加到头部
     * @param value
     */
    Unshift(value: IValue): void;
    /**
     * 删除并返回第一个元素
     */
    Shift(): IValue;
    /**
    * 删除并返回最后一个元素
    */
    Pop(): IValue;
    /**
     * 通过索引获取元素
     * @param index
     */
    GetAt(index: number): IValue;
    /**
     * 获取索引值
     * @param value
     */
    GetChildIndex(value: IValue): number;
    /**
     * 检测时候包含该内容
     * @param value
     */
    Contain(value: IValue): boolean;
    /**
     * 对比
     * @param value
     */
    Equality(value: IValue): boolean;
    private ChildValueChanged;
    /**
     * 清除
     */
    Clear(): void;
    /**
     * 列表长度
     */
    get length(): number;
    /**
     * 内容
     */
    get elements(): Array<IValue>;
    /**
     * 反序列化
     * @param type
     * @param data
     */
    Decode(type: number, data: any): void;
    /**
     * 序列化
     * @param type
     * @param data
     */
    Encode(type: number, data?: any): any;
}

/**
 * 对象类型数据
 */
declare class DictionaryValue extends BaseValue {
    constructor();
    /**
     * 添加属性
     * @param value
     */
    Add(value: IProperty): IValue;
    /**
     * 删除属性
     * @param value
     */
    Remove(value: IProperty): void;
    /**
     * 通过属性key删除并返回
     * @param key
     */
    RemoveByKey(key: string): IValue;
    /**
     * 查询是否存在
     * @param key
     * @returns
     */
    Has(key: string): boolean;
    /**
     * 更新属性
     * @param key
     * @param data
     */
    Update(key: string, data: any): void;
    /**
     * 更新多项属性
     * @param keys
     * @param values
     */
    MultUpdate(keys: Array<string>, values: Array<any>): void;
    /**
     * 获取属性
     * @param key
     */
    Get(key: string): IValue;
    /**
     * 对比
     * @param value
     */
    Equality(value: IValue): boolean;
    /**
     * 清除
     */
    Clear(): void;
    private ChildValueChanged;
    get elements(): Array<IValue>;
    private get map();
    /**
     * 反序列化
     * @param type
     * @param data
     */
    Decode(type: number, data: any): void;
    /**
     * 序列化
     * @param type
     * @param data
     * @returns
     */
    Encode(type: number, data?: any): any;
}

declare class StringProperty extends StringValue implements IProperty {
    key: string;
    constructor(key?: string, value?: any);
    protected SendEvent(newValue: any, oldValue: any): void;
}

declare class NumberProperty extends NumberValue implements IProperty {
    key: string;
    constructor(key?: string, value?: any);
    protected SendEvent(newValue: any, oldValue: any): void;
}

declare class DictionaryProperty extends DictionaryValue implements IProperty {
    key: string;
    constructor(key?: string, value?: any);
    protected SendEvent(newValue: any, oldValue: any): void;
}

declare class ArrayProperty extends ArrayValue implements IProperty {
    key: string;
    constructor(key?: string, value?: any);
    protected SendEvent(newValue: any, oldValue: any): void;
    /**
     * 判断某个子内容的某个属性相同则返回true
     */
    ContainProperty(value: IProperty): Boolean;
}

declare class BaseModel {
    /**
     * 是否是新玩家
     */
    isNewPlayer: boolean;
    /**
     * 是否开启调试日志
     */
    debugLog: boolean;
    gameName: string;
    userID: string;
    /**
     * 游戏存档
     */
    private __playerPrefs;
    constructor(gameName: string, userID: string);
    /**
     * 游戏存档
     */
    get playerPrefs(): DictionaryValue;
    /**
     * 清空游戏存档
     */
    ClearPlayerPrefs(): void;
    /**
     * 保存游戏存档
     */
    SavePlayerPrefs(now?: boolean): void;
    private __save;
    /**
     * 从本地读取存档
     */
    ReadByLoacl(): void;
    /**
     * 数据读取完成
     */
    protected OnReadComplete(): void;
    /**
     * 默认数据填充
     */
    protected SetDefaultPropertys(): void;
    get uuid(): string;
}

declare class DDLSConstraintShape {
    private static INC;
    private _id;
    private _segments;
    constructor();
    get id(): number;
    get segments(): Array<DDLSConstraintSegment>;
    Dispose(): void;
}

declare class DDLSConstraintSegment {
    private static INC;
    private _id;
    private _edges;
    private _fromShape;
    constructor();
    get id(): number;
    get fromShape(): DDLSConstraintShape;
    set fromShape(value: DDLSConstraintShape);
    AddEdge(edge: DDLSEdge): void;
    RemoveEdge(edge: DDLSEdge): void;
    get edges(): Array<DDLSEdge>;
    Dispose(): void;
    toString(): String;
}

declare class DDLSFace {
    private static INC;
    private _id;
    private _isReal;
    private _edge;
    colorDebug: number;
    constructor();
    get id(): number;
    get isReal(): boolean;
    SetDatas(edge: DDLSEdge, isReal?: boolean): void;
    Dispose(): void;
    get edge(): DDLSEdge;
}

declare class DDLSMatrix2D {
    private _a;
    private _b;
    private _c;
    private _d;
    private _e;
    private _f;
    constructor(a?: number, b?: number, c?: number, d?: number, e?: number, f?: number);
    Identity(): void;
    Translate(tx: number, ty: number): void;
    Scale(sx: number, sy: number): void;
    Rotate(rad: number): void;
    Clone(): DDLSMatrix2D;
    Tranform(point: DDLSPoint2D): void;
    TransformX(x: number, y: number): number;
    TransformY(x: number, y: number): number;
    Concat(matrix: DDLSMatrix2D): void;
    get a(): number;
    set a(value: number);
    get b(): number;
    set b(value: number);
    get c(): number;
    set c(value: number);
    get d(): number;
    set d(value: number);
    get e(): number;
    set e(value: number);
    get f(): number;
    set f(value: number);
}

declare class DDLSPoint2D {
    private _x;
    private _y;
    constructor(x?: number, y?: number);
    Transform(matrix: DDLSMatrix2D): void;
    Set(x: number, y: number): void;
    Clone(): DDLSPoint2D;
    Substract(p: DDLSPoint2D): void;
    get length(): number;
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    Normalize(): void;
    Scale(s: number): void;
    DistanceTo(p: DDLSPoint2D): number;
    DistanceSquaredTo(p: DDLSPoint2D): number;
}

declare class DDLSVertex {
    private static INC;
    private _id;
    private _pos;
    private _isReal;
    private _edge;
    private _fromConstraintSegments;
    colorDebug: number;
    constructor();
    get id(): number;
    get isReal(): Boolean;
    get pos(): DDLSPoint2D;
    get fromConstraintSegments(): Array<DDLSConstraintSegment>;
    set fromConstraintSegments(value: Array<DDLSConstraintSegment>);
    SetDatas(edge: DDLSEdge, isReal?: boolean): void;
    AddFromConstraintSegment(segment: DDLSConstraintSegment): void;
    RemoveFromConstraintSegment(segment: DDLSConstraintSegment): void;
    Dispose(): void;
    get edge(): DDLSEdge;
    set edge(value: DDLSEdge);
    toString(): String;
}

declare class DDLSEdge {
    private static INC;
    private _id;
    private _isReal;
    private _isConstrained;
    private _originVertex;
    private _oppositeEdge;
    private _nextLeftEdge;
    private _leftFace;
    private _fromConstraintSegments;
    colorDebug: number;
    constructor();
    get id(): number;
    get isReal(): boolean;
    get isConstrained(): boolean;
    SetDatas(originVertex: DDLSVertex, oppositeEdge: DDLSEdge, nextLeftEdge: DDLSEdge, leftFace: DDLSFace, isReal?: boolean, isConstrained?: boolean): void;
    AddFromConstraintSegment(segment: DDLSConstraintSegment): void;
    RemoveFromConstraintSegment(segment: DDLSConstraintSegment): void;
    set originVertex(value: DDLSVertex);
    set nextLeftEdge(value: DDLSEdge);
    set leftFace(value: DDLSFace);
    set isConstrained(value: boolean);
    get fromConstraintSegments(): Array<DDLSConstraintSegment>;
    set fromConstraintSegments(value: Array<DDLSConstraintSegment>);
    Dispose(): void;
    get originVertex(): DDLSVertex;
    get destinationVertex(): DDLSVertex;
    get oppositeEdge(): DDLSEdge;
    get nextLeftEdge(): DDLSEdge;
    get prevLeftEdge(): DDLSEdge;
    get nextRightEdge(): DDLSEdge;
    get prevRightEdge(): DDLSEdge;
    get rotLeftEdge(): DDLSEdge;
    get rotRightEdge(): DDLSEdge;
    get leftFace(): DDLSFace;
    get rightFace(): DDLSFace;
    toString(): String;
}

declare class DDLSObject {
    private static INC;
    private _id;
    private _matrix;
    private _coordinates;
    private _constraintShape;
    private _pivotX;
    private _pivotY;
    private _scaleX;
    private _scaleY;
    private _rotation;
    private _x;
    private _y;
    private _hasChanged;
    constructor();
    get id(): number;
    Dispose(): void;
    UpdateValuesFromMatrix(): void;
    UpdateMatrixFromValues(): void;
    get pivotX(): number;
    set pivotX(value: number);
    get pivotY(): number;
    set pivotY(value: number);
    get scaleX(): number;
    set scaleX(value: number);
    get scaleY(): number;
    set scaleY(value: number);
    get rotation(): number;
    set rotation(value: number);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get matrix(): DDLSMatrix2D;
    set matrix(value: DDLSMatrix2D);
    get coordinates(): Array<number>;
    set coordinates(value: Array<number>);
    get constraintShape(): DDLSConstraintShape;
    set constraintShape(value: DDLSConstraintShape);
    get hasChanged(): boolean;
    set hasChanged(value: boolean);
    get edges(): Array<DDLSEdge>;
}

declare class DDLSMesh {
    private static INC;
    private _id;
    private _width;
    private _height;
    private _clipping;
    private _vertices;
    private _edges;
    private _faces;
    private _constraintShapes;
    private _objects;
    private __centerVertex;
    private __edgesToCheck;
    constructor(width: number, height: number);
    get height(): number;
    get width(): number;
    get clipping(): boolean;
    set clipping(value: boolean);
    get id(): number;
    Dispose(): void;
    get __vertices(): Array<DDLSVertex>;
    get __edges(): Array<DDLSEdge>;
    get __faces(): Array<DDLSFace>;
    get __constraintShapes(): Array<DDLSConstraintShape>;
    BuildFromRecord(rec: string): void;
    InsertObject(object: DDLSObject): void;
    DeleteObject(object: DDLSObject): void;
    private __objectsUpdateInProgress;
    UpdateObjects(): void;
    InsertConstraintShape(coordinates: Array<number>): DDLSConstraintShape;
    DeleteConstraintShape(shape: DDLSConstraintShape): void;
    InsertConstraintSegment(x1: number, y1: number, x2: number, y2: number): DDLSConstraintSegment;
    private InsertNewConstrainedEdge;
    DeleteConstraintSegment(segment: DDLSConstraintSegment): void;
    private Check;
    InsertVertex(x: number, y: number): DDLSVertex;
    FlipEdge(edge: DDLSEdge): DDLSEdge;
    SplitEdge(edge: DDLSEdge, x: number, y: number): DDLSVertex;
    SplitFace(face: DDLSFace, x: number, y: number): DDLSVertex;
    RestoreAsDelaunay(): void;
    DeleteVertex(vertex: DDLSVertex): Boolean;
    private untriangulate;
    private Triangulate;
    Debug(): void;
}

declare class DDLSAStar {
    private _mesh;
    private __closedFaces;
    private __sortedOpenedFaces;
    private __openedFaces;
    private __entryEdges;
    private __entryX;
    private __entryY;
    private __scoreF;
    private __scoreG;
    private __scoreH;
    private __predecessor;
    private __iterEdge;
    private _radius;
    private _radiusSquared;
    private _diameter;
    private _diameterSquared;
    constructor();
    Dispose(): void;
    get radius(): number;
    set radius(value: number);
    set mesh(value: DDLSMesh);
    private __fromFace;
    private __toFace;
    private __curFace;
    FindPath(fromX: number, fromY: number, toX: number, toY: number, resultListFaces: Array<DDLSFace>, resultListEdges: Array<DDLSEdge>): void;
    private sortingFaces;
    private isWalkableByRadius;
}

declare class DDLSEntityAI {
    private static NUM_SEGMENTS;
    private _radius;
    private _radiusSquared;
    private _x;
    private _y;
    private _dirNormX;
    private _dirNormY;
    private _angleFOV;
    private _radiusFOV;
    private _radiusSquaredFOV;
    private _approximateObject;
    constructor();
    BuildApproximation(): void;
    get approximateObject(): DDLSObject;
    get radiusFOV(): number;
    set radiusFOV(value: number);
    get angleFOV(): number;
    set angleFOV(value: number);
    get dirNormY(): number;
    set dirNormY(value: number);
    get dirNormX(): number;
    set dirNormX(value: number);
    get y(): number;
    set y(value: number);
    get x(): number;
    set x(value: number);
    get radius(): number;
    get radiusSquared(): number;
    set radius(value: number);
}

declare class DDLSFieldOfView {
    private _fromEntity;
    private _mesh;
    _debug: Graphics;
    constructor();
    get fromEntity(): DDLSEntityAI;
    set fromEntity(value: DDLSEntityAI);
    set mesh(value: DDLSMesh);
    IsInField(targetEntity: DDLSEntityAI): Boolean;
}

declare class DDLSFunnel {
    private _radius;
    private _radiusSquared;
    private _numSamplesCircle;
    private _sampleCircle;
    private _sampleCircleDistanceSquared;
    debugSurface: Graphics;
    constructor();
    Dispose(): void;
    private _poolPointsSize;
    private _poolPoints;
    private _currPoolPointsIndex;
    private __point;
    GetPoint(x?: number, y?: number): DDLSPoint2D;
    GetCopyPoint(pointToCopy: DDLSPoint2D): DDLSPoint2D;
    get radius(): number;
    set radius(value: number);
    FindPath(fromX: number, fromY: number, toX: number, toY: number, listFaces: Array<DDLSFace>, listEdges: Array<DDLSEdge>, resultPath: Array<number>): void;
    private AdjustWithTangents;
    private CheckAdjustedPath;
    private SmoothAngle;
}

declare class DDLSPathFinder {
    private _mesh;
    private _astar;
    private _funnel;
    private _radius;
    private __listFaces;
    private __listEdges;
    constructor();
    Dispose(): void;
    get mesh(): DDLSMesh;
    set mesh(value: DDLSMesh);
    FindPath(startX: number, startY: number, toX: number, toY: number, resultPath: Array<number>, radius?: number): void;
}

declare class DDLSGraphNode {
    private static INC;
    private _id;
    private _prev;
    private _next;
    private _outgoingEdge;
    private _successorNodes;
    private _data;
    constructor();
    get id(): number;
    Dispose(): void;
    get prev(): DDLSGraphNode;
    set prev(value: DDLSGraphNode);
    get next(): DDLSGraphNode;
    set next(value: DDLSGraphNode);
    get outgoingEdge(): DDLSGraphEdge;
    set outgoingEdge(value: DDLSGraphEdge);
    get successorNodes(): Map<DDLSGraphNode, DDLSGraphEdge>;
    set successorNodes(value: Map<DDLSGraphNode, DDLSGraphEdge>);
    get data(): {
        index: number;
        point: DDLSPoint2D;
    };
    set data(value: {
        index: number;
        point: DDLSPoint2D;
    });
}

declare class DDLSGraphEdge {
    private static INC;
    private _id;
    private _prev;
    private _next;
    private _rotPrevEdge;
    private _rotNextEdge;
    private _oppositeEdge;
    private _sourceNode;
    private _destinationNode;
    private _data;
    constructor();
    get id(): number;
    Dispose(): void;
    get prev(): DDLSGraphEdge;
    set prev(value: DDLSGraphEdge);
    get next(): DDLSGraphEdge;
    set next(value: DDLSGraphEdge);
    get rotPrevEdge(): DDLSGraphEdge;
    set rotPrevEdge(value: DDLSGraphEdge);
    get rotNextEdge(): DDLSGraphEdge;
    set rotNextEdge(value: DDLSGraphEdge);
    get oppositeEdge(): DDLSGraphEdge;
    set oppositeEdge(value: DDLSGraphEdge);
    get sourceNode(): DDLSGraphNode;
    set sourceNode(value: DDLSGraphNode);
    get destinationNode(): DDLSGraphNode;
    set destinationNode(value: DDLSGraphNode);
    get data(): {
        sumDistancesSquared: number;
        length: number;
        nodesCount: number;
    };
    set data(value: {
        sumDistancesSquared: number;
        length: number;
        nodesCount: number;
    });
}

declare class DDLSGraph {
    private static INC;
    private _id;
    private _node;
    private _edge;
    constructor();
    get id(): number;
    Dispose(): void;
    get edge(): DDLSGraphEdge;
    get node(): DDLSGraphNode;
    InsertNode(): DDLSGraphNode;
    DeleteNode(node: DDLSGraphNode): void;
    InsertEdge(fromNode: DDLSGraphNode, toNode: DDLSGraphNode): DDLSGraphEdge;
    DeleteEdge(edge: DDLSGraphEdge): void;
}

declare class DDLSRectMeshFactory {
    static BuildRectangle(width: number, height: number): DDLSMesh;
}

/**
 * RGBA8888二进制纹理
 */
declare class RGBA8888Texture extends Texture2D {
    private bytes;
    constructor(width: number, height: number);
    /**
     * 填充颜色
     * @param x
     * @param y
     * @param width
     * @param height
     * @param color
     */
    FillRect(x: number, y: number, width: number, height: number, color: number): void;
    private __fillRect;
    /**
     * 通过颜色分量设置
     * @param r
     * @param g
     * @param b
     * @param a
     * @param x
     * @param y
     */
    SetPixel(r: number, g: number, b: number, a: number, x: number, y: number): void;
    /**
     * 通过单个颜色值设置
     * @param color
     * @param x
     * @param y
     */
    SetPixel32(color: number, x: number, y: number): void;
    GetPixel(x: number, y: number): number;
    /**
     * 将纹理绘制到纹理
     * @param texture
     * @param sx
     * @param sy
     * @param width
     * @param height
     * @param tx
     * @param ty
     * @param filter
     * @returns
     */
    Draw2Texture(texture: Texture2D, sx: number, sy: number, width: number, height: number, tx: number, ty: number, filter?: gfx.Filter): void;
    /**
     * 将二进制数据填充到纹理的指定区域
     * @param buffer
     * @param x
     * @param y
     * @param width
     * @param height
     * @returns
    */
    CopyBuffersToTexture(buffer: ArrayBufferView, x: number, y: number, width: number, height: number): void;
}

declare class DDLSBitmapObjectFactory {
    static buildFromBmpData(bmpData: RGBA8888Texture, scale?: number, debugBmp?: RGBA8888Texture, debugShape?: Graphics): DDLSObject;
}

declare class DDLSBitmapMeshFactory {
    static buildFromBmpData(bmpData: RGBA8888Texture, debugBmp?: RGBA8888Texture, debugShape?: Graphics): DDLSMesh;
}

/** A polygon describes a closed two-dimensional shape bounded by a number of straight
 *  line segments.
 *
 *  <p>The vertices of a polygon form a closed path (i.e. the last vertex will be connected
 *  to the first). It is recommended to provide the vertices in clockwise order.
 *  Self-intersecting paths are not supported and will give wrong results on triangulation,
 *  area calculation, etc.</p>
 */
declare class Polygon {
    _coords: Array<number>;
    private static sRestIndices;
    /** Creates a Polygon with the given coordinates.
     *  @param vertices an array that contains either 'Point' instances or
     *                  alternating 'x' and 'y' coordinates.
     */
    constructor(vertices?: Array<number>);
    /** Creates a clone of this polygon. */
    Clone(): Polygon;
    /** Reverses the order of the vertices. Note that some methods of the Polygon class
     *  require the vertices in clockwise order. */
    Reverse(): void;
    /** Adds vertices to the polygon. Pass either a list of 'Point' instances or alternating
     *  'x' and 'y' coordinates. */
    AddVertices(...args: any): void;
    /** Moves a given vertex to a certain position or adds a new vertex at the end. */
    SetVertex(index: number, x: number, y: number): void;
    /** Returns the coordinates of a certain vertex. */
    GetVertex(index: number, out?: Vec2): Vec2;
    /** Figures out if the given coordinates lie within the polygon. */
    Contains(x: number, y: number): Boolean;
    /** Figures out if the given point lies within the polygon. */
    ContainsPoint(point: Vec2): Boolean;
    /** Creates a string that contains the values of all included points. */
    toString(): string;
    /** Calculates if the area of the triangle a->b->c is to on the right-hand side of a->b. */
    private static IsConvexTriangle;
    /** Finds out if the vector a->b intersects c->d. */
    private static AreVectorsIntersecting;
    /** Indicates if the polygon's line segments are not self-intersecting.
     *  Beware: this is a brute-force implementation with <code>O(n^2)</code>. */
    get isSimple(): Boolean;
    /** Indicates if the polygon is convex. In a convex polygon, the vector between any two
     *  points inside the polygon lies inside it, as well. */
    get isConvex(): Boolean;
    /** Calculates the total area of the polygon. */
    get area(): number;
    /** Returns the total number of vertices spawning up the polygon. Assigning a value
     *  that's smaller than the current number of vertices will crop the path; a bigger
     *  value will fill up the path with zeros. */
    get numVertices(): number;
    set numVertices(value: number);
    /** Returns the number of triangles that will be required when triangulating the polygon. */
    get numTriangles(): number;
}

declare class DDLSSimpleView {
    colorEdges: number;
    colorConstraints: number;
    colorVertices: number;
    colorPaths: number;
    colorEntities: number;
    /**
     * 反转Y轴坐标
     */
    mirrorY: boolean;
    private _edges;
    private _edgesGraphics;
    private _constraints;
    private _constraintsGraphics;
    private _vertices;
    private _verticesGraphics;
    private _paths;
    private _pathsGraphics;
    private _entities;
    private _entitiesGraphics;
    private _surface;
    private _surfaceGraphics;
    private _showVerticesIndices;
    constructor();
    private __createNode;
    get surface(): Node;
    clean(): void;
    DrawMesh(mesh: DDLSMesh): void;
    private GetColor;
    DrawEntity(entity: DDLSEntityAI, cleanBefore?: boolean): void;
    DrawEntities(vEntities: Array<DDLSEntityAI>, cleanBefore?: boolean): void;
    DrawPath(path: Array<number>, cleanBefore?: boolean): void;
    private VertexIsInsideAABB;
}

interface IMatcher {
    readonly flags: number;
    readonly elements: Array<number>;
}

declare class Matcher extends BitFlag implements IMatcher {
    constructor(flags: Array<number>);
}

/**
 * 必须所有成立
 */
declare class MatcherAllOf extends Matcher {
}

/**
 * 任意一个成立
 */
declare class MatcherAnyOf extends Matcher {
}

/**
 * 不能包含
 */
declare class MatcherNoneOf extends Matcher {
}

declare class ESCGroup {
    /**
     * 全部包含或任意包含
     */
    matcher: MatcherAllOf | MatcherAnyOf;
    /**
     * 不能包含的
     */
    matcherNoneOf: MatcherNoneOf;
    /**
     * 编组所匹配的元素(内部接口)
     */
    _entitys: Dictionary<string, ESCEntity>;
    private __id;
    constructor(allOrAny: MatcherAllOf | MatcherAnyOf, none?: MatcherNoneOf);
    Destroy(): void;
    get id(): string;
}

declare class ESCSystem {
    /**
     * 所属世界
     */
    world: ESCWorld;
    key: string;
    /**
     * 内部接口
     */
    _group: ESCGroup;
    /**
     * 系统
     * @param allOrAny  所有或任意一个包含
     * @param none      不能包含
     */
    constructor(key: string, allOrAny?: MatcherAllOf | MatcherAnyOf, none?: MatcherNoneOf);
    Tick(time: number): void;
    Destory(): void;
}

declare class ESCWorld {
    /**组件 */
    private __components;
    /**实体*/
    private __entitys;
    /**系统*/
    private __systems;
    private __time;
    constructor();
    /**
     * 心跳驱动
     * @param time
     */
    Tick(time: number): void;
    /**
     * 创建一个实体
     */
    CreateEntity(id: string): ESCEntity;
    /**
     * 通过ID获取实体
     * @param id
     */
    GetEntity(id: string): ESCEntity;
    /**
     * 添加系统
     */
    AddSystem(value: ESCSystem): void;
    /**
     * 获取系统
     * @param key
     * @returns
     */
    GetSystem(key: string): ESCSystem | undefined;
    /**
     * 删除系统
     * @param value
     */
    RemoveSystem(value: ESCSystem): void;
    /**
     * 根据类型获取组件列表
     * @param type
     */
    GetComponent(type: number): ESCComponent[];
    /**
     * 销毁
     */
    Destory(): void;
    get time(): number;
    _matcherGroup(group: ESCGroup): void;
    /**
     * 内部接口，请勿调用
     * @param com
     */
    _addComponent(com: ESCComponent): void;
    /**
     * 内部接口，请勿调用
     * @param com
     */
    _removeComponent(com: ESCComponent): void;
    /**
     * 内部接口，请勿调用
     * @param value
     */
    _removeEntity(value: ESCEntity): void;
}

declare class ESCEntity {
    private __components;
    private __world;
    private __id;
    private __componentFlags;
    constructor(id: string, world: ESCWorld);
    /**
     * 添加组件
     * @param value
     */
    AddComponent(value: ESCComponent): ESCComponent;
    /**
     * 删除组件
     * @param id
     */
    RemoveComponent(value: ESCComponent): void;
    /**
     * 获取组件
     * @param type
     */
    GetComponent(type: number): ESCComponent;
    /**
     * 获取组件列表
     * @param type
     * @returns
     */
    GetComponents(type: number): Array<ESCComponent>;
    private __removeComponent;
    /**
     * 唯一ID
     */
    get id(): string;
    /**
     * 销毁
     */
    Dispose(): void;
    /**
     * 是否符合匹配规则
     * @param group
     */
    _matcherGroup(group: ESCGroup): boolean;
}

declare class ESCComponent {
    /**
     * 所属实体
     */
    entity: ESCEntity;
    /**
     * 类型
     */
    get type(): number;
    Dispose(): void;
}

declare class Drongo {
    /**UI资源AssetBundle */
    static UIBundle: string;
    /**UI遮罩颜色值 */
    static MaskColor: Color;
    /**初始化完成回调 */
    private static __callback;
    private static __progress;
    /**
     * 初始化
     * @param root          fgui根节点
     * @param callback      回调
     * @param progress      进度汇报
     * @param guiconfig     UI配置
     * @param layer         层级配置
     * @param sheetBundle   配置表AssetBundle包
     * @param assets        公共资源
     */
    static Init(root: Node, callback: (err?: Error) => void, progress?: (progress: number) => void, guiconfig?: ResURL, layer?: {
        layers: Array<string>;
        fullScrene: Array<string>;
    }, sheetBundle?: string, assets?: Array<ResURL>): void;
    private static __loadCommonAssets;
    private static __InitLayer;
    private static __initUI;
    /**
     * 总心跳驱动接口
     * @param dt
     */
    static Tick(dt: number): void;
}

export { ArrayProperty, ArrayValue, AsyncOperation, AudioManager, BaseConfigAccessor, BaseMediator, BaseModel, BaseService, BaseValue, BinderUtils, BindingUtils, BitFlag, BlendMode, ByteArray, ByteBuffer, ConfigManager, Controller, DDLSAStar, DDLSBitmapMeshFactory, DDLSBitmapObjectFactory, DDLSEdge, DDLSEntityAI, DDLSFace, DDLSFieldOfView, DDLSFunnel, DDLSGraph, DDLSGraphEdge, DDLSGraphNode, DDLSMesh, DDLSObject, DDLSPathFinder, DDLSRectMeshFactory, DDLSSimpleView, DDLSVertex, DEvent, Debuger, Dictionary, DictionaryProperty, DictionaryValue, DragDropManager, Drongo, ESCComponent, ESCEntity, ESCGroup, ESCSystem, ESCWorld, EaseType, EventDispatcher, FGUIEvent, FSM, FindPosition, Frame, FullURL, FunctionHook, GButton, GComboBox, GComponent, GGraph, GGroup, GImage, GLabel, GList, GLoader, GLoader3D, GMovieClip, GObject, GObjectPool, GProgressBar, GRichTextField, GRoot, GScrollBar, GSlider, GTextField, GTextInput, GTree, GTreeNode, GTween, GTweener, GUIManager, GUIMediator, GUIProxy, GUIState, GearAnimation, GearBase, GearColor, GearDisplay, GearDisplay2, GearFontSize, GearIcon, GearLook, GearSize, GearText, GearXY, Handler, IAudioChannel, IAudioGroup, IAudioManager, IConfigAccessor, IEventDispatcher, IGUIInfo, IGUIManager, IGUIMediator, ILayer, ILoader, ILoadingView, IMatcher, IProperty, IRecyclable, IRelationInfo, IRelationList, IResource, ISerialization, IService, IState, ITask, ITicker, IValue, IViewComponent, IViewCreator, Image, Injector, Key2URL, Layer, LayerManager, List, ListItemRenderer, LoadingView, MapConfigAccessor, Matcher, MatcherAllOf, MatcherAnyOf, MatcherNoneOf, MathUtils, MaxRectBinPack, ChangedData as ModelEvent, ModelFactory, MovieClip, NumberProperty, NumberValue, OneKeyConfigAccessor, PackageItem, Polygon, Pool, PopupMenu, PropertyBinder, Rect, RelationManager, RelationType, Res, ResManager, ResRef, ResURL, Resource, ScrollPane, SerializationMode, ServiceManager, StringProperty, StringUtils, StringValue, SubGUIMediator, TaskQueue, TaskSequence, TickerManager, Timer, Tr, Transition, TranslationHelper, UBBParser, UIConfig, UIObjectFactory, UIPackage, URL2Key, URLEqual, Window, registerFont };
