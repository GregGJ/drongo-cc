import { DDLSEdge } from "../data/DDLSEdge";
import { DDLSFace } from "../data/DDLSFace";


export class IteratorFromFaceToInnerEdges {

	private _fromFace: DDLSFace;
	private _nextEdge: DDLSEdge;

	constructor() {

	}

	set fromFace(value: DDLSFace) {
		this._fromFace = value;
		this._nextEdge = this._fromFace.edge;
	}

	private _resultEdge: DDLSEdge;

	Next(): DDLSEdge {
		if (this._nextEdge) {
			this._resultEdge = this._nextEdge;
			this._nextEdge = this._nextEdge.nextLeftEdge;

			if (this._nextEdge == this._fromFace.edge)
				this._nextEdge = null;
		}
		else {
			this._resultEdge = null;
		}

		return this._resultEdge;
	}


}