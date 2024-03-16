import { DDLSFace } from "../data/DDLSFace";
import { DDLSMesh } from "../data/DDLSMesh";


export class IteratorFromMeshToFaces {

	private _fromMesh: DDLSMesh;
	private _currIndex: number;

	constructor() {

	}

	set fromMesh(value: DDLSMesh) {
		this._fromMesh = value;
		this._currIndex = 0;
	}

	private _resultFace: DDLSFace;
	
	Next(): DDLSFace {
		do {
			if (this._currIndex < this._fromMesh.__faces.length) {
				this._resultFace = this._fromMesh.__faces[this._currIndex];
				this._currIndex++;
			}
			else {
				this._resultFace = null;
				break;
			}
		}
		while (!this._resultFace.isReal)

		return this._resultFace;
	}

}