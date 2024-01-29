import { FindPosition } from "./FindPosition";
import { Rect } from "./Rect";

// 强制引用传递套个壳子
interface IScoreCounter {
    value: number;
}

export class MaxRectBinPack {

    private containerHeight: number;
    private containerWidth: number;
    private allowRotate: boolean;
    private freeRects: Rect[] = [];
    private usedRects: Rect[] = [];

    /**
     * 构建方程
     * @param width {number} 画板宽度
     * @param height {number} 画板高度
     * @param allowRotate {boolean} 允许旋转
     */
    constructor(width: number, height: number, allowRotate?: boolean) {
        this.containerHeight = height;
        this.containerWidth = width;
        this.allowRotate = allowRotate === true;

        const rect = new Rect();
        rect.x = 0;
        rect.y = 0;
        rect.width = width;
        rect.height = height;

        this.freeRects.push(rect);
    }

    /**
     * 在线算法入口 插入矩形方法
     * @param width {number}
     * @param height {number}
     * @param method {FindPosition}
     */
    public Insert(width: number, height: number, method: FindPosition): Rect {
        // width height 参数合法性检查
        if (width <= 0 || height <= 0) {
            throw new Error(
                `width & height should greater than 0, but got width as ${width}, height as ${height}`,
            );
        }
        // method 合法性检查
        if (method <= FindPosition.ShortSideFit || method >= FindPosition.AreaFit) {
            method = FindPosition.ShortSideFit;
        }

        let newRect = new Rect();

        const score1: IScoreCounter = {
            value: 0,
        };

        const score2: IScoreCounter = {
            value: 0,
        };

        switch (method) {
            case FindPosition.ShortSideFit:
                newRect = this.FindPositionForNewNodeBestShortSideFit(
                    width,
                    height,
                    score1,
                    score2,
                );
                break;
            case FindPosition.BottomLeft:
                newRect = this.FindPositionForNewNodeBottomLeft(
                    width,
                    height,
                    score1,
                    score2,
                );
                break;
            case FindPosition.ContactPoint:
                newRect = this.FindPositionForNewNodeContactPoint(
                    width,
                    height,
                    score1,
                );
                break;
            case FindPosition.LongSideFit:
                newRect = this.FindPositionForNewNodeBestLongSideFit(
                    width,
                    height,
                    score2,
                    score1,
                );
                break;
            case FindPosition.AreaFit:
                newRect = this.FindPositionForNewNodeBestAreaFit(
                    width,
                    height,
                    score1,
                    score2,
                );
                break;
        }

        if (newRect.height === 0) {
            return newRect;
        }
        if (this.allowRotate) { // 更新旋转属性
            if (newRect.height === height && newRect.width === width) {
                newRect.isRotated = false;
            } else {
                newRect.isRotated = true;
            }
        }
        this.PlaceRectangle(newRect);
        return newRect;
    }

    // /**
    //  * 算法离线入口 插入一组举行
    //  * @param rects {Rect[]} 矩形数组
    //  * @param method {FindPosition} 查找位置的方法
    //  */
    // public insertRects(rects: Rect[], method: FindPosition): Rect[] {
    //     // rects 参数合法性检查
    //     if (rects && rects.length === 0) {
    //         throw new Error('rects should be array with length greater than zero');
    //     }
    //     // method 合法性检查
    //     if (method <= FindPosition.ShortSideFit || method >= FindPosition.AreaFit) {
    //         method = FindPosition.ShortSideFit;
    //     }

    //     const result: Rect[] = [];
    //     while (rects.length > 0) {
    //         const bestScore1: IScoreCounter = {
    //             value: Infinity,
    //         };
    //         const bestScore2: IScoreCounter = {
    //             value: Infinity,
    //         };
    //         let bestRectIndex = -1;
    //         let bestNode: Rect;

    //         for (let i = 0; i < rects.length; ++i) {
    //             const score1: IScoreCounter = {
    //                 value: 0,
    //             };
    //             const score2: IScoreCounter = {
    //                 value: 0,
    //             };
    //             const newNode: Rect = this.scoreRectangle(
    //                 rects[i].width,
    //                 rects[i].height,
    //                 method,
    //                 score1,
    //                 score2,
    //             );

    //             if (
    //                 score1.value < bestScore1.value ||
    //                 (score1.value === bestScore1.value && score2.value < bestScore2.value)
    //             ) {
    //                 bestScore1.value = score1.value;
    //                 bestScore2.value = score2.value;
    //                 bestNode = newNode;
    //                 bestRectIndex = i;
    //             }
    //         }

    //         if (bestRectIndex === -1) {
    //             return result;
    //         }
    //         this.placeRectangle(bestNode);

