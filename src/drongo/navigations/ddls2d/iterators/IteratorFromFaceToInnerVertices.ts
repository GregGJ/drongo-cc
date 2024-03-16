import { DDLSEdge } from "../data/DDLSEdge";
import { DDLSFace } from "../data/DDLSFace";
import { DDLSVertex } from "../data/DDLSVertex";


export class IteratorFromFaceToInnerVertices {

	private _fromFace: DDLSFace;
	private _nextEdge: DDLSEdge;

	constructor() {

	}

	set fromFace(value: DDLSFace) {
		this._fromFace = value;
		this._nextEdge = this._fromFace.edge;
	}

	private _resultVertex: DDLSVertex;

	Next(): DDLSVertex {
		if (this._nextEdge) {
			this._resultVertex = this._nextEdge.originVertex;
			this._nextEdge = this._nextEdge.nextLeftEdge;

			if (this._nextEdge == this._fromFace.edge)
				this._nextEdge = null;
		}
		else {
			this._resultVertex = null;
		}

		return this._resultVertex;
	}

}