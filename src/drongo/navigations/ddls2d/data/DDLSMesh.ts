import { IteratorFromVertexToOutgoingEdges } from "../iterators/IteratorFromVertexToOutgoingEdges";
import { DDLSConstants } from "./DDLSConstants";
import { DDLSConstraintSegment } from "./DDLSConstraintSegment";
import { DDLSConstraintShape } from "./DDLSConstraintShape";
import { DDLSEdge } from "./DDLSEdge";
import { DDLSFace } from "./DDLSFace";
import { DDLSObject } from "./DDLSObject";
import { DDLSVertex } from "./DDLSVertex";
import { DDLSGeom2D } from "./math/DDLSGeom2D";
import { DDLSMatrix2D } from "./math/DDLSMatrix2D";
import { DDLSPoint2D } from "./math/DDLSPoint2D";

export class DDLSMesh {

	private static INC: number = 0;
	private _id: number;

	private _width: number;
	private _height: number;
	private _clipping: boolean;

	private _vertices: Array<DDLSVertex>;
	private _edges: Array<DDLSEdge>;
	private _faces: Array<DDLSFace>;
	private _constraintShapes: Array<DDLSConstraintShape>;
	private _objects: Array<DDLSObject>;

	// keep references of center vertex and bounding edges when split, useful to restore edges as Delaunay
	private __centerVertex: DDLSVertex;
	private __edgesToCheck: Array<DDLSEdge>;

	constructor(width: number, height: number) {
		this._id = DDLSMesh.INC;
		DDLSMesh.INC++;

		this._width = width;
		this._height = height;
		this._clipping = true;

		this._vertices = new Array<DDLSVertex>();
		this._edges = new Array<DDLSEdge>();
		this._faces = new Array<DDLSFace>();
		this._constraintShapes = new Array<DDLSConstraintShape>();
		this._objects = new Array<DDLSObject>();

		this.__edgesToCheck = new Array<DDLSEdge>();
	}

	get height(): number {
		return this._height;
	}

	get width(): number {
		return this._width;
	}

	get clipping(): boolean {
		return this._clipping;
	}

	set clipping(value: boolean) {
		this._clipping = value;
	}

	get id(): number {
		return this._id;
	}

	Dispose(): void {
		while (this._vertices.length > 0)
			this._vertices.pop().Dispose();
		this._vertices = null;
		while (this._edges.length > 0)
			this._edges.pop().Dispose();
		this._edges = null;
		while (this._faces.length > 0)
			this._faces.pop().Dispose();
		this._faces = null;
		while (this._constraintShapes.length > 0)
			this._constraintShapes.pop().Dispose();
		this._constraintShapes = null;
		while (this._objects.length > 0)
			this._objects.pop().Dispose();
		this._objects = null;

		this.__edgesToCheck = null;
		this.__centerVertex = null;
	}

	get __vertices(): Array<DDLSVertex> {
		return this._vertices;
	}

	get __edges(): Array<DDLSEdge> {
		return this._edges;
	}

	get __faces(): Array<DDLSFace> {
		return this._faces;
	}

	get __constraintShapes(): Array<DDLSConstraintShape> {
		return this._constraintShapes;
	}

	BuildFromRecord(rec: string): void {
		var positions = rec.split(';');
		for (var i: number = 0; i < positions.length; i += 4) {
			this.InsertConstraintSegment(Number(positions[i]), Number(positions[i + 1]), Number(positions[i + 2]), Number(positions[i + 3]));
		}
	}

	InsertObject(object: DDLSObject): void {
		if (object.constraintShape)
			this.DeleteObject(object);

		var shape: DDLSConstraintShape = new DDLSConstraintShape();
		var segment: DDLSConstraintSegment;
		var coordinates: Array<number> = object.coordinates;
		var m: DDLSMatrix2D = object.matrix;

		object.UpdateMatrixFromValues();
		var x1: number;
		var y1: number;
		var x2: number;
		var y2: number;
		var transfx1: number;
		var transfy1: number;
		var transfx2: number;
		var transfy2: number;

		for (var i = 0; i < coordinates.length; i += 4) {
			x1 = coordinates[i];
			y1 = coordinates[i + 1];
			x2 = coordinates[i + 2];
			y2 = coordinates[i + 3];
			transfx1 = m.TransformX(x1, y1);
			transfy1 = m.TransformY(x1, y1);
			transfx2 = m.TransformX(x2, y2);
			transfy2 = m.TransformY(x2, y2);

			segment = this.InsertConstraintSegment(transfx1, transfy1, transfx2, transfy2);
			if (segment) {
				segment.fromShape = shape;
				shape.segments.push(segment);
			}
		}

		this._constraintShapes.push(shape);
		object.constraintShape = shape;

		if (!this.__objectsUpdateInProgress) {
			this._objects.push(object);
		}
	}

	DeleteObject(object: DDLSObject): void {
		if (!object.constraintShape)
			return;

		this.DeleteConstraintShape(object.constraintShape);
		object.constraintShape = null;

		if (!this.__objectsUpdateInProgress) {
			var index = this._objects.indexOf(object);
			this._objects.splice(index, 1);
		}
	}

	private __objectsUpdateInProgress: Boolean;
	UpdateObjects(): void {
		this.__objectsUpdateInProgress = true;
		for (var i = 0; i < this._objects.length; i++) {
			if (this._objects[i].hasChanged) {
				this.DeleteObject(this._objects[i]);
				this.InsertObject(this._objects[i]);
				this._objects[i].hasChanged = false;
			}
		}
		this.__objectsUpdateInProgress = false;
	}

	// insert a new collection of constrained edges.
	// Coordinates parameter is a list with form [x0, y0, x1, y1, x2, y2, x3, y3, x4, y4, ....]
	// where each 4-uple sequence (xi, yi, xi+1, yi+1) is a constraint segment (with i % 4 == 0)
	// and where each couple sequence (xi, yi) is a point.
	// Segments are not necessary connected.
	// Segments can overlap (then they will be automaticaly subdivided).
	InsertConstraintShape(coordinates: Array<number>): DDLSConstraintShape {
		var shape: DDLSConstraintShape = new DDLSConstraintShape();
		var segment: DDLSConstraintSegment;

		for (var i = 0; i < coordinates.length; i += 4) {
			segment = this.InsertConstraintSegment(coordinates[i], coordinates[i + 1], coordinates[i + 2], coordinates[i + 3]);
			if (segment) {
				segment.fromShape = shape;
				shape.segments.push(segment);
			}
		}

		this._constraintShapes.push(shape);

		return shape;
	}

