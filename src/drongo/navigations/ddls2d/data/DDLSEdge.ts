import { DDLSConstraintSegment } from "./DDLSConstraintSegment";
import { DDLSFace } from "./DDLSFace";
import { DDLSVertex } from "./DDLSVertex";

export class DDLSEdge {

	private static INC: number = 0;
	private _id: number;

	// root datas
	private _isReal: boolean;
	private _isConstrained: boolean;
	private _originVertex: DDLSVertex;
	private _oppositeEdge: DDLSEdge;
	private _nextLeftEdge: DDLSEdge;
	private _leftFace: DDLSFace;

	private _fromConstraintSegments: Array<DDLSConstraintSegment>;

	public colorDebug: number = -1;

	constructor() {
		this._id = DDLSEdge.INC;
		DDLSEdge.INC++;

		this._fromConstraintSegments = new Array<DDLSConstraintSegment>();
	}

	get id(): number {
		return this._id;
	}

	get isReal(): boolean {
		return this._isReal;
	}

	get isConstrained(): boolean {
		return this._isConstrained;
	}

	SetDatas(originVertex: DDLSVertex
		, oppositeEdge: DDLSEdge
		, nextLeftEdge: DDLSEdge
		, leftFace: DDLSFace
		, isReal: boolean = true
		, isConstrained: boolean = false): void {
		this._isConstrained = isConstrained;
		this._isReal = isReal;
		this._originVertex = originVertex;
		this._oppositeEdge = oppositeEdge;
		this._nextLeftEdge = nextLeftEdge;
		this._leftFace = leftFace;
	}

	AddFromConstraintSegment(segment: DDLSConstraintSegment): void {
		if (this._fromConstraintSegments.indexOf(segment) == -1)
			this._fromConstraintSegments.push(segment);
	}

	RemoveFromConstraintSegment(segment: DDLSConstraintSegment): void {
		let index: number = this._fromConstraintSegments.indexOf(segment);
		if (index != -1)
			this._fromConstraintSegments.splice(index, 1);
	}

	set originVertex(value: DDLSVertex) {
		this._originVertex = value;
	}

	set nextLeftEdge(value: DDLSEdge) {
		this._nextLeftEdge = value;
	}

	set leftFace(value: DDLSFace) {
		this._leftFace = value;
	}

	set isConstrained(value: boolean) {
		this._isConstrained = value;
	}

	get fromConstraintSegments(): Array<DDLSConstraintSegment> {
		return this._fromConstraintSegments;
	}

	set fromConstraintSegments(value: Array<DDLSConstraintSegment>) {
		this._fromConstraintSegments = value;
	}

	Dispose(): void {
		this._originVertex = null;
		this._oppositeEdge = null;
		this._nextLeftEdge = null;
		this._leftFace = null;
		this._fromConstraintSegments = null;
	}

	get originVertex(): DDLSVertex { return this._originVertex; }
	get destinationVertex(): DDLSVertex { return this._oppositeEdge.originVertex; }
	get oppositeEdge(): DDLSEdge { return this._oppositeEdge; }
	get nextLeftEdge(): DDLSEdge { return this._nextLeftEdge; }
	get prevLeftEdge(): DDLSEdge { return this._nextLeftEdge.nextLeftEdge; }
	get nextRightEdge(): DDLSEdge { return this._oppositeEdge.nextLeftEdge.nextLeftEdge.oppositeEdge; }
	get prevRightEdge(): DDLSEdge { return this._oppositeEdge.nextLeftEdge.oppositeEdge; }
	get rotLeftEdge(): DDLSEdge { return this._nextLeftEdge.nextLeftEdge.oppositeEdge; }
	get rotRightEdge(): DDLSEdge { return this._oppositeEdge.nextLeftEdge; }
	get leftFace(): DDLSFace { return this._leftFace; }
	get rightFace(): DDLSFace { return this._oppositeEdge.leftFace; }


	toString(): String {
		return "edge " + this.originVertex.id + " - " + this.destinationVertex.id;
	}
}

