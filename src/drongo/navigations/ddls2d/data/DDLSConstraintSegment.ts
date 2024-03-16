import { DDLSConstraintShape } from "./DDLSConstraintShape";
import { DDLSEdge } from "./DDLSEdge";

export class DDLSConstraintSegment {

	private static INC: number = 0;
	private _id: number;

	private _edges: Array<DDLSEdge>;
	private _fromShape: DDLSConstraintShape;

	constructor() {
		this._id = DDLSConstraintSegment.INC;
		DDLSConstraintSegment.INC++;

		this._edges = new Array<DDLSEdge>();
	}

	get id(): number {
		return this._id;
	}

	get fromShape(): DDLSConstraintShape {
		return this._fromShape;
	}

	set fromShape(value: DDLSConstraintShape) {
		this._fromShape = value;
	}

	AddEdge(edge: DDLSEdge): void {
		if (this._edges.indexOf(edge) == -1 && this._edges.indexOf(edge.oppositeEdge) == -1)
			this._edges.push(edge);
	}

	RemoveEdge(edge: DDLSEdge): void {
		var index: number;
		index = this._edges.indexOf(edge);
		if (index == -1)
			index = this._edges.indexOf(edge.oppositeEdge);

		if (index != -1)
			this._edges.splice(index, 1);
	}

	get edges(): Array<DDLSEdge> {
		return this._edges;
	}

	Dispose(): void {
		this._edges = null;
		this._fromShape = null;
	}

	toString(): String {
		return "seg_id " + this._id;
	}

}