    //         bestNode.info = rects[bestRectIndex].info;
    //         if (this.allowRotate) {
    //             if (
    //                 bestNode.height === rects[bestRectIndex].height &&
    //                 bestNode.width === rects[bestRectIndex].width
    //             ) {
    //                 bestNode.isRotated = false;
    //             } else {
    //                 bestNode.isRotated = true;
    //             }
    //         }

    //         rects.splice(bestRectIndex, 1);

    //         result.push(bestNode);
    //     }
    //     return result;
    // }

    /**
     * 占有率
     * @returns 
     */
    public get occupancy(): number {
        let usedSurfaceArea = 0;
        for (const rect of this.usedRects) {
            usedSurfaceArea += rect.width * rect.height;
        }
        return usedSurfaceArea / (this.containerWidth * this.containerHeight);
    }

    /**
     * 擦除节点
     * @param rect 
     */
    public EraseNoce(rect: Rect) {
        let index: number = this.usedRects.indexOf(rect);
        if (index != -1) {
            this.usedRects.splice(index, 1);
        }
        index = this.freeRects.indexOf(rect);
        if (index == -1) {
            this.freeRects.push(rect);
            this.PruneFreeList();
        }
    }

    /**
     *
     * @param node
     */
    private PlaceRectangle(node: Rect) {
        let numRectanglesToProcess = this.freeRects.length;
        for (let i = 0; i < numRectanglesToProcess; i++) {
            if (this.SplitFreeNode(this.freeRects[i], node)) {
                this.freeRects.splice(i, 1);
                i--;
                numRectanglesToProcess--;
            }
        }

        this.PruneFreeList();
        this.usedRects.push(node);
    }