	DeleteConstraintShape(shape: DDLSConstraintShape): void {
		for (var i = 0; i < shape.segments.length; i++) {
			this.DeleteConstraintSegment(shape.segments[i]);
		}

		shape.Dispose();

		this._constraintShapes.splice(this._constraintShapes.indexOf(shape), 1);
	}

	InsertConstraintSegment(x1: number, y1: number, x2: number, y2: number): DDLSConstraintSegment {
		// we clip against AABB
		var newX1: number = x1;
		var newY1: number = y1;
		var newX2: number = x2;
		var newY2: number = y2;

		if ((x1 > this._width && x2 > this._width)
			|| (x1 < 0 && x2 < 0)
			|| (y1 > this._height && y2 > this._height)
			|| (y1 < 0 && y2 < 0)) {
			return null;
		}
		else {
			var nx: number = x2 - x1;
			var ny: number = y2 - y1;

			var tmin: number = Number.NEGATIVE_INFINITY;
			var tmax: number = Number.POSITIVE_INFINITY;

			if (nx != 0.0) {
				var tx1: number = (0 - x1) / nx;
				var tx2: number = (this._width - x1) / nx;

				tmin = Math.max(tmin, Math.min(tx1, tx2));
				tmax = Math.min(tmax, Math.max(tx1, tx2));
			}

			if (ny != 0.0) {
				var ty1: number = (0 - y1) / ny;
				var ty2: number = (this._height - y1) / ny;

				tmin = Math.max(tmin, Math.min(ty1, ty2));
				tmax = Math.min(tmax, Math.max(ty1, ty2));
			}

			if (tmax >= tmin) {

				if (tmax < 1) {
					//Clip end point
					newX2 = nx * tmax + x1;
					newY2 = ny * tmax + y1;
				}

				if (tmin > 0) {
					//Clip start point
					newX1 = nx * tmin + x1;
					newY1 = ny * tmin + y1;
				}
			}
			else
				return null;
		}

		// we check the vertices insertions
		var vertexDown: DDLSVertex = this.InsertVertex(newX1, newY1);
		if (!vertexDown)
			return null;
		var vertexUp: DDLSVertex = this.InsertVertex(newX2, newY2);
		if (!vertexUp)
			return null;
		if (vertexDown == vertexUp)
			return null;

		//trace("vertices", vertexDown.id, vertexUp.id)

		// useful
		var iterVertexToOutEdges: IteratorFromVertexToOutgoingEdges = new IteratorFromVertexToOutgoingEdges();
		var currVertex: DDLSVertex;
		var currEdge: DDLSEdge;
		var i: number;

		// the new constraint segment
		var segment: DDLSConstraintSegment = new DDLSConstraintSegment();

		var tempEdgeDownUp: DDLSEdge = new DDLSEdge();
		var tempSdgeUpDown: DDLSEdge = new DDLSEdge();
		tempEdgeDownUp.SetDatas(vertexDown, tempSdgeUpDown, null, null, true, true);
		tempSdgeUpDown.SetDatas(vertexUp, tempEdgeDownUp, null, null, true, true);

		var intersectedEdges: Array<DDLSEdge> = new Array<DDLSEdge>();
		var leftBoundingEdges: Array<DDLSEdge> = new Array<DDLSEdge>();
		var rightBoundingEdges: Array<DDLSEdge> = new Array<DDLSEdge>();

		var currObjet: any;
		var pIntersect: DDLSPoint2D = new DDLSPoint2D();
		var edgeLeft: DDLSEdge;
		var newEdgeDownUp: DDLSEdge;
		var newEdgeUpDown: DDLSEdge;
		var done: Boolean;
		currVertex = vertexDown;
		currObjet = currVertex;
		while (true) {
			done = false;
			if ((currVertex = currObjet as DDLSVertex)) {
				//trace("case vertex");
				iterVertexToOutEdges.fromVertex = currVertex;
				while (currEdge = iterVertexToOutEdges.Next()) {
					// if we meet directly the end vertex
					if (currEdge.destinationVertex == vertexUp) {
						//trace("we met the end vertex");
						if (!currEdge.isConstrained) {
							currEdge.isConstrained = true;
							currEdge.oppositeEdge.isConstrained = true;
						}
						currEdge.AddFromConstraintSegment(segment);
						currEdge.oppositeEdge.fromConstraintSegments = currEdge.fromConstraintSegments;
						vertexDown.AddFromConstraintSegment(segment);
						vertexUp.AddFromConstraintSegment(segment);
						segment.AddEdge(currEdge);
						return segment;
					}
					// if we meet a vertex
					if (DDLSGeom2D.DistanceSquaredVertexToEdge(currEdge.destinationVertex, tempEdgeDownUp) <= DDLSConstants.EPSILON_SQUARED) {
						//trace("we met a vertex");
						if (!currEdge.isConstrained) {
							//trace("edge is not constrained");
							currEdge.isConstrained = true;
							currEdge.oppositeEdge.isConstrained = true;
						}
						currEdge.AddFromConstraintSegment(segment);
						currEdge.oppositeEdge.fromConstraintSegments = currEdge.fromConstraintSegments;
						vertexDown.AddFromConstraintSegment(segment);
						segment.AddEdge(currEdge);
						vertexDown = currEdge.destinationVertex;
						tempEdgeDownUp.originVertex = vertexDown;
						currObjet = vertexDown;
						done = true;
						break;
					}
				}

				if (done)
					continue;

				iterVertexToOutEdges.fromVertex = currVertex;
				while (currEdge = iterVertexToOutEdges.Next()) {
					currEdge = currEdge.nextLeftEdge;
					if (DDLSGeom2D.Intersections2edges(currEdge, tempEdgeDownUp, pIntersect)) {
						//trace("edge intersection");
						if (currEdge.isConstrained) {
							//trace("edge is constrained");
							vertexDown = this.SplitEdge(currEdge, pIntersect.x, pIntersect.y);
							iterVertexToOutEdges.fromVertex = currVertex;
							while (currEdge = iterVertexToOutEdges.Next()) {
								if (currEdge.destinationVertex == vertexDown) {
									currEdge.isConstrained = true;
									currEdge.oppositeEdge.isConstrained = true;
									currEdge.AddFromConstraintSegment(segment);
									currEdge.oppositeEdge.fromConstraintSegments = currEdge.fromConstraintSegments;
									segment.AddEdge(currEdge);
									break;
								}
							}
							currVertex.AddFromConstraintSegment(segment);
							tempEdgeDownUp.originVertex = vertexDown;
							currObjet = vertexDown;
						}
						else {
							//trace("edge is not constrained");
							intersectedEdges.push(currEdge);
							leftBoundingEdges.unshift(currEdge.nextLeftEdge);
							rightBoundingEdges.push(currEdge.prevLeftEdge);
							currEdge = currEdge.oppositeEdge; // we keep the edge from left to right
							currObjet = currEdge;
						}
						break;
					}
				}
			}
			else if ((currEdge = currObjet as DDLSEdge)) {
				//trace("case edge");
				edgeLeft = currEdge.nextLeftEdge;
				if (edgeLeft.destinationVertex == vertexUp) {
					//trace("end point reached");
					leftBoundingEdges.unshift(edgeLeft.nextLeftEdge);
					rightBoundingEdges.push(edgeLeft);

					newEdgeDownUp = new DDLSEdge();
					newEdgeUpDown = new DDLSEdge();
					newEdgeDownUp.SetDatas(vertexDown, newEdgeUpDown, null, null, true, true);
					newEdgeUpDown.SetDatas(vertexUp, newEdgeDownUp, null, null, true, true);
					leftBoundingEdges.push(newEdgeDownUp);
					rightBoundingEdges.push(newEdgeUpDown);
					this.InsertNewConstrainedEdge(segment, newEdgeDownUp, intersectedEdges, leftBoundingEdges, rightBoundingEdges);

					return segment;
				}
				else if (DDLSGeom2D.DistanceSquaredVertexToEdge(edgeLeft.destinationVertex, tempEdgeDownUp) <= DDLSConstants.EPSILON_SQUARED) {
					//trace("we met a vertex");
					leftBoundingEdges.unshift(edgeLeft.nextLeftEdge);
					rightBoundingEdges.push(edgeLeft);

					newEdgeDownUp = new DDLSEdge();
					newEdgeUpDown = new DDLSEdge();
					newEdgeDownUp.SetDatas(vertexDown, newEdgeUpDown, null, null, true, true);
					newEdgeUpDown.SetDatas(edgeLeft.destinationVertex, newEdgeDownUp, null, null, true, true);
					leftBoundingEdges.push(newEdgeDownUp);
					rightBoundingEdges.push(newEdgeUpDown);
					this.InsertNewConstrainedEdge(segment, newEdgeDownUp, intersectedEdges, leftBoundingEdges, rightBoundingEdges);

					intersectedEdges.splice(0, intersectedEdges.length);
					leftBoundingEdges.splice(0, leftBoundingEdges.length);
					rightBoundingEdges.splice(0, rightBoundingEdges.length);

					vertexDown = edgeLeft.destinationVertex;
					tempEdgeDownUp.originVertex = vertexDown;
					currObjet = vertexDown;
				}
				else {
					if (DDLSGeom2D.Intersections2edges(edgeLeft, tempEdgeDownUp, pIntersect)) {
						//trace("1st left edge intersected");
						if (edgeLeft.isConstrained) {
							//trace("edge is constrained");
							currVertex = this.SplitEdge(edgeLeft, pIntersect.x, pIntersect.y);

							iterVertexToOutEdges.fromVertex = currVertex;
							while (currEdge = iterVertexToOutEdges.Next()) {
								if (currEdge.destinationVertex == leftBoundingEdges[0].originVertex) {
									leftBoundingEdges.unshift(currEdge);
								}
								if (currEdge.destinationVertex == rightBoundingEdges[rightBoundingEdges.length - 1].destinationVertex) {
									rightBoundingEdges.push(currEdge.oppositeEdge);
								}
							}

							newEdgeDownUp = new DDLSEdge();
							newEdgeUpDown = new DDLSEdge();
							newEdgeDownUp.SetDatas(vertexDown, newEdgeUpDown, null, null, true, true);
							newEdgeUpDown.SetDatas(currVertex, newEdgeDownUp, null, null, true, true);
							leftBoundingEdges.push(newEdgeDownUp);
							rightBoundingEdges.push(newEdgeUpDown);
							this.InsertNewConstrainedEdge(segment, newEdgeDownUp, intersectedEdges, leftBoundingEdges, rightBoundingEdges);

							intersectedEdges.splice(0, intersectedEdges.length);
							leftBoundingEdges.splice(0, leftBoundingEdges.length);
							rightBoundingEdges.splice(0, rightBoundingEdges.length);
							vertexDown = currVertex;
							tempEdgeDownUp.originVertex = vertexDown;
							currObjet = vertexDown;
						}
						else {
							//trace("edge is not constrained");
							intersectedEdges.push(edgeLeft);
							leftBoundingEdges.unshift(edgeLeft.nextLeftEdge);
							currEdge = edgeLeft.oppositeEdge; // we keep the edge from left to right
							currObjet = currEdge;
						}
					}
					else {
						//trace("2nd left edge intersected");
						edgeLeft = edgeLeft.nextLeftEdge;
						DDLSGeom2D.Intersections2edges(edgeLeft, tempEdgeDownUp, pIntersect);
						if (edgeLeft.isConstrained) {
							//trace("edge is constrained");
							currVertex = this.SplitEdge(edgeLeft, pIntersect.x, pIntersect.y);

							iterVertexToOutEdges.fromVertex = currVertex;
							while (currEdge = iterVertexToOutEdges.Next()) {
								if (currEdge.destinationVertex == leftBoundingEdges[0].originVertex) {
									leftBoundingEdges.unshift(currEdge);
								}
								if (currEdge.destinationVertex == rightBoundingEdges[rightBoundingEdges.length - 1].destinationVertex) {
									rightBoundingEdges.push(currEdge.oppositeEdge);
								}
							}

							newEdgeDownUp = new DDLSEdge();
							newEdgeUpDown = new DDLSEdge();
							newEdgeDownUp.SetDatas(vertexDown, newEdgeUpDown, null, null, true, true);
							newEdgeUpDown.SetDatas(currVertex, newEdgeDownUp, null, null, true, true);
							leftBoundingEdges.push(newEdgeDownUp);
							rightBoundingEdges.push(newEdgeUpDown);
							this.InsertNewConstrainedEdge(segment, newEdgeDownUp, intersectedEdges, leftBoundingEdges, rightBoundingEdges);

							intersectedEdges.splice(0, intersectedEdges.length);
							leftBoundingEdges.splice(0, leftBoundingEdges.length);
							rightBoundingEdges.splice(0, rightBoundingEdges.length);
							vertexDown = currVertex;
							tempEdgeDownUp.originVertex = vertexDown;
							currObjet = vertexDown;
						}
						else {
							//trace("edge is not constrained");
							intersectedEdges.push(edgeLeft);
							rightBoundingEdges.push(edgeLeft.prevLeftEdge);
							currEdge = edgeLeft.oppositeEdge; // we keep the edge from left to right
							currObjet = currEdge;
						}
					}
				}
			}
		}

		return segment;
	}

