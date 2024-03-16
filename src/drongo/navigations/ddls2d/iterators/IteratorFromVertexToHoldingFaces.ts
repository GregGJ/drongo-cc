import { DDLSEdge } from "../data/DDLSEdge";
import { DDLSFace } from "../data/DDLSFace";
import { DDLSVertex } from "../data/DDLSVertex";


export class IteratorFromVertexToHoldingFaces {

	private _fromVertex: DDLSVertex;
	private _nextEdge: DDLSEdge;

	constructor() {

	}

	set fromVertex(value: DDLSVertex) {
		this._fromVertex = value;
		this._nextEdge = this._fromVertex.edge;
	}


	private _resultFace: DDLSFace;
	
	Next(): DDLSFace {
		if (this._nextEdge) {
			do {
				this._resultFace = this._nextEdge.leftFace;
				this._nextEdge = this._nextEdge.rotLeftEdge;
				if (this._nextEdge == this._fromVertex.edge) {
					this._nextEdge = null;
					if (!this._resultFace.isReal)
						this._resultFace = null;
					break;
				}
			}
			while (!this._resultFace.isReal)
		}
		else {
			this._resultFace = null;
		}

		return this._resultFace;
	}

}
