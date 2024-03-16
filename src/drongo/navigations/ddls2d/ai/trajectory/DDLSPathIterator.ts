import { DDLSEntityAI } from "../DDLSEntityAI";

export class DDLSPathIterator {

	private _entity: DDLSEntityAI;
	private _currentX: number;
	private _currentY: number;
	private _hasPrev: boolean;
	private _hasNext: boolean;

	private _path: Array<number>;
	private _count: number;
	private _countMax: number;

	constructor() {

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

	get hasPrev(): boolean {
		return this._hasPrev;
	}

	get hasNext(): boolean {
		return this._hasNext;
	}

	get count(): number {
		return this._count;
	}

	get countMax(): number {
		return this._countMax;
	}

	set path(value: Array<number>) {
		this._path = value;
		this._countMax = this._path.length / 2;
		this.Reset();
	}

	Reset(): void {
		this._count = 0;
		this._currentX = this._path[this._count];
		this._currentY = this._path[this._count + 1];
		this.UpdateEntity();

		this._hasPrev = false;
		if (this._path.length > 2)
			this._hasNext = true;
		else
			this._hasNext = false;
	}

	Prev(): boolean {
		if (!this._hasPrev)
			return false;
		this._hasNext = true;

		this._count--;
		this._currentX = this._path[this._count * 2];
		this._currentY = this._path[this._count * 2 + 1];

		this.UpdateEntity();

		if (this._count == 0)
			this._hasPrev = false;

		return true;
	}

	Next(): boolean {
		if (!this._hasNext)
			return false;
		this._hasPrev = true;

		this._count++;
		this._currentX = this._path[this._count * 2];
		this._currentY = this._path[this._count * 2 + 1];

		this.UpdateEntity();

		if ((this._count + 1) * 2 == this._path.length)
			this._hasNext = false;

		return true;
	}

	private UpdateEntity(): void {
		if (!this._entity)
			return;

		this._entity.x = this._currentX;
		this._entity.y = this._currentY;
	}

}
