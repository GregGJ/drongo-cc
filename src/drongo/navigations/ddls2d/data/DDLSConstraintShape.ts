import { DDLSConstraintSegment } from "./DDLSConstraintSegment";

export class DDLSConstraintShape {

	private static INC: number = 0;
	private _id: number;

	private _segments: Array<DDLSConstraintSegment>;

	constructor() {
		this._id = DDLSConstraintShape.INC;
		DDLSConstraintShape.INC++;

		this._segments = new Array<DDLSConstraintSegment>();
	}

	get id(): number {
		return this._id;
	}

	get segments(): Array<DDLSConstraintSegment> {
		return this._segments;
	}

	Dispose(): void {
		while (this._segments.length > 0)
			this._segments.pop().Dispose();
		this._segments = null;
	}

}
