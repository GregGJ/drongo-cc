import { DDLSMatrix2D } from "./DDLSMatrix2D";

export class DDLSPoint2D {

	private _x: number;
	private _y: number;

	constructor(x: number = 0, y: number = 0) {
		this._x = x;
		this._y = y;
	}

	Transform(matrix: DDLSMatrix2D): void {
		matrix.Tranform(this);
	}

	Set(x: number, y: number): void {
		this._x = x;
		this._y = y;
	}

	Clone(): DDLSPoint2D {
		return new DDLSPoint2D(this._x, this._y);
	}

	Substract(p: DDLSPoint2D): void {
		this._x -= p.x;
		this._y -= p.y;
	}

	get length(): number {
		return Math.sqrt(this._x * this._x + this._y * this._y);
	}


	get x(): number {
		return this._x;
	}

	set x(value: number) {
		this._x = value;
	}

	get y(): number {
		return this._y;
	}

	set y(value: number) {
		this._y = value;
	}

	Normalize(): void {
		var norm: number = length;
		this.x = this.x / norm;
		this.y = this.y / norm;
	}

	Scale(s: number): void {
		this.x = this.x * s;
		this.y = this.y * s;
	}

	DistanceTo(p: DDLSPoint2D): number {
		var diffX: number = this.x - p.x;
		var diffY: number = this.y - p.y;
		return Math.sqrt(diffX * diffX + diffY * diffY);
	}

	DistanceSquaredTo(p: DDLSPoint2D): number {
		var diffX: number = this.x - p.x;
		var diffY: number = this.y - p.y;
		return diffX * diffX + diffY * diffY;
	}

}
