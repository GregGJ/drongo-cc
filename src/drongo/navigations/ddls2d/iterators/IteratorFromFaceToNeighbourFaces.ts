import { DDLSEdge } from "../data/DDLSEdge";
import { DDLSFace } from "../data/DDLSFace";


export class IteratorFromFaceToNeighbourFaces {

	private _fromFace: DDLSFace;
	private _nextEdge: DDLSEdge;

	constructor() {

	}

	set fromFace(value: DDLSFace) {
		this._fromFace = value;
		this._nextEdge = this._fromFace.edge;
	}

	private _resultFace: DDLSFace;

	Next(): DDLSFace {
		if (this._nextEdge) {
			do {
				this._resultFace = this._nextEdge.rightFace;
				this._nextEdge = this._nextEdge.nextLeftEdge;
				if (this._nextEdge == this._fromFace.edge) {
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