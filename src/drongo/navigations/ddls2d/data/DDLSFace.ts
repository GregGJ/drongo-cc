import { DDLSEdge } from "./DDLSEdge";

export class DDLSFace {

	private static INC: number = 0;
	private _id: number;

	private _isReal: boolean;
	private _edge: DDLSEdge;

	public colorDebug: number = -1;

	constructor() {
		this._id = DDLSFace.INC;
		DDLSFace.INC++;
	}

	get id(): number {
		return this._id;
	}

	get isReal(): boolean {
		return this._isReal;
	}

	SetDatas(edge: DDLSEdge, isReal: boolean = true): void {
		this._isReal = isReal;
		this._edge = edge;
	}

	Dispose(): void {
		this._edge = null;
	}

	get edge(): DDLSEdge {
		return this._edge;
	}

}
