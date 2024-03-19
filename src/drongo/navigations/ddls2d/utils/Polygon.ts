import { Vec2 } from "cc";

/** A polygon describes a closed two-dimensional shape bounded by a number of straight
 *  line segments.
 *
 *  <p>The vertices of a polygon form a closed path (i.e. the last vertex will be connected
 *  to the first). It is recommended to provide the vertices in clockwise order.
 *  Self-intersecting paths are not supported and will give wrong results on triangulation,
 *  area calculation, etc.</p>
 */
export class Polygon {
    _coords: Array<number>;

    // Helper object
    private static sRestIndices: Array<number> = [];

    /** Creates a Polygon with the given coordinates.
     *  @param vertices an array that contains either 'Point' instances or
     *                  alternating 'x' and 'y' coordinates.
     */
    constructor(vertices?: Array<number>) {
        this._coords = [];
        this.AddVertices.apply(this, vertices);
    }

    /** Creates a clone of this polygon. */
    Clone(): Polygon {
        let clone: Polygon = new Polygon();
        let numCoords = this._coords.length;

        for (let i = 0; i < numCoords; ++i)
            clone._coords[i] = this._coords[i];

        return clone;
    }

    /** Reverses the order of the vertices. Note that some methods of the Polygon class
     *  require the vertices in clockwise order. */
    Reverse(): void {
        let numCoords = this._coords.length;
        let numVertices = Math.floor(numCoords / 2);
        let tmp: number;

        for (let i = 0; i < numVertices; i += 2) {
            tmp = this._coords[i];
            this._coords[i] = this._coords[numCoords - i - 2];
            this._coords[numCoords - i - 2] = tmp;

            tmp = this._coords[i + 1];
            this._coords[i + 1] = this._coords[numCoords - i - 1];
            this._coords[numCoords - i - 1] = tmp;
        }
    }

    /** Adds vertices to the polygon. Pass either a list of 'Point' instances or alternating
     *  'x' and 'y' coordinates. */
    AddVertices(...args: any): void {
        let i: number;
        let numArgs: number = args.length;
        let numCoords: number = this._coords.length;

        if (numArgs > 0) {
            if (args[0] instanceof Vec2) {
                for (i = 0; i < numArgs; i++) {
                    this._coords[numCoords + i * 2] = (args[i] as Vec2).x;
                    this._coords[numCoords + i * 2 + 1] = (args[i] as Vec2).y;
                }
            } else if (typeof args[0] == "number") {
                for (i = 0; i < numArgs; ++i)
                    this._coords[numCoords + i] = args[i];
            } else {
                throw new Error("Invalid type: " + args[0]);
            }
        }
    }

    /** Moves a given vertex to a certain position or adds a new vertex at the end. */
    SetVertex(index: number, x: number, y: number): void {
        if (index >= 0 && index <= this.numVertices) {
            this._coords[index * 2] = x;
            this._coords[index * 2 + 1] = y;
        } else {
            throw new RangeError("Invalid index: " + index);
        }
    }

    /** Returns the coordinates of a certain vertex. */
    GetVertex(index: number, out: Vec2 = null): Vec2 {
        if (index >= 0 && index < this.numVertices) {
            out ||= new Vec2();
            out.set(this._coords[index * 2], this._coords[index * 2 + 1])
            return out;
        }
        else {
            throw new RangeError("Invalid index: " + index);
        }
    }

    /** Figures out if the given coordinates lie within the polygon. */
    Contains(x: number, y: number): Boolean {
        // Algorithm & implementation thankfully taken from:
        // -> http://alienryderflex.com/polygon/

        let i: number, j: number = this.numVertices - 1;
        let oddNodes: number = 0;

        for (i = 0; i < this.numVertices; ++i) {
            let ix: number = this._coords[i * 2];
            let iy: number = this._coords[i * 2 + 1];
            let jx: number = this._coords[j * 2];
            let jy: number = this._coords[j * 2 + 1];

            if ((iy < y && jy >= y || jy < y && iy >= y) && (ix <= x || jx <= x)) {
                oddNodes ^= Number(ix + (y - iy) / (jy - iy) * (jx - ix) < x);
            }
            j = i;
        }

        return oddNodes != 0;
    }

    /** Figures out if the given point lies within the polygon. */
    ContainsPoint(point: Vec2): Boolean {
        return this.Contains(point.x, point.y);
    }