	private InsertNewConstrainedEdge(fromSegment: DDLSConstraintSegment, edgeDownUp: DDLSEdge, intersectedEdges: Array<DDLSEdge>, leftBoundingEdges: Array<DDLSEdge>, rightBoundingEdges: Array<DDLSEdge>): void {
		//trace("insertNewConstrainedEdge");
		this._edges.push(edgeDownUp);
		this._edges.push(edgeDownUp.oppositeEdge);

		edgeDownUp.AddFromConstraintSegment(fromSegment);
		edgeDownUp.oppositeEdge.fromConstraintSegments = edgeDownUp.fromConstraintSegments;

		fromSegment.AddEdge(edgeDownUp);

		edgeDownUp.originVertex.AddFromConstraintSegment(fromSegment);
		edgeDownUp.destinationVertex.AddFromConstraintSegment(fromSegment);

		this.untriangulate(intersectedEdges);

		this.Triangulate(leftBoundingEdges, true);
		this.Triangulate(rightBoundingEdges, true);
	}

	DeleteConstraintSegment(segment: DDLSConstraintSegment): void {
		//trace("deleteConstraintSegment id", segment.id);
		var i: number;
		var vertexToDelete: Array<DDLSVertex> = new Array<DDLSVertex>();
		var edge: DDLSEdge;
		var vertex: DDLSVertex;
		var fromConstraintSegment: Array<DDLSConstraintSegment>;
		for (i = 0; i < segment.edges.length; i++) {
			edge = segment.edges[i];
			//trace("unconstrain edge ", edge);
			edge.RemoveFromConstraintSegment(segment);
			if (edge.fromConstraintSegments.length == 0) {
				edge.isConstrained = false;
				edge.oppositeEdge.isConstrained = false;
			}

			vertex = edge.originVertex;
			vertex.RemoveFromConstraintSegment(segment);
			vertexToDelete.push(vertex);
		}
		vertex = edge.destinationVertex;
		vertex.RemoveFromConstraintSegment(segment);
		vertexToDelete.push(vertex);

		//trace("clean the useless vertices");
		for (i = 0; i < vertexToDelete.length; i++) {
			this.DeleteVertex(vertexToDelete[i]);
		}
		//trace("clean done");


		segment.Dispose();
	}

