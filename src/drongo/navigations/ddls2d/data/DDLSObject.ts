import { DDLSConstraintShape } from "./DDLSConstraintShape";
import { DDLSEdge } from "./DDLSEdge";
import { DDLSMatrix2D } from "./math/DDLSMatrix2D";

export class DDLSObject {

	private static INC: number = 0;
	private _id: number;

	private _matrix: DDLSMatrix2D;
	private _coordinates: Array<number>;
	private _constraintShape: DDLSConstraintShape;

	private _pivotX: number;
	private _pivotY: number;

	private _scaleX: number;
	private _scaleY: number;
	private _rotation: number;
	private _x: number;
	private _y: number;

	private _hasChanged: boolean;

	constructor() {
		this._id = DDLSObject.INC;
		DDLSObject.INC++;

		this._pivotX = 0;
		this._pivotY = 0;

		this._matrix = new DDLSMatrix2D();
		this._scaleX = 1;
		this._scaleY = 1;
		this._rotation = 0;
		this._x = 0;
		this._y = 0;

		this._coordinates = new Array<number>();

		this._hasChanged = false;
	}

	get id(): number {
		return this._id;
	}

	Dispose(): void {
		this._matrix = null;
		this._coordinates = null;
		this._constraintShape = null;
	}

	UpdateValuesFromMatrix(): void {

	}

	UpdateMatrixFromValues(): void {
		this._matrix.Identity();
		this._matrix.Translate(-this._pivotX, -this._pivotY);
		this._matrix.Scale(this._scaleX, this._scaleY);
		this._matrix.Rotate(this._rotation);
		this._matrix.Translate(this._x, this._y);
	}

	get pivotX(): number {
		return this._pivotX;
	}

	set pivotX(value: number) {
		this._pivotX = value;
		this._hasChanged = true;
	}

	get pivotY(): number {
		return this._pivotY;
	}

	set pivotY(value: number) {
		this._pivotY = value;
		this._hasChanged = true;
	}

	get scaleX(): number {
		return this._scaleX;
	}

	set scaleX(value: number) {
		if (this._scaleX != value) {
			this._scaleX = value;
			this._hasChanged = true;
		}
	}

	get scaleY(): number {
		return this._scaleY;
	}

	set scaleY(value: number) {
		if (this._scaleY != value) {
			this._scaleY = value;
			this._hasChanged = true;
		}
	}

	get rotation(): number {
		return this._rotation;
	}

	set rotation(value: number) {
		if (this._rotation != value) {
			this._rotation = value;
			this._hasChanged = true;
		}
	}

	get x(): number {
		return this._x;
	}

	set x(value: number) {
		if (this._x != value) {
			this._x = value;
			this._hasChanged = true;
		}
	}

	get y(): number {
		return this._y;
	}

	set y(value: number) {
		if (this._y != value) {
			this._y = value;
			this._hasChanged = true;
		}
	}

	get matrix(): DDLSMatrix2D {
		return this._matrix;
	}

	set matrix(value: DDLSMatrix2D) {
		this._matrix = value;
		this._hasChanged = true;
	}

	get coordinates(): Array<number> {
		return this._coordinates;
	}

	set coordinates(value: Array<number>) {
		this._coordinates = value;
		this._hasChanged = true;
	}

	get constraintShape(): DDLSConstraintShape {
		return this._constraintShape;
	}

	set constraintShape(value: DDLSConstraintShape) {
		this._constraintShape = value;
		this._hasChanged = true;
	}

	get hasChanged(): boolean {
		return this._hasChanged;
	}

	set hasChanged(value: boolean) {
		this._hasChanged = value;
	}

	get edges(): Array<DDLSEdge> {
		let res: Array<DDLSEdge> = new Array<DDLSEdge>();

		for (let i: number = 0; i < this._constraintShape.segments.length; i++) {
			for (let j: number = 0; j < this._constraintShape.segments[i].edges.length; j++)
				res.push(this._constraintShape.segments[i].edges[j]);
		}

		return res;
	}

}