    /** Creates a string that contains the values of all included points. */
    toString(): string {
        let result: string = "[Polygon";
        let numPoints: number = this.numVertices;

        if (numPoints > 0) result += "\n";

        for (let i: number = 0; i < numPoints; ++i) {
            result += "  [Vertex " + i + ": " +
                "x=" + this._coords[i * 2].toFixed(1) + ", " +
                "y=" + this._coords[i * 2 + 1].toFixed(1) + "]" +
                (i == numPoints - 1 ? "\n" : ",\n");
        }

        return result + "]";
    }

    // helpers

    /** Calculates if the area of the triangle a->b->c is to on the right-hand side of a->b. */
    private static IsConvexTriangle(ax: number, ay: number,
        bx: number, by: number,
        cx: number, cy: number): Boolean {
        // dot product of [the normal of (a->b)] and (b->c) must be positive
        return (ay - by) * (cx - bx) + (bx - ax) * (cy - by) >= 0;
    }

    /** Finds out if the vector a->b intersects c->d. */
    private static AreVectorsIntersecting(ax: number, ay: number, bx: number, by: number,
        cx: number, cy: number, dx: number, dy: number): Boolean {
        if ((ax == bx && ay == by) || (cx == dx && cy == dy)) return false; // length = 0

        let abx: number = bx - ax;
        let aby: number = by - ay;
        let cdx: number = dx - cx;
        let cdy: number = dy - cy;
        let tDen: number = cdy * abx - cdx * aby;

        if (tDen == 0.0) return false; // parallel or identical

        let t: number = (aby * (cx - ax) - abx * (cy - ay)) / tDen;

        if (t < 0 || t > 1) return false; // outside c->d

        let s: number = aby ? (cy - ay + t * cdy) / aby :
            (cx - ax + t * cdx) / abx;

        return s >= 0.0 && s <= 1.0; // inside a->b
    }

    // properties

    /** Indicates if the polygon's line segments are not self-intersecting.
     *  Beware: this is a brute-force implementation with <code>O(n^2)</code>. */
    get isSimple(): Boolean {
        let numCoords: number = this._coords.length;
        if (numCoords <= 6) return true;

        for (let i: number = 0; i < numCoords; i += 2) {
            let ax: number = this._coords[i];
            let ay: number = this._coords[i + 1];
            let bx: number = this._coords[(i + 2) % numCoords];
            let by: number = this._coords[(i + 3) % numCoords];
            let endJ: number = i + numCoords - 2;

            for (let j: number = i + 4; j < endJ; j += 2) {
                let cx: number = this._coords[j % numCoords];
                let cy: number = this._coords[(j + 1) % numCoords];
                let dx: number = this._coords[(j + 2) % numCoords];
                let dy: number = this._coords[(j + 3) % numCoords];

                if (Polygon.AreVectorsIntersecting(ax, ay, bx, by, cx, cy, dx, dy))
                    return false;
            }
        }

        return true;
    }

    /** Indicates if the polygon is convex. In a convex polygon, the vector between any two
     *  points inside the polygon lies inside it, as well. */
    get isConvex(): Boolean {
        let numCoords: number = this._coords.length;

        if (numCoords < 6) return true;
        else {
            for (let i = 0; i < numCoords; i += 2) {
                if (!Polygon.IsConvexTriangle(this._coords[i], this._coords[i + 1],
                    this._coords[(i + 2) % numCoords], this._coords[(i + 3) % numCoords],
                    this._coords[(i + 4) % numCoords], this._coords[(i + 5) % numCoords])) {
                    return false;
                }
            }
        }

        return true;
    }

    /** Calculates the total area of the polygon. */
    get area(): number {
        let area: number = 0;
        let numCoords: number = this._coords.length;

        if (numCoords >= 6) {
            for (let i: number = 0; i < numCoords; i += 2) {
                area += this._coords[i] * this._coords[(i + 3) % numCoords];
                area -= this._coords[i + 1] * this._coords[(i + 2) % numCoords];
            }
        }

        return area / 2.0;
    }

    /** Returns the total number of vertices spawning up the polygon. Assigning a value
     *  that's smaller than the current number of vertices will crop the path; a bigger
     *  value will fill up the path with zeros. */
    get numVertices(): number {
        return this._coords.length / 2;
    }

    set numVertices(value: number) {
        let oldLength: number = this.numVertices;
        this._coords.length = value * 2;

        if (oldLength < value) {
            for (let i: number = oldLength; i < value; ++i)
                this._coords[i * 2] = this._coords[i * 2 + 1] = 0.0;
        }
    }

    /** Returns the number of triangles that will be required when triangulating the polygon. */
    get numTriangles(): number {
        let numVertices: number = this.numVertices;
        return numVertices >= 3 ? numVertices - 2 : 0;
    }
}