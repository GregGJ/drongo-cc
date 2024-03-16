import { DDLSConstraintSegment } from "./DDLSConstraintSegment";
import { DDLSEdge } from "./DDLSEdge";
import { DDLSPoint2D } from "./math/DDLSPoint2D";

export class DDLSVertex {

	private static INC: number = 0;
	private _id: number;

	private _pos: DDLSPoint2D;

	private _isReal: boolean;
	private _edge: DDLSEdge;

	private _fromConstraintSegments: Array<DDLSConstraintSegment>;

	public colorDebug: number = - 1;

	constructor() {
		this._id = DDLSVertex.INC;
		DDLSVertex.INC++;

		this._pos = new DDLSPoint2D();

		this._fromConstraintSegments = new Array<DDLSConstraintSegment>();
	}

	get id(): number {
		return this._id;
	}

	get isReal(): Boolean {
		return this._isReal;
	}

	get pos(): DDLSPoint2D {
		return this._pos;
	}

	get fromConstraintSegments(): Array<DDLSConstraintSegment> {
		return this._fromConstraintSegments;
	}

	set fromConstraintSegments(value: Array<DDLSConstraintSegment>) {
		this._fromConstraintSegments = value;
	}

	SetDatas(edge: DDLSEdge, isReal: boolean = true): void {
		this._isReal = isReal;
		this._edge = edge;
	}

	AddFromConstraintSegment(segment: DDLSConstraintSegment): void {
		if (this._fromConstraintSegments.indexOf(segment) == -1)
			this._fromConstraintSegments.push(segment);
	}

	RemoveFromConstraintSegment(segment: DDLSConstraintSegment): void {
		var index: number = this._fromConstraintSegments.indexOf(segment);
		if (index != -1)
			this._fromConstraintSegments.splice(index, 1);
	}

	Dispose(): void {
		this._pos = null;
		this._edge = null;
		this._fromConstraintSegments = null;
	}

	get edge(): DDLSEdge {
		return this._edge;
	}

	set edge(value: DDLSEdge) {
		this._edge = value;
	}

	toString(): String {
		return "ver_id " + this._id;
	}
}