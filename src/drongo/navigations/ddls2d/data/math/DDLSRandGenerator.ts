
export class DDLSRandGenerator {

	private _originalSeed: number;
	private _currSeed: number;
	private _rangeMin: number;
	private _rangeMax: number;

	private _numIter: number;
	private _tempString: string;

	constructor(seed: number = 1234, rangeMin: number = 0, rangeMax: number = 1) {
		this._originalSeed = this._currSeed = seed;
		this._rangeMin = rangeMin;
		this._rangeMax = rangeMax;

		this._numIter = 0;
	}

	set seed(value: number) { this._originalSeed = this._currSeed = value; }
	set rangeMin(value: number) { this._rangeMin = value; }
	set rangeMax(value: number) { this._rangeMax = value; }

	get seed(): number { return this._originalSeed; }
	get rangeMin(): number { return this._rangeMin; }
	get rangeMax(): number { return this._rangeMax; }

	Reset(): void {
		this._currSeed = this._originalSeed;
		this._numIter = 0;
	}

	Next(): number {
		this._tempString = (this._currSeed * this._currSeed).toString();

		while (this._tempString.length < 8) {
			this._tempString = "0" + this._tempString;
		}

		this._currSeed = Number(this._tempString.substring(1, 6));

		let res: number = Math.round(this._rangeMin + (this._currSeed / 99999) * (this._rangeMax - this._rangeMin));

		if (this._currSeed == 0)
			this._currSeed = this._originalSeed + this._numIter;

		this._numIter++;

		if (this._numIter == 200) {
			this.Reset();
		}
		return res;
	}

}