	private Check(): void {
		for (var i = 0; i < this._edges.length; i++) {
			if (!this._edges[i].nextLeftEdge) {
				console.log("!!! missing nextLeftEdge");
				return;
			}
		}
		console.log("check OK");
	}

	InsertVertex(x: number, y: number): DDLSVertex {
		//trace("insertVertex", x, y);
		if (x < 0 || y < 0 || x > this._width || y > this._height)
			return null;

		this.__edgesToCheck.splice(0, this.__edgesToCheck.length);

		var inObject: any = DDLSGeom2D.LocatePosition(x, y, this);
		var inVertex: DDLSVertex;
		var inEdge: DDLSEdge;
		var inFace: DDLSFace;
		var newVertex: DDLSVertex;
		if ((inVertex = inObject as DDLSVertex)) {
			//trace("inVertex", inVertex.id);
			newVertex = inVertex;
		}
		else if ((inEdge = inObject as DDLSEdge)) {
			//trace("inEdge", inEdge);
			newVertex = this.SplitEdge(inEdge, x, y);
		}
		else if ((inFace = inObject as DDLSFace)) {
			//trace("inFace");
			newVertex = this.SplitFace(inFace, x, y);
		}

		this.RestoreAsDelaunay();

		return newVertex;
	}

	FlipEdge(edge: DDLSEdge): DDLSEdge {
		// retrieve and create useful objets
		var eBot_Top: DDLSEdge = edge;
		var eTop_Bot: DDLSEdge = edge.oppositeEdge;
		var eLeft_Right: DDLSEdge = new DDLSEdge();
		var eRight_Left: DDLSEdge = new DDLSEdge();
		var eTop_Left: DDLSEdge = eBot_Top.nextLeftEdge;
		var eLeft_Bot: DDLSEdge = eTop_Left.nextLeftEdge;
		var eBot_Right: DDLSEdge = eTop_Bot.nextLeftEdge;
		var eRight_Top: DDLSEdge = eBot_Right.nextLeftEdge;

		var vBot: DDLSVertex = eBot_Top.originVertex;
		var vTop: DDLSVertex = eTop_Bot.originVertex;
		var vLeft: DDLSVertex = eLeft_Bot.originVertex;
		var vRight: DDLSVertex = eRight_Top.originVertex;

		var fLeft: DDLSFace = eBot_Top.leftFace;
		var fRight: DDLSFace = eTop_Bot.leftFace;
		var fBot: DDLSFace = new DDLSFace();
		var fTop: DDLSFace = new DDLSFace();

		// add the new edges
		this._edges.push(eLeft_Right);
		this._edges.push(eRight_Left);

		// add the new faces
		this._faces.push(fTop);
		this._faces.push(fBot);

		// set vertex, edge and face references for the new LEFT_RIGHT and RIGHT-LEFT edges
		eLeft_Right.SetDatas(vLeft, eRight_Left, eRight_Top, fTop, edge.isReal, edge.isConstrained);
		eRight_Left.SetDatas(vRight, eLeft_Right, eLeft_Bot, fBot, edge.isReal, edge.isConstrained);

		// set edge references for the new TOP and BOTTOM faces
		fTop.SetDatas(eLeft_Right);
		fBot.SetDatas(eRight_Left);

		// check the edge references of TOP and BOTTOM vertices
		if (vTop.edge == eTop_Bot)
			vTop.SetDatas(eTop_Left);
		if (vBot.edge == eBot_Top)
			vBot.SetDatas(eBot_Right);

		// set the new edge and face references for the 4 bouding edges
		eTop_Left.nextLeftEdge = eLeft_Right;
		eTop_Left.leftFace = fTop;
		eLeft_Bot.nextLeftEdge = eBot_Right;
		eLeft_Bot.leftFace = fBot;
		eBot_Right.nextLeftEdge = eRight_Left;
		eBot_Right.leftFace = fBot;
		eRight_Top.nextLeftEdge = eTop_Left;
		eRight_Top.leftFace = fTop;

		// remove the old TOP-BOTTOM and BOTTOM-TOP edges
		eBot_Top.Dispose();
		eTop_Bot.Dispose();
		this._edges.splice(this._edges.indexOf(eBot_Top), 1);
		this._edges.splice(this._edges.indexOf(eTop_Bot), 1);

		// remove the old LEFT and RIGHT faces
		fLeft.Dispose();
		fRight.Dispose();
		this._faces.splice(this._faces.indexOf(fLeft), 1);
		this._faces.splice(this._faces.indexOf(fRight), 1);

		return eRight_Left;
	}

