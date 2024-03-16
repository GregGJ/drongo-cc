import { DDLSEdge } from "../data/DDLSEdge";
import { DDLSVertex } from "../data/DDLSVertex";

export class IteratorFromVertexToNeighbourVertices {

	private _fromVertex: DDLSVertex;
	private _nextEdge: DDLSEdge;

	constructor() {

	}

	set fromVertex(value: DDLSVertex) {
		this._fromVertex = value;
		this._nextEdge = this._fromVertex.edge;
	}

	private _resultVertex: DDLSVertex;
	
	Next(): DDLSVertex {
		if (this._nextEdge) {
			this._resultVertex = this._nextEdge.oppositeEdge.originVertex;
			do {
				this._nextEdge = this._nextEdge.rotLeftEdge;
			}
			while (!this._nextEdge.isReal)

			if (this._nextEdge == this._fromVertex.edge)
				this._nextEdge = null;
		}
		else {
			this._resultVertex = null;
		}

		return this._resultVertex;
	}

}
