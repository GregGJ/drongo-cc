import { Graphics, Sprite, color } from "cc";
import { DDLSConstants } from "../data/DDLSConstants";
import { DDLSEdge } from "../data/DDLSEdge";
import { DDLSFace } from "../data/DDLSFace";
import { DDLSMesh } from "../data/DDLSMesh";
import { DDLSVertex } from "../data/DDLSVertex";
import { DDLSGeom2D } from "../data/math/DDLSGeom2D";
import { DDLSPoint2D } from "../data/math/DDLSPoint2D";
import { DDLSEntityAI } from "./DDLSEntityAI";


export class DDLSFieldOfView {

	private _fromEntity: DDLSEntityAI;
	private _mesh: DDLSMesh;

	public _debug: Graphics;

	constructor() {

	}

	get fromEntity(): DDLSEntityAI {
		return this._fromEntity;
	}

	set fromEntity(value: DDLSEntityAI) {
		this._fromEntity = value;
	}

	set mesh(value: DDLSMesh) {
		this._mesh = value;
	}

	IsInField(targetEntity: DDLSEntityAI): Boolean {
		if (!this._mesh)
			throw new Error("Mesh missing");
		if (!this._fromEntity)
			throw new Error("From entity missing");

		var posX: number = this._fromEntity.x;
		var posY: number = this._fromEntity.y;
		var directionNormX: number = this._fromEntity.dirNormX;
		var directionNormY: number = this._fromEntity.dirNormY;
		var radius: number = this._fromEntity.radiusFOV;
		var angle: number = this._fromEntity.angleFOV;

		var targetX: number = targetEntity.x;
		var targetY: number = targetEntity.y;
		var targetRadius: number = targetEntity.radius

		var distSquared: number = (posX - targetX) * (posX - targetX) + (posY - targetY) * (posY - targetY);

		// if target is completely outside field radius
		if (distSquared >= (radius + targetRadius) * (radius + targetRadius)) {
			//trace("target is completely outside field radius");
			return false;
		}

		if (distSquared < targetRadius * targetRadius) {
			//trace("degenerate case if the field center is inside the target");
			return true;
		}

		var result: Array<number>;
		var leftTargetX: number;
		var leftTargetY: number;
		var rightTargetX: number;
		var rightTargetY: number;
		var leftTargetInField: Boolean;
		var rightTargetInField: Boolean;

		// we consider the 2 cicrles intersections
		result = new Array<number>();
		if (DDLSGeom2D.Intersections2Circles(posX, posY, radius, targetX, targetY, targetRadius, result)) {
			leftTargetX = result[0];
			leftTargetY = result[1];
			rightTargetX = result[2];
			rightTargetY = result[3];
		}

		var midX: number = 0.5 * (posX + targetX);
		var midY: number = 0.5 * (posY + targetY);
		if (result.length == 0 || (midX - targetX) * (midX - targetX) + (midY - targetY) * (midY - targetY) < (midX - leftTargetX) * (midX - leftTargetX) + (midY - leftTargetY) * (midY - leftTargetY)) {
			// we consider the 2 tangents from field center to target
			result.splice(0, result.length);
			DDLSGeom2D.TangentsPointToCircle(posX, posY, targetX, targetY, targetRadius, result);
			leftTargetX = result[0];
			leftTargetY = result[1];
			rightTargetX = result[2];
			rightTargetY = result[3];
		}

		if (this._debug) {
			this._debug.lineWidth = 1;
			this._debug.color = color("#0000FF");
			this._debug.circle(leftTargetX, leftTargetY, 2);
			this._debug.lineWidth = 1;
			this._debug.color = color("#FF0000");
			this._debug.circle(rightTargetX, rightTargetY, 2);
		}

		var dotProdMin: number = Math.cos(this._fromEntity.angleFOV / 2);
		// we compare the dots for the left point
		var leftX: number = leftTargetX - posX;
		var leftY: number = leftTargetY - posY;
		var lengthLeft: number = Math.sqrt(leftX * leftX + leftY * leftY);
		var dotLeft: number = (leftX / lengthLeft) * directionNormX + (leftY / lengthLeft) * directionNormY;
		// if the left point is in field
		if (dotLeft > dotProdMin) {
			//trace("the left point is in field");
			leftTargetInField = true;
		}
		else {
			leftTargetInField = false;
		}

		// we compare the dots for the right point
		var rightX: number = rightTargetX - posX;
		var rightY: number = rightTargetY - posY;
		var lengthRight: number = Math.sqrt(rightX * rightX + rightY * rightY);
		var dotRight: number = (rightX / lengthRight) * directionNormX + (rightY / lengthRight) * directionNormY;
		// if the right point is in field
		if (dotRight > dotProdMin) {
			//trace("the right point is in field");
			rightTargetInField = true;
		}
		else {
			rightTargetInField = false;
		}

		// if the left and right points are outside field
		if (!leftTargetInField && !rightTargetInField) {
			// we must check if the Left/right points are on 2 different sides
			if (DDLSGeom2D.GetDirection(posX, posY, posX + directionNormX, posY + directionNormY, leftTargetX, leftTargetY) == 1
				&& DDLSGeom2D.GetDirection(posX, posY, posX + directionNormX, posY + directionNormY, rightTargetX, rightTargetY) == -1) {
				//trace("the Left/right points are on 2 different sides");

			}
			else {
				// we abort : target is not in field
				return false;
			}
		}

		// we init the window
		if (!leftTargetInField || !rightTargetInField) {
			var p: DDLSPoint2D = new DDLSPoint2D();
			var dirAngle: number;
			dirAngle = Math.atan2(directionNormY, directionNormX);
			if (!leftTargetInField) {
				var leftFieldX: number = Math.cos(dirAngle - angle / 2);
				var leftFieldY: number = Math.sin(dirAngle - angle / 2);
				DDLSGeom2D.Intersections2segments(posX, posY, posX + leftFieldX, posY + leftFieldY
					, leftTargetX, leftTargetY, rightTargetX, rightTargetY
					, p, null, true);
				if (this._debug) {
					this._debug.lineWidth = 1;
					this._debug.color = color("#0000FF");
					this._debug.circle(p.x, p.y, 2);
				}
				leftTargetX = p.x;
				leftTargetY = p.y;
			}
			if (!rightTargetInField) {
				var rightFieldX: number = Math.cos(dirAngle + angle / 2);
				var rightFieldY: number = Math.sin(dirAngle + angle / 2);
				DDLSGeom2D.Intersections2segments(posX, posY, posX + rightFieldX, posY + rightFieldY
					, leftTargetX, leftTargetY, rightTargetX, rightTargetY
					, p, null, true);
				if (this._debug) {
					this._debug.lineWidth = 1;
					this._debug.color = color("#FF0000");
					this._debug.circle(p.x, p.y, 2);
				}
				rightTargetX = p.x;
				rightTargetY = p.y;
			}
		}

		if (this._debug) {
			this._debug.lineWidth = 1;
			this._debug.color = color("#000000");
			this._debug.moveTo(posX, posY);
			this._debug.lineTo(leftTargetX, leftTargetY);
			this._debug.lineTo(rightTargetX, rightTargetY);
			this._debug.lineTo(posX, posY);
		}
		// now we have a triangle called the window defined by: posX, posY, rightTargetX, rightTargetY, leftTargetX, leftTargetY

		// we set a dictionnary of faces done
		var facesDone: Map<DDLSFace, boolean> = new Map<DDLSFace, boolean>();
		// we set a dictionnary of edges done
		var edgesDone: Map<DDLSEdge, boolean> = new Map<DDLSEdge, boolean>();
		// we set the window wall
		var wall: Array<number> = new Array<number>();
		// we localize the field center
		var startObj: Object = DDLSGeom2D.LocatePosition(posX, posY, this._mesh);
		var startFace: DDLSFace;
		if (startObj instanceof DDLSFace)
			startFace = startObj as DDLSFace;
		else if (startObj instanceof DDLSEdge)
			startFace = (startObj as DDLSEdge).leftFace;
		else if (startObj instanceof DDLSVertex)
			startFace = (startObj as DDLSVertex).edge.leftFace;


		// we put the face where the field center is lying in open list
		var openFacesList: Array<DDLSFace> = new Array<DDLSFace>();
		var openFaces: Map<DDLSFace, boolean> = new Map<DDLSFace, boolean>();
		openFacesList.push(startFace);
		openFaces.set(startFace, true);

		var currentFace: DDLSFace;
		var currentEdge: DDLSEdge;
		var s1: DDLSPoint2D;
		var s2: DDLSPoint2D;
		var p1: DDLSPoint2D = new DDLSPoint2D()
		var p2: DDLSPoint2D = new DDLSPoint2D();
		var params: Array<number> = new Array<number>();
		var param1: number;
		var param2: number;
		var i: number;
		var index1: number;
		var index2: number;
		var edges: Array<DDLSEdge> = new Array<DDLSEdge>();
		// we iterate as long as we have new open facess
		while (openFacesList.length > 0) {
			// we pop the 1st open face: current face
			currentFace = openFacesList.shift();
			openFaces.set(currentFace, null);
			facesDone.set(currentFace, true);

			// for each non-done edges from the current face
			currentEdge = currentFace.edge;
			if (!edgesDone.has(currentEdge) && !edgesDone.has(currentEdge.oppositeEdge)) {
				edges.push(currentEdge);
				edgesDone.set(currentEdge, true);
			}
			currentEdge = currentEdge.nextLeftEdge;
			if (!edgesDone.has(currentEdge) && !edgesDone.has(currentEdge.oppositeEdge)) {
				edges.push(currentEdge);
				edgesDone.set(currentEdge, true);
			}
			currentEdge = currentEdge.nextLeftEdge;
			if (!edgesDone.has(currentEdge) && !edgesDone.has(currentEdge.oppositeEdge)) {
				edges.push(currentEdge);
				edgesDone.set(currentEdge, true);
			}

			while (edges.length > 0) {
				currentEdge = edges.pop();

				// if the edge overlap (interects or lies inside) the window
				s1 = currentEdge.originVertex.pos;
				s2 = currentEdge.destinationVertex.pos;
				if (DDLSGeom2D.ClipSegmentByTriangle(s1.x, s1.y, s2.x, s2.y, posX, posY, rightTargetX, rightTargetY, leftTargetX, leftTargetY, p1, p2)) {
					// if the edge if constrained
					if (currentEdge.isConstrained) {
						if (this._debug) {
							this._debug.lineWidth = 6;
							this._debug.color = color("#FFFF00");
							this._debug.moveTo(p1.x, p1.y);
							this._debug.lineTo(p2.x, p2.y);
						}

						// we project the constrained edge on the wall
						params.splice(0, params.length);
						DDLSGeom2D.Intersections2segments(posX, posY, p1.x, p1.y, leftTargetX, leftTargetY, rightTargetX, rightTargetY, null, params, true);
						DDLSGeom2D.Intersections2segments(posX, posY, p2.x, p2.y, leftTargetX, leftTargetY, rightTargetX, rightTargetY, null, params, true);
						param1 = params[1];
						param2 = params[3];
						if (param2 < param1) {
							param1 = param2;
							param2 = params[1];
						}
						/*if (_debug)
						{
							_debug.graphics.lineStyle(3, 0x00FFFF);
							_debug.graphics.moveTo(leftTargetX + param1*(rightTargetX-leftTargetX), leftTargetY + param1*(rightTargetY-leftTargetY));
							_debug.graphics.lineTo(leftTargetX + param2*(rightTargetX-leftTargetX), leftTargetY + param2*(rightTargetY-leftTargetY));
						}*/

						// we sum it to the window wall
						for (i = wall.length - 1; i >= 0; i--) {
							if (param2 >= wall[i])
								break;
						}
						index2 = i + 1;
						if (index2 % 2 == 0)
							wall.splice(index2, 0, param2);

						for (i = 0; i < wall.length; i++) {
							if (param1 <= wall[i])
								break;
						}
						index1 = i;
						if (index1 % 2 == 0) {
							wall.splice(index1, 0, param1);
							index2++;
						}
						else {
							index1--;
						}

						wall.splice(index1 + 1, index2 - index1 - 1);

						// if the window is totally covered, we stop and return false
						if (wall.length == 2
							&& -DDLSConstants.EPSILON < wall[0] && wall[0] < DDLSConstants.EPSILON
							&& 1 - DDLSConstants.EPSILON < wall[1] && wall[1] < 1 + DDLSConstants.EPSILON) {
							return false;
						}
					}

					// if the adjacent face is neither in open list nor in faces done dictionnary
					currentFace = currentEdge.rightFace;
					if (!openFaces.has(currentFace) && !facesDone.has(currentFace)) {
						// we add it in open list
						openFacesList.push(currentFace);
						openFaces.set(currentFace, true);
					}
				}
			}
		}

		if (this._debug) {
			this._debug.lineWidth = 3;
			this._debug.color = color("#00FFFF");
			for (i = 0; i < wall.length; i += 2) {
				this._debug.moveTo(leftTargetX + wall[i] * (rightTargetX - leftTargetX), leftTargetY + wall[i] * (rightTargetY - leftTargetY));
				this._debug.lineTo(leftTargetX + wall[i + 1] * (rightTargetX - leftTargetX), leftTargetY + wall[i + 1] * (rightTargetY - leftTargetY));
			}
		}
		// if the window is totally covered, we stop and return false
		/*if ( wall.length == 2
			&& -QEConstants.EPSILON < wall[0] && wall[0] < QEConstants.EPSILON
			&& 1-QEConstants.EPSILON < wall[1] && wall[1] < 1+QEConstants.EPSILON )
		{
			return false;
		}
		trace(wall);*/

		return true;
	}

}