	SplitEdge(edge: DDLSEdge, x: number, y: number): DDLSVertex {
		// empty old references
		this.__edgesToCheck.splice(0, this.__edgesToCheck.length);

		// retrieve useful objets
		var eLeft_Right: DDLSEdge = edge;
		var eRight_Left: DDLSEdge = eLeft_Right.oppositeEdge;
		var eRight_Top: DDLSEdge = eLeft_Right.nextLeftEdge;
		var eTop_Left: DDLSEdge = eRight_Top.nextLeftEdge;
		var eLeft_Bot: DDLSEdge = eRight_Left.nextLeftEdge;
		var eBot_Right: DDLSEdge = eLeft_Bot.nextLeftEdge;

		var vTop: DDLSVertex = eTop_Left.originVertex;
		var vLeft: DDLSVertex = eLeft_Right.originVertex;
		var vBot: DDLSVertex = eBot_Right.originVertex;
		var vRight: DDLSVertex = eRight_Left.originVertex;

		var fTop: DDLSFace = eLeft_Right.leftFace;
		var fBot: DDLSFace = eRight_Left.leftFace;

		// check distance from the position to edge end points
		if ((vLeft.pos.x - x) * (vLeft.pos.x - x) + (vLeft.pos.y - y) * (vLeft.pos.y - y) <= DDLSConstants.EPSILON_SQUARED)
			return vLeft;
		if ((vRight.pos.x - x) * (vRight.pos.x - x) + (vRight.pos.y - y) * (vRight.pos.y - y) <= DDLSConstants.EPSILON_SQUARED)
			return vRight;

		// create new objects
		var vCenter: DDLSVertex = new DDLSVertex();

		var eTop_Center: DDLSEdge = new DDLSEdge();
		var eCenter_Top: DDLSEdge = new DDLSEdge();
		var eBot_Center: DDLSEdge = new DDLSEdge();
		var eCenter_Bot: DDLSEdge = new DDLSEdge();

		var eLeft_Center: DDLSEdge = new DDLSEdge();
		var eCenter_Left: DDLSEdge = new DDLSEdge();
		var eRight_Center: DDLSEdge = new DDLSEdge();
		var eCenter_Right: DDLSEdge = new DDLSEdge();

		var fTopLeft: DDLSFace = new DDLSFace();
		var fBotLeft: DDLSFace = new DDLSFace();
		var fBotRight: DDLSFace = new DDLSFace();
		var fTopRight: DDLSFace = new DDLSFace();

		// add the new vertex
		this._vertices.push(vCenter);

		// add the new edges
		this._edges.push(eCenter_Top);
		this._edges.push(eTop_Center);
		this._edges.push(eCenter_Left);
		this._edges.push(eLeft_Center);
		this._edges.push(eCenter_Bot);
		this._edges.push(eBot_Center);
		this._edges.push(eCenter_Right);
		this._edges.push(eRight_Center);

		// add the new faces
		this._faces.push(fTopRight);
		this._faces.push(fBotRight);
		this._faces.push(fBotLeft);
		this._faces.push(fTopLeft);

		// set pos and edge reference for the new CENTER vertex
		vCenter.SetDatas(fTop.isReal ? eCenter_Top : eCenter_Bot);
		vCenter.pos.x = x;
		vCenter.pos.y = y;
		DDLSGeom2D.ProjectOrthogonaly(vCenter.pos, eLeft_Right);

		// set the new vertex, edge and face references for the new 8 center crossing edges
		eCenter_Top.SetDatas(vCenter, eTop_Center, eTop_Left, fTopLeft, fTop.isReal);
		eTop_Center.SetDatas(vTop, eCenter_Top, eCenter_Right, fTopRight, fTop.isReal);
		eCenter_Left.SetDatas(vCenter, eLeft_Center, eLeft_Bot, fBotLeft, edge.isReal, edge.isConstrained);
		eLeft_Center.SetDatas(vLeft, eCenter_Left, eCenter_Top, fTopLeft, edge.isReal, edge.isConstrained);
		eCenter_Bot.SetDatas(vCenter, eBot_Center, eBot_Right, fBotRight, fBot.isReal);
		eBot_Center.SetDatas(vBot, eCenter_Bot, eCenter_Left, fBotLeft, fBot.isReal);
		eCenter_Right.SetDatas(vCenter, eRight_Center, eRight_Top, fTopRight, edge.isReal, edge.isConstrained);
		eRight_Center.SetDatas(vRight, eCenter_Right, eCenter_Bot, fBotRight, edge.isReal, edge.isConstrained);

		// set the new edge references for the new 4 faces
		fTopLeft.SetDatas(eCenter_Top, fTop.isReal);
		fBotLeft.SetDatas(eCenter_Left, fBot.isReal);
		fBotRight.SetDatas(eCenter_Bot, fBot.isReal);
		fTopRight.SetDatas(eCenter_Right, fTop.isReal);

		// check the edge references of LEFT and RIGHT vertices
		if (vLeft.edge == eLeft_Right)
			vLeft.SetDatas(eLeft_Center);
		if (vRight.edge == eRight_Left)
			vRight.SetDatas(eRight_Center);

		// set the new edge and face references for the 4 bounding edges
		eTop_Left.nextLeftEdge = eLeft_Center;
		eTop_Left.leftFace = fTopLeft;
		eLeft_Bot.nextLeftEdge = eBot_Center;
		eLeft_Bot.leftFace = fBotLeft;
		eBot_Right.nextLeftEdge = eRight_Center;
		eBot_Right.leftFace = fBotRight;
		eRight_Top.nextLeftEdge = eTop_Center;
		eRight_Top.leftFace = fTopRight;

		// if the edge was constrained, we must:
		// - add the segments the edge is from to the 2 new
		// - update the segments the edge is from by deleting the old edge and inserting the 2 new
		// - add the segments the edge is from to the new vertex
		if (eLeft_Right.isConstrained) {
			var fromSegments: Array<DDLSConstraintSegment> = eLeft_Right.fromConstraintSegments;
			eLeft_Center.fromConstraintSegments = fromSegments.slice(0);
			eCenter_Left.fromConstraintSegments = eLeft_Center.fromConstraintSegments;
			eCenter_Right.fromConstraintSegments = fromSegments.slice(0);
			eRight_Center.fromConstraintSegments = eCenter_Right.fromConstraintSegments;

			var edges: Array<DDLSEdge>;
			var index: number;
			for (var i = 0; i < eLeft_Right.fromConstraintSegments.length; i++) {
				edges = eLeft_Right.fromConstraintSegments[i].edges;
				index = edges.indexOf(eLeft_Right);
				if (index != -1)
					edges.splice(index, 1, eLeft_Center, eCenter_Right);
				else
					edges.splice(edges.indexOf(eRight_Left), 1, eRight_Center, eCenter_Left);
			}

			vCenter.fromConstraintSegments = fromSegments.slice(0);
		}

		// remove the old LEFT-RIGHT and RIGHT-LEFT edges
		eLeft_Right.Dispose();
		eRight_Left.Dispose();
		this._edges.splice(this._edges.indexOf(eLeft_Right), 1);
		this._edges.splice(this._edges.indexOf(eRight_Left), 1);

		// remove the old TOP and BOTTOM faces
		fTop.Dispose();
		fBot.Dispose();
		this._faces.splice(this._faces.indexOf(fTop), 1);
		this._faces.splice(this._faces.indexOf(fBot), 1);

		// add new bounds references for Delaunay restoring
		this.__centerVertex = vCenter;
		this.__edgesToCheck.push(eTop_Left);
		this.__edgesToCheck.push(eLeft_Bot);
		this.__edgesToCheck.push(eBot_Right);
		this.__edgesToCheck.push(eRight_Top);

		return vCenter;
	}

