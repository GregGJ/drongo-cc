import { DDLSEdge } from "../data/DDLSEdge";
import { DDLSFace } from "../data/DDLSFace";
import { DDLSMesh } from "../data/DDLSMesh";
import { DDLSVertex } from "../data/DDLSVertex";
import { DDLSGeom2D } from "../data/math/DDLSGeom2D";
import { DDLSPoint2D } from "../data/math/DDLSPoint2D";
import { IteratorFromFaceToInnerEdges } from "../iterators/IteratorFromFaceToInnerEdges";


export class DDLSAStar {

	private _mesh: DDLSMesh;


	private __closedFaces: Map<DDLSFace, boolean>;
	private __sortedOpenedFaces: Array<DDLSFace>;
	private __openedFaces: Map<DDLSFace, boolean>;
	private __entryEdges: Map<DDLSFace, DDLSEdge>;
	private __entryX: Map<DDLSFace, number>;
	private __entryY: Map<DDLSFace, number>;
	private __scoreF: Map<DDLSFace, number>;
	private __scoreG: Map<DDLSFace, number>;
	private __scoreH: Map<DDLSFace, number>;
	private __predecessor: Map<DDLSFace, DDLSFace>;

	private __iterEdge: IteratorFromFaceToInnerEdges;

	private _radius: number;
	private _radiusSquared: number;
	private _diameter: number;
	private _diameterSquared: number;

	constructor() {
		this.__iterEdge = new IteratorFromFaceToInnerEdges();
	}

	Dispose(): void {
		this._mesh = null;

		this.__closedFaces = null;
		this.__sortedOpenedFaces = null;
		this.__openedFaces = null;
		this.__entryEdges = null;
		this.__entryX = null;
		this.__entryY = null;
		this.__scoreF = null;
		this.__scoreG = null;
		this.__scoreH = null;
		this.__predecessor = null;
	}

	get radius(): number {
		return this._radius;
	}

	set radius(value: number) {
		this._radius = value;
		this._radiusSquared = this._radius * this._radius;
		this._diameter = this._radius * 2;
		this._diameterSquared = this._diameter * this._diameter;
	}

	set mesh(value: DDLSMesh) {
		this._mesh = value;
	}

	private __fromFace: DDLSFace;
	private __toFace: DDLSFace;
	private __curFace: DDLSFace;

