import { DDLSEntityAI } from "../DDLSEntityAI";


export class DDLSLinearPathSampler {
	private _entity: DDLSEntityAI;
	private _currentX: number;
	private _currentY: number;
	private _hasPrev: Boolean;
	private _hasNext: Boolean;

	private _samplingDistance: number = 1;
	private _samplingDistanceSquared: number = 1;
	private _path: Array<number>;
	private _iPrev: number;
	private _iNext: number;

	private _preComputed: Boolean;
	private _count: number;
	private _preCompX: Array<number>;
	private _preCompY: Array<number>;

	constructor() {
		this._preCompX = new Array<number>();
		this._preCompY = new Array<number>();
	}

	Dispose(): void {
		this._entity = null;
		this._path = null;
		this._preCompX = null;
		this._preCompY = null;
	}

	get entity(): DDLSEntityAI {
		return this._entity;
	}

	set entity(value: DDLSEntityAI) {
		this._entity = value;
	}

	get x(): number {
		return this._currentX;
	}

	get y(): number {
		return this._currentY;
	}

	get hasPrev(): Boolean {
		return this._hasPrev;
	}

	get hasNext(): Boolean {
		return this._hasNext;
	}

	get count(): number {
		return this._count;
	}

	set count(value: number) {
		this._count = value;
		if (this._count < 0)
			this._count = 0;
		if (this._count > this.countMax - 1)
			this._count = this.countMax - 1;

		if (this._count == 0)
			this._hasPrev = false;
		else
			this._hasPrev = true;
		if (this._count == this.countMax - 1)
			this._hasNext = false;
		else
			this._hasNext = true;

		this._currentX = this._preCompX[this._count];
		this._currentY = this._preCompY[this._count];
		this.UpdateEntity();
	}

	get countMax(): number {
		return this._preCompX.length - 1;
	}

	get samplingDistance(): number {
		return this._samplingDistance;
	}

	set samplingDistance(value: number) {
		this._samplingDistance = value;
		this._samplingDistanceSquared = this._samplingDistance * this._samplingDistance;
	}

	set path(value: Array<number>) {
		this._path = value;
		this._preComputed = false;
		this.Reset();
	}

	Reset(): void {
		if (this._path.length > 0) {
			this._currentX = this._path[0];
			this._currentY = this._path[1];
			this._iPrev = 0;
			this._iNext = 2;
			this._hasPrev = false;
			this._hasNext = true;
			this._count = 0;
			this.UpdateEntity();
		}
		else {
			this._hasPrev = false;
			this._hasNext = false;
			this._count = 0;
		}
	}

	PreCompute(): void {
		this._preCompX.splice(0, this._preCompX.length);
		this._preCompY.splice(0, this._preCompY.length);
		this._count = 0;

		this._preCompX.push(this._currentX);
		this._preCompY.push(this._currentY);
		this._preComputed = false;
		while (this.Next()) {
			this._preCompX.push(this._currentX);
			this._preCompY.push(this._currentY);
		}
		this.Reset();
		this._preComputed = true;
	}

	Prev(): Boolean {
		if (!this._hasPrev)
			return false;
		this._hasNext = true;


		if (this._preComputed) {
			this._count--;
			if (this._count == 0)
				this._hasPrev = false;
			this._currentX = this._preCompX[this._count];
			this._currentY = this._preCompY[this._count];
			this.UpdateEntity();
			return true;
		}


		let remainingDist: number;
		let dist: number;

		remainingDist = this._samplingDistance;
		while (true) {
			dist = Math.sqrt((this._currentX - this._path[this._iPrev]) * (this._currentX - this._path[this._iPrev]) + (this._currentY - this._path[this._iPrev + 1]) * (this._currentY - this._path[this._iPrev + 1]));
			if (dist < remainingDist) {
				remainingDist -= dist;
				this._iPrev -= 2;
				this._iNext -= 2;

				if (this._iNext == 0)
					break;
			}
			else
				break;
		}

		if (this._iNext == 0) {
			this._currentX = this._path[0];
			this._currentY = this._path[1];
			this._hasPrev = false;
			this._iNext = 2;
			this._iPrev = 0;
			this.UpdateEntity();
			return true;
		}
		else {
			this._currentX = this._currentX + (this._path[this._iPrev] - this._currentX) * remainingDist / dist;
			this._currentY = this._currentY + (this._path[this._iPrev + 1] - this._currentY) * remainingDist / dist;
			this.UpdateEntity();
			return true;
		}
	}

	Next(): Boolean {
		if (!this._hasNext)
			return false;
		this._hasPrev = true;


		if (this._preComputed) {
			this._count++;
			if (this._count == this._preCompX.length - 1)
				this._hasNext = false;
			this._currentX = this._preCompX[this._count];
			this._currentY = this._preCompY[this._count];
			this.UpdateEntity();
			return true;
		}


		let remainingDist: number;
		let dist: number;

		remainingDist = this._samplingDistance;
		while (true) {
			dist = Math.sqrt((this._currentX - this._path[this._iNext]) * (this._currentX - this._path[this._iNext]) + (this._currentY - this._path[this._iNext + 1]) * (this._currentY - this._path[this._iNext + 1]));
			if (dist < remainingDist) {
				remainingDist -= dist;
				this._currentX = this._path[this._iNext];
				this._currentY = this._path[this._iNext + 1];
				this._iPrev += 2;
				this._iNext += 2;

				if (this._iNext == this._path.length)
					break;
			}
			else
				break;
		}

		if (this._iNext == this._path.length) {
			this._currentX = this._path[this._iPrev];
			this._currentY = this._path[this._iPrev + 1];
			this._hasNext = false;
			this._iNext = this._path.length - 2;
			this._iPrev = this._iNext - 2;
			this.UpdateEntity();
			return true;
		}
		else {
			this._currentX = this._currentX + (this._path[this._iNext] - this._currentX) * remainingDist / dist;
			this._currentY = this._currentY + (this._path[this._iNext + 1] - this._currentY) * remainingDist / dist;
			this.UpdateEntity();
			return true;
		}
	}

	private UpdateEntity(): void {
		if (!this._entity)
			return;

		this._entity.x = this._currentX;
		this._entity.y = this._currentY;
	}

}