	SplitFace(face: DDLSFace, x: number, y: number): DDLSVertex {
		// empty old references
		this.__edgesToCheck.splice(0, this.__edgesToCheck.length);

		// retrieve useful objects
		var eTop_Left: DDLSEdge = face.edge;
		var eLeft_Right: DDLSEdge = eTop_Left.nextLeftEdge;
		var eRight_Top: DDLSEdge = eLeft_Right.nextLeftEdge;

		var vTop: DDLSVertex = eTop_Left.originVertex;
		var vLeft: DDLSVertex = eLeft_Right.originVertex;
		var vRight: DDLSVertex = eRight_Top.originVertex;

		// create new objects
		var vCenter: DDLSVertex = new DDLSVertex();

		var eTop_Center: DDLSEdge = new DDLSEdge();
		var eCenter_Top: DDLSEdge = new DDLSEdge();
		var eLeft_Center: DDLSEdge = new DDLSEdge();
		var eCenter_Left: DDLSEdge = new DDLSEdge();
		var eRight_Center: DDLSEdge = new DDLSEdge();
		var eCenter_Right: DDLSEdge = new DDLSEdge();

		var fTopLeft: DDLSFace = new DDLSFace();
		var fBot: DDLSFace = new DDLSFace();
		var fTopRight: DDLSFace = new DDLSFace();

		// add the new vertex
		this._vertices.push(vCenter);

		// add the new edges
		this._edges.push(eTop_Center);
		this._edges.push(eCenter_Top);
		this._edges.push(eLeft_Center);
		this._edges.push(eCenter_Left);
		this._edges.push(eRight_Center);
		this._edges.push(eCenter_Right);

		// add the new faces
		this._faces.push(fTopLeft);
		this._faces.push(fBot);
		this._faces.push(fTopRight);

		// set pos and edge reference for the new CENTER vertex
		vCenter.SetDatas(eCenter_Top);
		vCenter.pos.x = x;
		vCenter.pos.y = y;

		// set the new vertex, edge and face references for the new 6 center crossing edges
		eTop_Center.SetDatas(vTop, eCenter_Top, eCenter_Right, fTopRight);
		eCenter_Top.SetDatas(vCenter, eTop_Center, eTop_Left, fTopLeft);
		eLeft_Center.SetDatas(vLeft, eCenter_Left, eCenter_Top, fTopLeft);
		eCenter_Left.SetDatas(vCenter, eLeft_Center, eLeft_Right, fBot);
		eRight_Center.SetDatas(vRight, eCenter_Right, eCenter_Left, fBot);
		eCenter_Right.SetDatas(vCenter, eRight_Center, eRight_Top, fTopRight);

		// set the new edge references for the new 3 faces
		fTopLeft.SetDatas(eCenter_Top);
		fBot.SetDatas(eCenter_Left);
		fTopRight.SetDatas(eCenter_Right);

		// set the new edge and face references for the 3 bounding edges
		eTop_Left.nextLeftEdge = eLeft_Center;
		eTop_Left.leftFace = fTopLeft;
		eLeft_Right.nextLeftEdge = eRight_Center;
		eLeft_Right.leftFace = fBot;
		eRight_Top.nextLeftEdge = eTop_Center;
		eRight_Top.leftFace = fTopRight;

		// we remove the old face
		face.Dispose();
		this._faces.splice(this._faces.indexOf(face), 1);

		// add new bounds references for Delaunay restoring
		this.__centerVertex = vCenter;
		this.__edgesToCheck.push(eTop_Left);
		this.__edgesToCheck.push(eLeft_Right);
		this.__edgesToCheck.push(eRight_Top);

		return vCenter;
	}

	RestoreAsDelaunay(): void {
		var edge: DDLSEdge;
		while (this.__edgesToCheck.length) {
			edge = this.__edgesToCheck.shift();
			if (edge.isReal && !edge.isConstrained && !DDLSGeom2D.IsDelaunay(edge)) {
				if (edge.nextLeftEdge.destinationVertex == this.__centerVertex) {
					this.__edgesToCheck.push(edge.nextRightEdge);
					this.__edgesToCheck.push(edge.prevRightEdge);
				}
				else {
					this.__edgesToCheck.push(edge.nextLeftEdge);
					this.__edgesToCheck.push(edge.prevLeftEdge);
				}
				this.FlipEdge(edge);
			}
		}
	}