	FindPath(fromX: number, fromY: number, toX: number, toY: number
		, resultListFaces: Array<DDLSFace>
		, resultListEdges: Array<DDLSEdge>): void {
		//trace("findPath");
		this.__closedFaces = new Map<DDLSFace, boolean>();
		this.__sortedOpenedFaces = new Array<DDLSFace>();
		this.__openedFaces = new Map<DDLSFace, boolean>();
		this.__entryEdges = new Map<DDLSFace, DDLSEdge>();
		this.__entryX = new Map<DDLSFace, number>();
		this.__entryY = new Map<DDLSFace, number>();
		this.__scoreF = new Map<DDLSFace, number>();
		this.__scoreG = new Map<DDLSFace, number>();
		this.__scoreH = new Map<DDLSFace, number>();
		this.__predecessor = new Map<DDLSFace, DDLSFace>();

		var loc: any;
		var locEdge: DDLSEdge;
		var locVertex: DDLSVertex;
		var distance: number;
		var p1: DDLSPoint2D;
		var p2: DDLSPoint2D;
		var p3: DDLSPoint2D;
		//
		loc = DDLSGeom2D.LocatePosition(fromX, fromY, this._mesh);
		if ((locVertex = loc as DDLSVertex)) {
			// vertex are always in constraint, so we abort
			return;
		}
		else if ((locEdge = loc as DDLSEdge)) {
			// if the vertex lies on a constrained edge, we abort
			if (locEdge.isConstrained)
				return;

			this.__fromFace = locEdge.leftFace;
		}
		else {
			this.__fromFace = loc as DDLSFace;
		}
		//
		loc = DDLSGeom2D.LocatePosition(toX, toY, this._mesh);
		if ((locVertex = loc as DDLSVertex))
			this.__toFace = locVertex.edge.leftFace;
		else if ((locEdge = loc as DDLSEdge))
			this.__toFace = locEdge.leftFace;
		else
			this.__toFace = loc as DDLSFace;

		/*this.__fromFace.colorDebug = 0xFF0000;
		this.__toFace.colorDebug = 0xFF0000;
		trace( "from face:", this.__fromFace );
		trace( "to face:", this.__toFace );*/

		this.__sortedOpenedFaces.push(this.__fromFace);
		this.__entryEdges.set(this.__fromFace, null);
		this.__entryX.set(this.__fromFace, fromX);
		this.__entryY.set(this.__fromFace, fromY);
		this.__scoreG.set(this.__fromFace, 0);
		this.__scoreH.set(this.__fromFace, Math.sqrt((toX - fromX) * (toX - fromX) + (toY - fromY) * (toY - fromY)));
		this.__scoreF.set(this.__fromFace, this.__scoreH.get(this.__fromFace) + this.__scoreG.get(this.__fromFace));

		var innerEdge: DDLSEdge;
		var neighbourFace: DDLSFace;
		var f: number;
		var g: number;
		var h: number;
		var fromPoint: DDLSPoint2D = new DDLSPoint2D();
		var entryPoint: DDLSPoint2D = new DDLSPoint2D();
		var distancePoint: DDLSPoint2D = new DDLSPoint2D();
		var fillDatas: Boolean;
		while (true) {
			// no path found
			if (this.__sortedOpenedFaces.length == 0) {
				console.log("DDLSAStar no path found");
				this.__curFace = null;
				break;
			}

			// we reached the target face
			this.__curFace = this.__sortedOpenedFaces.pop();
			if (this.__curFace == this.__toFace) {
				break;
			}

			// we continue the search
			this.__iterEdge.fromFace = this.__curFace;
			while (innerEdge = this.__iterEdge.Next()) {
				if (innerEdge.isConstrained)
					continue;

				neighbourFace = innerEdge.rightFace;
				if (!this.__closedFaces.has(neighbourFace)) {
					if (this.__curFace != this.__fromFace && this._radius > 0 && !this.isWalkableByRadius(this.__entryEdges.get(this.__curFace), this.__curFace, innerEdge)) {
						//							trace("- NOT WALKABLE -");
						//							trace( "from", DDLSEdge(this.__entryEdges[this.__curFace]).originVertex.id, DDLSEdge(this.__entryEdges[this.__curFace]).destinationVertex.id );
						//							trace( "to", innerEdge.originVertex.id, innerEdge.destinationVertex.id );
						//							trace("----------------");
						continue;
					}

					fromPoint.x = this.__entryX.get(this.__curFace);
					fromPoint.y = this.__entryY.get(this.__curFace);
					entryPoint.x = (innerEdge.originVertex.pos.x + innerEdge.destinationVertex.pos.x) / 2;
					entryPoint.y = (innerEdge.originVertex.pos.y + innerEdge.destinationVertex.pos.y) / 2;
					distancePoint.x = entryPoint.x - toX;
					distancePoint.y = entryPoint.y - toY;
					h = distancePoint.length;
					distancePoint.x = fromPoint.x - entryPoint.x;
					distancePoint.y = fromPoint.y - entryPoint.y;
					g = this.__scoreG.get(this.__curFace) + distancePoint.length;
					f = h + g;
					fillDatas = false;
					if (!this.__openedFaces.has(neighbourFace)) {
						this.__sortedOpenedFaces.push(neighbourFace);
						this.__openedFaces.set(neighbourFace, true);
						fillDatas = true;
					}
					else if (this.__scoreF.get(neighbourFace) > f) {
						fillDatas = true;
					}
					if (fillDatas) {
						this.__entryEdges.set(neighbourFace, innerEdge);
						this.__entryX.set(neighbourFace, entryPoint.x);
						this.__entryY.set(neighbourFace, entryPoint.y);
						this.__scoreF.set(neighbourFace, f);
						this.__scoreG.set(neighbourFace, g);
						this.__scoreH.set(neighbourFace, h);
						this.__predecessor.set(neighbourFace, this.__curFace);
					}
				}
			}
			//
			this.__openedFaces.set(this.__curFace, null);
			this.__closedFaces.set(this.__curFace, true);
			this.__sortedOpenedFaces.sort(this.sortingFaces);
		}

		// if we didn't find a path
		if (!this.__curFace)
			return;

		// else we build the path
		resultListFaces.push(this.__curFace);
		//this.__curFace.colorDebug = 0x0000FF;
		while (this.__curFace != this.__fromFace) {
			resultListEdges.unshift(this.__entryEdges.get(this.__curFace));
			//this.__entryEdges[this.__curFace].colorDebug = 0xFFFF00;
			//this.__entryEdges[this.__curFace].oppositeEdge.colorDebug = 0xFFFF00;
			this.__curFace = this.__predecessor.get(this.__curFace);
			//this.__curFace.colorDebug = 0x0000FF;
			resultListFaces.unshift(this.__curFace);
		}
	}

