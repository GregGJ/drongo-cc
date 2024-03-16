import { DDLSEdge } from "../data/DDLSEdge";
import { DDLSVertex } from "../data/DDLSVertex";

export class IteratorFromVertexToOutgoingEdges {

	private _fromVertex: DDLSVertex;
	private _nextEdge: DDLSEdge;

	realEdgesOnly: boolean = true;

	constructor() {

	}

	set fromVertex(value: DDLSVertex) {
		this._fromVertex = value;
		this._nextEdge = this._fromVertex.edge;
		while (this.realEdgesOnly && !this._nextEdge.isReal) {
			this._nextEdge = this._nextEdge.rotLeftEdge;
		}
	}

	private _resultEdge: DDLSEdge;
	
	Next(): DDLSEdge {
		if (this._nextEdge) {
			this._resultEdge =this. _nextEdge;
			do {
				this._nextEdge = this._nextEdge.rotLeftEdge;
				if (this._nextEdge == this._fromVertex.edge) {
					this._nextEdge = null;
					break;
				}
			}
			while (this.realEdgesOnly && !this._nextEdge.isReal)
		}
		else {
			this._resultEdge = null;
		}

		return this._resultEdge;
	}

}