	// Delete a vertex IF POSSIBLE and then fill the hole with a new triangulation.
	// A vertex can be deleted if:
	// - it is free of constraint segment (no adjacency to any constrained edge)
	// - it is adjacent to exactly 2 contrained edges and is not an end point of any constraint segment
	DeleteVertex(vertex: DDLSVertex): Boolean {
		//trace("tryToDeleteVertex id", vertex.id);
		var i: number;
		var freeOfConstraint: Boolean;
		var iterEdges: IteratorFromVertexToOutgoingEdges = new IteratorFromVertexToOutgoingEdges();
		iterEdges.fromVertex = vertex;
		iterEdges.realEdgesOnly = false;
		var edge: DDLSEdge;
		var outgoingEdges: Array<DDLSEdge> = new Array<DDLSEdge>();

		freeOfConstraint = vertex.fromConstraintSegments.length == 0;

		//trace("  -> freeOfConstraint", freeOfConstraint);

		var bound: Array<DDLSEdge> = new Array<DDLSEdge>();
		if (freeOfConstraint) {
			while (edge = iterEdges.Next()) {
				outgoingEdges.push(edge);
				bound.push(edge.nextLeftEdge);
			}
		}
		else {
			// we check if the vertex is an end point of a constraint segment
			var edges: Array<DDLSEdge>;
			for (i = 0; i < vertex.fromConstraintSegments.length; i++) {
				edges = vertex.fromConstraintSegments[i].edges;
				if (edges[0].originVertex == vertex
					|| edges[edges.length - 1].destinationVertex == vertex) {
					//trace("  -> is end point of a constraint segment");
					return false;
				}
			}

			// we check the count of adjacent constrained edges
			var count: number = 0;
			while (edge = iterEdges.Next()) {
				outgoingEdges.push(edge);

				if (edge.isConstrained) {
					count++;
					if (count > 2) {
						//trace("  -> count of adjacent constrained edges", count);
						return false;
					}
				}
			}

			// if not disqualified, then we can process
			//trace("process vertex deletion");
			var boundA: Array<DDLSEdge> = new Array<DDLSEdge>();
			var boundB: Array<DDLSEdge> = new Array<DDLSEdge>();
			var constrainedEdgeA: DDLSEdge;
			var constrainedEdgeB: DDLSEdge;
			var edgeA: DDLSEdge = new DDLSEdge();
			var edgeB: DDLSEdge = new DDLSEdge();
			var realA: boolean;
			var realB: boolean;
			this._edges.push(edgeA);
			this._edges.push(edgeB);
			for (i = 0; i < outgoingEdges.length; i++) {
				edge = outgoingEdges[i];
				if (edge.isConstrained) {
					if (!constrainedEdgeA) {
						edgeB.SetDatas(edge.destinationVertex, edgeA, null, null, true, true);
						boundA.push(edgeA, edge.nextLeftEdge);
						boundB.push(edgeB);
						constrainedEdgeA = edge;
					}
					else if (!constrainedEdgeB) {
						edgeA.SetDatas(edge.destinationVertex, edgeB, null, null, true, true);
						boundB.push(edge.nextLeftEdge);
						constrainedEdgeB = edge;
					}
				}
				else {
					if (!constrainedEdgeA)
						boundB.push(edge.nextLeftEdge);
					else if (!constrainedEdgeB)
						boundA.push(edge.nextLeftEdge);
					else
						boundB.push(edge.nextLeftEdge);
				}
			}

			// keep infos about reality
			realA = constrainedEdgeA.leftFace.isReal;
			realB = constrainedEdgeB.leftFace.isReal;

			// we update the segments infos
			edgeA.fromConstraintSegments = constrainedEdgeA.fromConstraintSegments.slice(0);
			edgeB.fromConstraintSegments = edgeA.fromConstraintSegments;
			var index: number;
			for (i = 0; i < vertex.fromConstraintSegments.length; i++) {
				edges = vertex.fromConstraintSegments[i].edges;
				index = edges.indexOf(constrainedEdgeA);
				if (index != -1) {
					edges.splice(index - 1, 2, edgeA);
				}
				else {
					edges.splice(edges.indexOf(constrainedEdgeB) - 1, 2, edgeB);
				}
			}
		}

		// Deletion of old faces and edges
		var faceToDelete: DDLSFace;
		for (i = 0; i < outgoingEdges.length; i++) {
			edge = outgoingEdges[i];

			faceToDelete = edge.leftFace;
			this._faces.splice(this._faces.indexOf(faceToDelete), 1);
			faceToDelete.Dispose();

			edge.destinationVertex.edge = edge.nextLeftEdge;

			this._edges.splice(this._edges.indexOf(edge.oppositeEdge), 1);
			edge.oppositeEdge.Dispose();
			this._edges.splice(this._edges.indexOf(edge), 1);
			edge.Dispose();
		}

		this._vertices.splice(this._vertices.indexOf(vertex), 1);
		vertex.Dispose();

		// finally we triangulate
		if (freeOfConstraint) {
			//trace("trigger single hole triangulation");
			this.Triangulate(bound, true);
		}
		else {
			//trace("trigger dual holes triangulation");
			this.Triangulate(boundA, realA);
			this.Triangulate(boundB, realB);
		}

		//check();
		return true;
	}

	///// PRIVATE



	// untriangulate is usually used while a new edge insertion in order to delete the intersected edges
	// edgesList is a list of chained edges oriented from right to left
	private untriangulate(edgesList: Array<DDLSEdge>): void {
		// we clean useless faces and adjacent vertices
		var i: number;
		var verticesCleaned: Map<DDLSVertex, boolean> = new Map<DDLSVertex, boolean>();
		var currEdge: DDLSEdge;
		var outEdge: DDLSEdge;
		for (i = 0; i < edgesList.length; i++) {
			currEdge = edgesList[i];
			//
			if (!verticesCleaned.has(currEdge.originVertex)) {
				currEdge.originVertex.edge = currEdge.prevLeftEdge.oppositeEdge;
				verticesCleaned.set(currEdge.originVertex, true);
			}
			if (!verticesCleaned.has(currEdge.destinationVertex)) {
				currEdge.destinationVertex.edge = currEdge.nextLeftEdge;
				verticesCleaned.set(currEdge.destinationVertex, true);
			}
			//
			this._faces.splice(this._faces.indexOf(currEdge.leftFace), 1);
			currEdge.leftFace.Dispose();
			if (i == edgesList.length - 1) {
				this._faces.splice(this._faces.indexOf(currEdge.rightFace), 1);
				currEdge.rightFace.Dispose();
			}
			//
		}

		// finally we delete the intersected edges
		for (i = 0; i < edgesList.length; i++) {
			currEdge = edgesList[i];
			this._edges.splice(this._edges.indexOf(currEdge.oppositeEdge), 1);
			this._edges.splice(this._edges.indexOf(currEdge), 1);
			currEdge.oppositeEdge.Dispose();
			currEdge.Dispose();
		}
	}