	// faces with low distance value are at the end of the array
	private sortingFaces(a: DDLSFace, b: DDLSFace): number {
		if (this.__scoreF.get(a) == this.__scoreF.get(b))
			return 0;
		else if (this.__scoreF.get(a) < this.__scoreF.get(b))
			return 1;
		else
			return -1;
	}

	private isWalkableByRadius(fromEdge: DDLSEdge, throughFace: DDLSFace, toEdge: DDLSEdge): Boolean {
		var vA: DDLSVertex; // the vertex on fromEdge not on toEdge
		var vB: DDLSVertex; // the vertex on toEdge not on fromEdge
		var vC: DDLSVertex; // the common vertex of the 2 edges (pivot)

		// we identify the points
		if (fromEdge.originVertex == toEdge.originVertex) {
			vA = fromEdge.destinationVertex;
			vB = toEdge.destinationVertex;
			vC = fromEdge.originVertex;
		}
		else if (fromEdge.destinationVertex == toEdge.destinationVertex) {
			vA = fromEdge.originVertex;
			vB = toEdge.originVertex;
			vC = fromEdge.destinationVertex;
		}
		else if (fromEdge.originVertex == toEdge.destinationVertex) {
			vA = fromEdge.destinationVertex;
			vB = toEdge.originVertex;
			vC = fromEdge.originVertex;
		}
		else if (fromEdge.destinationVertex == toEdge.originVertex) {
			vA = fromEdge.originVertex;
			vB = toEdge.destinationVertex;
			vC = fromEdge.destinationVertex;
		}

		var dot: number;
		var result: Boolean;
		var distSquared: number;

		// if we have a right or obtuse angle on CAB
		dot = (vC.pos.x - vA.pos.x) * (vB.pos.x - vA.pos.x) + (vC.pos.y - vA.pos.y) * (vB.pos.y - vA.pos.y);
		if (dot <= 0) {
			// we compare length of AC with radius
			distSquared = (vC.pos.x - vA.pos.x) * (vC.pos.x - vA.pos.x) + (vC.pos.y - vA.pos.y) * (vC.pos.y - vA.pos.y);
			if (distSquared >= this._diameterSquared)
				return true;
			else
				return false;
		}

		// if we have a right or obtuse angle on CBA
		dot = (vC.pos.x - vB.pos.x) * (vA.pos.x - vB.pos.x) + (vC.pos.y - vB.pos.y) * (vA.pos.y - vB.pos.y);
		if (dot <= 0) {
			// we compare length of BC with radius
			distSquared = (vC.pos.x - vB.pos.x) * (vC.pos.x - vB.pos.x) + (vC.pos.y - vB.pos.y) * (vC.pos.y - vB.pos.y);
			if (distSquared >= this._diameterSquared)
				return true;
			else
				return false;
		}

		// we identify the adjacent edge (facing pivot vertex)
		var adjEdge: DDLSEdge;
		if (throughFace.edge != fromEdge && throughFace.edge.oppositeEdge != fromEdge
			&& throughFace.edge != toEdge && throughFace.edge.oppositeEdge != toEdge)
			adjEdge = throughFace.edge;
		else if (throughFace.edge.nextLeftEdge != fromEdge && throughFace.edge.nextLeftEdge.oppositeEdge != fromEdge
			&& throughFace.edge.nextLeftEdge != toEdge && throughFace.edge.nextLeftEdge.oppositeEdge != toEdge)
			adjEdge = throughFace.edge.nextLeftEdge;
		else
			adjEdge = throughFace.edge.prevLeftEdge;

		// if the adjacent edge is constrained, we check the distance of orthognaly projected
		if (adjEdge.isConstrained) {
			var proj: DDLSPoint2D = new DDLSPoint2D(vC.pos.x, vC.pos.y);
			DDLSGeom2D.ProjectOrthogonaly(proj, adjEdge);
			distSquared = (proj.x - vC.pos.x) * (proj.x - vC.pos.x) + (proj.y - vC.pos.y) * (proj.y - vC.pos.y);
			if (distSquared >= this._diameterSquared)
				return true;
			else
				return false;
		}
		else // if the adjacent is not constrained
		{
			var distSquaredA: number = (vC.pos.x - vA.pos.x) * (vC.pos.x - vA.pos.x) + (vC.pos.y - vA.pos.y) * (vC.pos.y - vA.pos.y);
			var distSquaredB: number = (vC.pos.x - vB.pos.x) * (vC.pos.x - vB.pos.x) + (vC.pos.y - vB.pos.y) * (vC.pos.y - vB.pos.y);
			if (distSquaredA < this._diameterSquared || distSquaredB < this._diameterSquared) {
				return false;
			}
			else {
				var vFaceToCheck: Array<DDLSFace> = new Array<DDLSFace>();
				var vFaceIsFromEdge: Array<DDLSEdge> = new Array<DDLSEdge>();
				var facesDone: Map<DDLSFace, boolean> = new Map<DDLSFace, boolean>();
				vFaceIsFromEdge.push(adjEdge);
				if (adjEdge.leftFace == throughFace) {
					vFaceToCheck.push(adjEdge.rightFace);
					facesDone.set(adjEdge.rightFace, true);
				}
				else {
					vFaceToCheck.push(adjEdge.leftFace);
					facesDone.set(adjEdge.leftFace, true);
				}

				var currFace: DDLSFace;
				var faceFromEdge: DDLSEdge;
				var currEdgeA: DDLSEdge;
				var nextFaceA: DDLSFace;
				var currEdgeB: DDLSEdge;
				var nextFaceB: DDLSFace;
				while (vFaceToCheck.length > 0) {
					currFace = vFaceToCheck.shift();
					faceFromEdge = vFaceIsFromEdge.shift();

					// we identify the 2 edges to evaluate
					if (currFace.edge == faceFromEdge || currFace.edge == faceFromEdge.oppositeEdge) {
						currEdgeA = currFace.edge.nextLeftEdge;
						currEdgeB = currFace.edge.nextLeftEdge.nextLeftEdge;
					}
					else if (currFace.edge.nextLeftEdge == faceFromEdge || currFace.edge.nextLeftEdge == faceFromEdge.oppositeEdge) {
						currEdgeA = currFace.edge;
						currEdgeB = currFace.edge.nextLeftEdge.nextLeftEdge;
					}
					else {
						currEdgeA = currFace.edge;
						currEdgeB = currFace.edge.nextLeftEdge;
					}

					// we identify the faces related to the 2 edges
					if (currEdgeA.leftFace == currFace)
						nextFaceA = currEdgeA.rightFace;
					else
						nextFaceA = currEdgeA.leftFace;
					if (currEdgeB.leftFace == currFace)
						nextFaceB = currEdgeB.rightFace;
					else
						nextFaceB = currEdgeB.leftFace;

					// we check if the next face is not already in pipe
					// and if the edge A is close to pivot vertex
					if (!facesDone.has(nextFaceA) && DDLSGeom2D.DistanceSquaredVertexToEdge(vC, currEdgeA) < this._diameterSquared) {
						// if the edge is constrained
						if (currEdgeA.isConstrained) {
							// so it is not walkable
							return false;
						}
						else {
							// if the edge is not constrained, we continue the search
							vFaceToCheck.push(nextFaceA);
							vFaceIsFromEdge.push(currEdgeA);
							facesDone.set(nextFaceA, true);
						}
					}

					// we check if the next face is not already in pipe
					// and if the edge B is close to pivot vertex
					if (!facesDone.has(nextFaceB) && DDLSGeom2D.DistanceSquaredVertexToEdge(vC, currEdgeB) < this._diameterSquared) {
						// if the edge is constrained
						if (currEdgeB.isConstrained) {
							// so it is not walkable
							return false;
						}
						else {
							// if the edge is not constrained, we continue the search
							vFaceToCheck.push(nextFaceB);
							vFaceIsFromEdge.push(currEdgeB);
							facesDone.set(nextFaceB, true);
						}
					}
				}

				// if we didn't previously meet a constrained edge
				return true;
			}
		}

		return true;
	}


}