    private ScoreRectangle(
        width: number,
        height: number,
        method: FindPosition,
        score1: IScoreCounter,
        score2: IScoreCounter,
    ): Rect {
        let newNode = new Rect();
        score1.value = Infinity;
        score2.value = Infinity;
        switch (method) {
            case FindPosition.ShortSideFit:
                newNode = this.FindPositionForNewNodeBestShortSideFit(
                    width,
                    height,
                    score1,
                    score2,
                );
                break;
            case FindPosition.BottomLeft:
                newNode = this.FindPositionForNewNodeBottomLeft(
                    width,
                    height,
                    score1,
                    score2,
                );
                break;
            case FindPosition.ContactPoint:
                newNode = this.FindPositionForNewNodeContactPoint(
                    width,
                    height,
                    score1,
                );
                // todo: reverse
                score1.value = -score1.value; // Reverse since we are minimizing, but for contact point score bigger is better.
                break;
            case FindPosition.LongSideFit:
                newNode = this.FindPositionForNewNodeBestLongSideFit(
                    width,
                    height,
                    score2,
                    score1,
                );
                break;
            case FindPosition.AreaFit:
                newNode = this.FindPositionForNewNodeBestAreaFit(
                    width,
                    height,
                    score1,
                    score2,
                );
                break;
        }

        // Cannot fit the current Rectangle.
        if (newNode.height === 0) {
            score1.value = Infinity;
            score2.value = Infinity;
        }

        return newNode;
    }
    private FindPositionForNewNodeBottomLeft(
        width: number,
        height: number,
        bestY: IScoreCounter,
        bestX: IScoreCounter,
    ): Rect {
        const freeRects = this.freeRects;
        const bestNode = new Rect();

        bestY.value = Infinity;
        let topSideY;
        for (const rect of this.freeRects) {
            // Try to place the Rectangle in upright (non-flipped) orientation.
            if (rect.width >= width && rect.height >= height) {
                topSideY = rect.y + height;
                if (
                    topSideY < bestY.value ||
                    (topSideY === bestY.value && rect.x < bestX.value)
                ) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = width;
                    bestNode.height = height;
                    bestY.value = topSideY;
                    bestX.value = rect.x;
                }
            }
            if (this.allowRotate && rect.width >= height && rect.height >= width) {
                topSideY = rect.y + width;
                if (
                    topSideY < bestY.value ||
                    (topSideY === bestY.value && rect.x < bestX.value)
                ) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = height;
                    bestNode.height = width;
                    bestY.value = topSideY;
                    bestX.value = rect.x;
                }
            }
        }
        return bestNode;
    }
    private FindPositionForNewNodeBestShortSideFit(
        width: number,
        height: number,
        bestShortSideFit: IScoreCounter,
        bestLongSideFit: IScoreCounter,
    ): Rect {
        const bestNode = new Rect();
        bestShortSideFit.value = Infinity;

        let leftoverHoriz;
        let leftoverVert;
        let shortSideFit;
        let longSideFit;

        for (const rect of this.freeRects) {
            // Try to place the Rectangle in upright (non-flipped) orientation.
            if (rect.width >= width && rect.height >= height) {
                leftoverHoriz = Math.abs(rect.width - width);
                leftoverVert = Math.abs(rect.height - height);
                shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                longSideFit = Math.max(leftoverHoriz, leftoverVert);

                if (
                    shortSideFit < bestShortSideFit.value ||
                    (shortSideFit === bestShortSideFit.value &&
                        longSideFit < bestLongSideFit.value)
                ) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = width;
                    bestNode.height = height;
                    bestShortSideFit.value = shortSideFit;
                    bestLongSideFit.value = longSideFit;
                }
            }
            let flippedLeftoverHoriz;
            let flippedLeftoverVert;
            let flippedShortSideFit;
            let flippedLongSideFit;
            if (this.allowRotate && rect.width >= height && rect.height >= width) {
                flippedLeftoverHoriz = Math.abs(rect.width - height);
                flippedLeftoverVert = Math.abs(rect.height - width);
                flippedShortSideFit = Math.min(
                    flippedLeftoverHoriz,
                    flippedLeftoverVert,
                );
                flippedLongSideFit = Math.max(
                    flippedLeftoverHoriz,
                    flippedLeftoverVert,
                );

                if (
                    flippedShortSideFit < bestShortSideFit.value ||
                    (flippedShortSideFit === bestShortSideFit.value &&
                        flippedLongSideFit < bestLongSideFit.value)
                ) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = height;
                    bestNode.height = width;
                    bestShortSideFit.value = flippedShortSideFit;
                    bestLongSideFit.value = flippedLongSideFit;
                }
            }
        }

        return bestNode;
    }
    private FindPositionForNewNodeBestLongSideFit(
        width: number,
        height: number,
        bestShortSideFit: IScoreCounter,
        bestLongSideFit: IScoreCounter,
    ): Rect {
        const bestNode = new Rect();
        bestLongSideFit.value = Infinity;

        let leftoverHoriz;
        let leftoverVert;
        let shortSideFit;
        let longSideFit;
        for (const rect of this.freeRects) {
            // Try to place the Rectangle in upright (non-flipped) orientation.
            if (rect.width >= width && rect.height >= height) {
                leftoverHoriz = Math.abs(rect.width - width);
                leftoverVert = Math.abs(rect.height - height);
                shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                longSideFit = Math.max(leftoverHoriz, leftoverVert);

                if (
                    longSideFit < bestLongSideFit.value ||
                    (longSideFit === bestLongSideFit.value &&
                        shortSideFit < bestShortSideFit.value)
                ) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = width;
                    bestNode.height = height;
                    bestShortSideFit.value = shortSideFit;
                    bestLongSideFit.value = longSideFit;
                }
            }

            if (this.allowRotate && rect.width >= height && rect.height >= width) {
                leftoverHoriz = Math.abs(rect.width - height);
                leftoverVert = Math.abs(rect.height - width);
                shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                longSideFit = Math.max(leftoverHoriz, leftoverVert);

                if (
                    longSideFit < bestLongSideFit.value ||
                    (longSideFit === bestLongSideFit.value &&
                        shortSideFit < bestShortSideFit.value)
                ) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = height;
                    bestNode.height = width;
                    bestShortSideFit.value = shortSideFit;
                    bestLongSideFit.value = longSideFit;
                }
            }
        }
        return bestNode;
    }
    private FindPositionForNewNodeBestAreaFit(
        width: number,
        height: number,
        bestAreaFit: IScoreCounter,
        bestShortSideFit: IScoreCounter,
    ): Rect {
        const bestNode = new Rect();
        bestAreaFit.value = Infinity;

        let leftoverHoriz;
        let leftoverVert;
        let shortSideFit;
        let areaFit;

        for (const rect of this.freeRects) {
            areaFit = rect.width * rect.height - width * height;

            // Try to place the Rectangle in upright (non-flipped) orientation.
            if (rect.width >= width && rect.height >= height) {
                leftoverHoriz = Math.abs(rect.width - width);
                leftoverVert = Math.abs(rect.height - height);
                shortSideFit = Math.min(leftoverHoriz, leftoverVert);

                if (
                    areaFit < bestAreaFit.value ||
                    (areaFit === bestAreaFit.value &&
                        shortSideFit < bestShortSideFit.value)
                ) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = width;
                    bestNode.height = height;
                    bestShortSideFit.value = shortSideFit;
                    bestAreaFit.value = areaFit;
                }
            }

            if (this.allowRotate && rect.width >= height && rect.height >= width) {
                leftoverHoriz = Math.abs(rect.width - height);
                leftoverVert = Math.abs(rect.height - width);
                shortSideFit = Math.min(leftoverHoriz, leftoverVert);

                if (
                    areaFit < bestAreaFit.value ||
                    (areaFit === bestAreaFit.value &&
                        shortSideFit < bestShortSideFit.value)
                ) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = height;
                    bestNode.height = width;
                    bestShortSideFit.value = shortSideFit;
                    bestAreaFit.value = areaFit;
                }
            }
        }
        return bestNode;
    }
    private CommonIntervalLength(
        i1start: number,
        i1end: number,
        i2start: number,
        i2end: number,
    ): number {
        if (i1end < i2start || i2end < i1start) {
            return 0;
        }
        return Math.min(i1end, i2end) - Math.max(i1start, i2start);
    }
    private ContactPointScoreNode(
        x: number,
        y: number,
        width: number,
        height: number,
    ): number {
        let score = 0;
        if (x === 0 || x + width === this.containerWidth) {
            score += height;
        }
        if (y === 0 || y + height === this.containerHeight) {
            score += width;
        }
        for (const rect of this.usedRects) {
            if (rect.x === x + width || rect.x + rect.width === x) {
                score += this.CommonIntervalLength(
                    rect.y,
                    rect.y + rect.height,
                    y,
                    y + height,
                );
            }
            if (rect.y === y + height || rect.y + rect.height === y) {
                score += this.CommonIntervalLength(
                    rect.x,
                    rect.x + rect.width,
                    x,
                    x + width,
                );
            }
        }
        return score;
    }
    private FindPositionForNewNodeContactPoint(
        width: number,
        height: number,
        bestContactScore: IScoreCounter,
    ): Rect {
        const bestNode = new Rect();
        bestContactScore.value = -1;

        let score;
        for (const rect of this.freeRects) {
            // Try to place the Rectangle in upright (non-flipped) orientation.
            if (rect.width >= width && rect.height >= height) {
                score = this.ContactPointScoreNode(rect.x, rect.y, width, height);
                if (score > bestContactScore.value) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = width;
                    bestNode.height = height;
                    bestContactScore.value = score;
                }
            }
            if (this.allowRotate && rect.width >= height && rect.height >= width) {
                score = this.ContactPointScoreNode(rect.x, rect.y, height, width);
                if (score > bestContactScore.value) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = height;
                    bestNode.height = width;
                    bestContactScore.value = score;
                }
            }
        }
        return bestNode;
    }
    private SplitFreeNode(freeNode: Rect, usedNode: Rect): boolean {
        const freeRectangles = this.freeRects;
        // Test with SAT if the Rectangles even intersect.
        if (
            usedNode.x >= freeNode.x + freeNode.width ||
            usedNode.x + usedNode.width <= freeNode.x ||
            usedNode.y >= freeNode.y + freeNode.height ||
            usedNode.y + usedNode.height <= freeNode.y
        ) {
            return false;
        }
        let newNode;
        if (
            usedNode.x < freeNode.x + freeNode.width &&
            usedNode.x + usedNode.width > freeNode.x
        ) {
            // New node at the top side of the used node.
            if (
                usedNode.y > freeNode.y &&
                usedNode.y < freeNode.y + freeNode.height
            ) {
                newNode = freeNode.Clone();
                newNode.height = usedNode.y - newNode.y;
                freeRectangles.push(newNode);
            }

            // New node at the bottom side of the used node.
            if (usedNode.y + usedNode.height < freeNode.y + freeNode.height) {
                newNode = freeNode.Clone();
                newNode.y = usedNode.y + usedNode.height;
                newNode.height =
                    freeNode.y + freeNode.height - (usedNode.y + usedNode.height);
                freeRectangles.push(newNode);
            }
        }

        if (
            usedNode.y < freeNode.y + freeNode.height &&
            usedNode.y + usedNode.height > freeNode.y
        ) {
            // New node at the left side of the used node.
            if (usedNode.x > freeNode.x && usedNode.x < freeNode.x + freeNode.width) {
                newNode = freeNode.Clone();
                newNode.width = usedNode.x - newNode.x;
                freeRectangles.push(newNode);
            }

            // New node at the right side of the used node.
            if (usedNode.x + usedNode.width < freeNode.x + freeNode.width) {
                newNode = freeNode.Clone();
                newNode.x = usedNode.x + usedNode.width;
                newNode.width =
                    freeNode.x + freeNode.width - (usedNode.x + usedNode.width);
                freeRectangles.push(newNode);
            }
        }
        return true;
    }
    private PruneFreeList() {
        const freeRectangles = this.freeRects;
        for (let i = 0; i < freeRectangles.length; i++) {
            for (let j = i + 1; j < freeRectangles.length; j++) {
                if (freeRectangles[i].IsIn(freeRectangles[j])) {
                    freeRectangles.splice(i, 1);
                    break;
                }
                if (freeRectangles[j].IsIn(freeRectangles[i])) {
                    freeRectangles.splice(j, 1);
                }
            }
        }
    }
}