	// triangulate is usually used to fill the hole after deletion of a vertex from mesh or after untriangulation
	// - bounds is the list of edges in CCW bounding the surface to retriangulate,
	private Triangulate(bound: Array<DDLSEdge>, isReal: boolean): void {
		if (bound.length < 2) {
			console.log("BREAK ! the hole has less than 2 edges");
			return;
		}
		// if the hole is a 2 edges polygon, we have a big problem
		else if (bound.length == 2) {
			//throw new Error("BREAK ! the hole has only 2 edges! " + "  - edge0: " + bound[0].originVertex.id + " -> " + bound[0].destinationVertex.id + "  - edge1: " +  bound[1].originVertex.id + " -> " + bound[1].destinationVertex.id);
			console.log("BREAK ! the hole has only 2 edges");
			console.log("  - edge0:", bound[0].originVertex.id, "->", bound[0].destinationVertex.id);
			console.log("  - edge1:", bound[1].originVertex.id, "->", bound[1].destinationVertex.id);
			return;
		}
		// if the hole is a 3 edges polygon:
		else if (bound.length == 3) {
			/*trace("the hole is a 3 edges polygon");
			trace("  - edge0:", bound[0].originVertex.id, "->", bound[0].destinationVertex.id);
			trace("  - edge1:", bound[1].originVertex.id, "->", bound[1].destinationVertex.id);
			trace("  - edge2:", bound[2].originVertex.id, "->", bound[2].destinationVertex.id);*/
			var f: DDLSFace = new DDLSFace();
			f.SetDatas(bound[0], isReal);
			this._faces.push(f);
			bound[0].leftFace = f;
			bound[1].leftFace = f;
			bound[2].leftFace = f;
			bound[0].nextLeftEdge = bound[1];
			bound[1].nextLeftEdge = bound[2];
			bound[2].nextLeftEdge = bound[0];
		}
		else // if more than 3 edges, we process recursively:
		{
			//trace("the hole has", bound.length, "edges");
			for (i = 0; i < bound.length; i++) {
				//trace("  - edge", i, ":", bound[i].originVertex.id, "->", bound[i].destinationVertex.id);
			}

			var baseEdge: DDLSEdge = bound[0];
			var vertexA: DDLSVertex = baseEdge.originVertex;
			var vertexB: DDLSVertex = baseEdge.destinationVertex;
			var vertexC: DDLSVertex;
			var vertexCheck: DDLSVertex;
			var circumcenter: DDLSPoint2D = new DDLSPoint2D();
			var radiusSquared: number;
			var distanceSquared: number;
			var isDelaunay: Boolean;
			var index: number;
			var i: number;
			for (i = 2; i < bound.length; i++) {
				vertexC = bound[i].originVertex;
				if (DDLSGeom2D.GetRelativePosition2(vertexC.pos.x, vertexC.pos.y, baseEdge) == 1) {
					index = i;
					isDelaunay = true;
					DDLSGeom2D.GetCircumcenter(vertexA.pos.x, vertexA.pos.y, vertexB.pos.x, vertexB.pos.y, vertexC.pos.x, vertexC.pos.y, circumcenter);
					radiusSquared = (vertexA.pos.x - circumcenter.x) * (vertexA.pos.x - circumcenter.x) + (vertexA.pos.y - circumcenter.y) * (vertexA.pos.y - circumcenter.y);
					// for perfect regular n-sides polygons, checking strict delaunay circumcircle condition is not possible, so we substract EPSILON to circumcircle radius:
					radiusSquared -= DDLSConstants.EPSILON_SQUARED;
					for (var j: number = 2; j < bound.length; j++) {
						if (j != i) {
							vertexCheck = bound[j].originVertex;
							distanceSquared = (vertexCheck.pos.x - circumcenter.x) * (vertexCheck.pos.x - circumcenter.x) + (vertexCheck.pos.y - circumcenter.y) * (vertexCheck.pos.y - circumcenter.y);
							if (distanceSquared < radiusSquared) {
								isDelaunay = false;
								break;
							}
						}
					}

					if (isDelaunay)
						break;
				}
			}

			if (!isDelaunay) {
				// for perfect regular n-sides polygons, checking delaunay circumcircle condition is not possible
				console.log("NO DELAUNAY FOUND");
				var s: String = "";
				for (i = 0; i < bound.length; i++) {
					s += bound[i].originVertex.pos.x + " , ";
					s += bound[i].originVertex.pos.y + " , ";
					s += bound[i].destinationVertex.pos.x + " , ";
					s += bound[i].destinationVertex.pos.y + " , ";
				}
				//trace(s);

				index = 2;
			}
			//trace("index", index, "on", bound.length);

			var edgeA: DDLSEdge;
			var edgeAopp: DDLSEdge;
			var edgeB: DDLSEdge;
			var edgeBopp: DDLSEdge;
			var boundA: Array<DDLSEdge>;
			var boundM: Array<DDLSEdge>;
			var boundB: Array<DDLSEdge>;

			if (index < (bound.length - 1)) {
				edgeA = new DDLSEdge();
				edgeAopp = new DDLSEdge();
				this._edges.push(edgeA, edgeAopp);
				edgeA.SetDatas(vertexA, edgeAopp, null, null, isReal, false);
				edgeAopp.SetDatas(bound[index].originVertex, edgeA, null, null, isReal, false);
				boundA = bound.slice(index);
				boundA.push(edgeA);
				this.Triangulate(boundA, isReal);
			}

			if (index > 2) {
				edgeB = new DDLSEdge();
				edgeBopp = new DDLSEdge();
				this._edges.push(edgeB, edgeBopp);
				edgeB.SetDatas(bound[1].originVertex, edgeBopp, null, null, isReal, false);
				edgeBopp.SetDatas(bound[index].originVertex, edgeB, null, null, isReal, false);
				boundB = bound.slice(1, index);
				boundB.push(edgeBopp);
				this.Triangulate(boundB, isReal);
			}

			boundM = new Array<DDLSEdge>();
			if (index == 2)
				boundM.push(baseEdge, bound[1], edgeAopp);
			else if (index == (bound.length - 1))
				boundM.push(baseEdge, edgeB, bound[index]);
			else
				boundM.push(baseEdge, edgeB, edgeAopp);
			this.Triangulate(boundM, isReal);
		}
	}

	Debug(): void {
		var i: number;
		for (i = 0; i < this.__vertices.length; i++) {
			console.log("-- vertex", this._vertices[i].id);
			console.log("  edge", this._vertices[i].edge.id, " - ", this._vertices[i].edge);
			console.log("  edge isReal:", this._vertices[i].edge.isReal);
		}
		for (i = 0; i < this._edges.length; i++) {
			console.log("-- edge", this._edges[i]);
			console.log("  isReal", this._edges[i].id, " - ", this._edges[i].isReal);
			console.log("  nextLeftEdge", this._edges[i].nextLeftEdge);
			console.log("  oppositeEdge", this._edges[i].oppositeEdge);
		}
	}

}