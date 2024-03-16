import { DDLSPoint2D } from "./DDLSPoint2D";


export class DDLSMatrix2D {
	/*	
		DDLSPoint2D represents row vector in homogeneous coordinates:
		[x, y, 1]
		
		DDLSMatrix2D represents transform matrix in homogeneous coordinates:
		[a, b, 0]
		[c, d, 0]
		[e, f, 1]
	*/

	private _a: number;
	private _b: number;
	private _c: number;
	private _d: number;
	private _e: number;
	private _f: number;

	constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, e: number = 0, f: number = 0) {
		this._a = a;
		this._b = b;
		this._c = c;
		this._d = d;
		this._e = e;
		this._f = f;
	}

	Identity(): void {
		/*
		[1, 0, 0]
		[0, 1, 0]
		[0, 0, 1]
		*/

		this._a = 1;
		this._b = 0;
		this._c = 0;
		this._d = 1;
		this._e = 0;
		this._f = 0;
	}

	Translate(tx: number, ty: number): void {
		/*
		[1,  0,  0]
		[0,  1,  0]
		[tx, ty, 1]
		
		*/
		this._e = this._e + tx;
		this._f = this._f + ty;
	}

	Scale(sx: number, sy: number): void {
		/*
		[sx, 0, 0]
		[0, sy, 0]
		[0,  0, 1]
		*/
		this._a = this._a * sx;
		this._b = this._b * sy;
		this._c = this._c * sx;
		this._d = this._d * sy;
		this._e = this._e * sx;
		this._f = this._f * sy;
	}

	Rotate(rad: number): void {
		/*
					[ cos, sin, 0]
					[-sin, cos, 0]
					[   0,   0, 1]
		
		[a, b, 0]
		[c, d, 0]
		[e, f, 1]
		*/
		var cos: number = Math.cos(rad);
		var sin: number = Math.sin(rad);
		var a: number = this._a * cos + this._b * -sin;
		var b: number = this._a * sin + this._b * cos;
		var c: number = this._c * cos + this._d * -sin;
		var d: number = this._c * sin + this._d * cos;
		var e: number = this._e * cos + this._f * -sin;
		var f: number = this._e * sin + this._f * cos;
		this._a = a;
		this._b = b
		this._c = c;
		this._d = d;
		this._e = e;
		this._f = f;
	}

	Clone(): DDLSMatrix2D {
		return new DDLSMatrix2D(this._a, this._b, this._c, this._d, this._e, this._f);
	}

	Tranform(point: DDLSPoint2D): void {
		/*
					[a, b, 0]
					[c, d, 0]
					[e, f, 1]
		[x, y, 1]
		*/
		var x: number = this._a * point.x + this._c * point.y + this.e;
		var y: number = this._b * point.x + this._d * point.y + this.f;
		point.x = x;
		point.y = y;
	}

	TransformX(x: number, y: number): number {
		return this._a * x + this._c * y + this.e;
	}
	TransformY(x: number, y: number): number {
		return this._b * x + this._d * y + this.f;
	}

	Concat(matrix: DDLSMatrix2D): void {
		var a: number = this._a * matrix.a + this._b * matrix.c;
		var b: number = this._a * matrix.b + this._b * matrix.d;
		var c: number = this._c * matrix.a + this._d * matrix.c;
		var d: number = this._c * matrix.b + this._d * matrix.d;
		var e: number = this._e * matrix.a + this._f * matrix.c + matrix.e;
		var f: number = this._e * matrix.b + this._f * matrix.d + matrix.f;
		this._a = a
		this._b = b;
		this._c = c;
		this._d = d;
		this._e = e;
		this._f = f;
	}

	get a(): number {
		return this._a;
	}

	set a(value: number) {
		this._a = value;
	}

	get b(): number {
		return this._b;
	}

	set b(value: number) {
		this._b = value;
	}

	get c(): number {
		return this._c;
	}

	set c(value: number) {
		this._c = value;
	}

	get d(): number {
		return this._d;
	}

	set d(value: number) {
		this._d = value;
	}

	get e(): number {
		return this._e;
	}

	set e(value: number) {
		this._e = value;
	}

	get f(): number {
		return this._f;
	}

	set f(value: number) {
		this._f = value;
	}
}
