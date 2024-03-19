import { Graphics, Vec2, color } from "cc";
import { DDLSGraph } from "../graph/DDLSGraph";
import { DDLSGraphEdge } from "../graph/DDLSGraphEdge";
import { DDLSGraphNode } from "../graph/DDLSGraphNode";
import { DDLSGeom2D } from "./DDLSGeom2D";
import { DDLSPoint2D } from "./DDLSPoint2D";
import { RGBA8888Texture } from "../../../../utils/RGBA8888Texture";


export class DDLSPotrace {

	static maxDistance: number = 1;

	static BuildShapes(bmpData: RGBA8888Texture
		, debugBmp: RGBA8888Texture = null
		, debugShape: Graphics = null): Array<Array<number>> {
		// OUTLINES STEP-LIKE SHAPES GENERATION
		let shapes: Array<Array<number>> = new Array<Array<number>>();
		let dictPixelsDone: Map<string, boolean> = new Map<string, boolean>();
		for (let row = 1; row < bmpData.height - 1; row++) {
			for (let col = 0; col < bmpData.width - 1; col++) {
				if (bmpData.GetPixel(col, row) == 0xFFFFFF && bmpData.GetPixel(col + 1, row) < 0xFFFFFF) {
					if (!dictPixelsDone.has((col + 1) + "_" + row))
						shapes.push(this.BuildShape(bmpData, row, col + 1, dictPixelsDone, debugBmp, debugShape));
				}
			}
		}

		return shapes;
	}

	static BuildShape(bmpData: RGBA8888Texture, fromPixelRow: number, fromPixelCol: number, dictPixelsDone: Map<string, boolean>
		, debugBmp: RGBA8888Texture = null, debugShape: Graphics = null): Array<number> {
		let path: Array<number> = new Array<number>();
		let newX: number = fromPixelCol;
		let newY: number = fromPixelRow;
		path.push(newX, newY);
		dictPixelsDone.set(newX + "_" + newY, true);

		let curDir: Vec2 = new Vec2(0, 1);
		let newDir: Vec2 = new Vec2();
		let newPixelRow: number;
		let newPixelCol: number;
		let count: number = -1;
		while (true) {
			if (debugBmp) {
				debugBmp.SetPixel32(fromPixelCol, fromPixelRow, 0xFFFF0000);
			}

			// take the pixel at right
			newPixelRow = fromPixelRow + curDir.x + curDir.y;
			newPixelCol = fromPixelCol + curDir.x - curDir.y;
			// if the pixel is not white
			if (bmpData.GetPixel(newPixelCol, newPixelRow) < 0xFFFFFF) {
				// turn the direction right
				newDir.x = -curDir.y;
				newDir.y = curDir.x;
			}
			// if the pixel is white
			else {
				// take the pixel straight
				newPixelRow = fromPixelRow + curDir.y;
				newPixelCol = fromPixelCol + curDir.x;
				// if the pixel is not white
				if (bmpData.GetPixel(newPixelCol, newPixelRow) < 0xFFFFFF) {
					// the direction stays the same
					newDir.x = curDir.x;
					newDir.y = curDir.y;
				}
				// if the pixel is white
				else {
					// pixel stays the same
					newPixelRow = fromPixelRow;
					newPixelCol = fromPixelCol;
					// turn the direction left
					newDir.x = curDir.y;
					newDir.y = -curDir.x;
				}
			}
			newX = newX + curDir.x;
			newY = newY + curDir.y;

			if (newX == path[0] && newY == path[1]) {
				break;
			}
			else {
				path.push(newX);
				path.push(newY);
				dictPixelsDone.set(newX + "_" + newY, true);
				fromPixelRow = newPixelRow;
				fromPixelCol = newPixelCol;
				curDir.x = newDir.x;
				curDir.y = newDir.y;
			}

			count--;
			if (count == 0) {
				break;
			}
		}

		if (debugShape) {
			debugShape.lineWidth = 0.5;
			debugShape.color = color("#00FF00");
			debugShape.moveTo(path[0], path[1]);
			for (let i = 2; i < path.length; i += 2) {
				debugShape.lineTo(path[i], path[i + 1]);
			}
			debugShape.lineTo(path[0], path[1]);
		}

		return path;
	}

	public static BuildGraph(shape: Array<number>): DDLSGraph {
		let i: number;
		let graph: DDLSGraph = new DDLSGraph();
		let node: DDLSGraphNode;
		for (i = 0; i < shape.length; i += 2) {
			node = graph.InsertNode();
			node.data = new NodeData();
			node.data.index = i;
			node.data.point = new DDLSPoint2D(shape[i], shape[i + 1]);
		}

		let node1: DDLSGraphNode;
		let node2: DDLSGraphNode;
		let subNode: DDLSGraphNode;
		let distSqrd: number;
		let sumDistSqrd: number;
		let count: number;
		let isValid: boolean;
		let edge: DDLSGraphEdge;
		let edgeData: EdgeData;
		node1 = graph.node;
		while (node1) {
			node2 = node1.next ? node1.next : graph.node;
			while (node2 != node1) {
				isValid = true;
				subNode = node1.next ? node1.next : graph.node;
				count = 2;
				sumDistSqrd = 0;
				while (subNode != node2) {
					distSqrd = DDLSGeom2D.DistanceSquaredPointToSegment(subNode.data.point.x, subNode.data.point.y
						, node1.data.point.x, node1.data.point.y
						, node2.data.point.x, node2.data.point.y);
					if (distSqrd < 0)
						distSqrd = 0;
					if (distSqrd >= this.maxDistance) {
						//subNode not valid
						isValid = false;
						break;
					}

					count++;
					sumDistSqrd += distSqrd;
					subNode = subNode.next ? subNode.next : graph.node;
				}

				if (!isValid) {
					//segment not valid
					break;
				}

				edge = graph.InsertEdge(node1, node2);
				edgeData = new EdgeData();
				edgeData.sumDistancesSquared = sumDistSqrd;
				edgeData.length = node1.data.point.DistanceTo(node2.data.point);
				edgeData.nodesCount = count;
				edge.data = edgeData;

				node2 = node2.next ? node2.next : graph.node;
			}

			node1 = node1.next;
		}

		return graph;
	}

	static BuildPolygon(graph: DDLSGraph, debugShape: Graphics = null): Array<number> {
		let polygon: Array<number> = new Array<number>();

		let currNode: DDLSGraphNode;
		let minNodeIndex: number = Number.MAX_VALUE;
		let edge: DDLSGraphEdge;
		let score: number;
		let higherScore: number;
		let lowerScoreEdge: DDLSGraphEdge;
		currNode = graph.node;
		while (currNode.data.index < minNodeIndex) {
			minNodeIndex = currNode.data.index;

			polygon.push(currNode.data.point.x, currNode.data.point.y);

			higherScore = Number.MIN_VALUE;
			edge = currNode.outgoingEdge;
			while (edge) {
				score = edge.data.nodesCount - edge.data.length * Math.sqrt(edge.data.sumDistancesSquared / (edge.data.nodesCount));
				if (score > higherScore) {
					higherScore = score;
					lowerScoreEdge = edge;
				}

				edge = edge.rotNextEdge;
			}

			currNode = lowerScoreEdge.destinationNode;
		}

		if (DDLSGeom2D.GetDirection(polygon[polygon.length - 2], polygon[polygon.length - 1], polygon[0], polygon[1], polygon[2], polygon[3]) == 0) {
			polygon.shift();
			polygon.shift();
		}

		if (debugShape) {
			debugShape.lineWidth = 0.5;
			debugShape.color = color("#0000FF");
			debugShape.moveTo(polygon[0], polygon[1]);
			for (let i = 2; i < polygon.length; i += 2) {
				debugShape.lineTo(polygon[i], polygon[i + 1]);
			}
			debugShape.lineTo(polygon[0], polygon[1]);
		}

		return polygon;
	}

}


class EdgeData {
	sumDistancesSquared: number;
	length: number;
	nodesCount: number;
}

class NodeData {
	index: number;
	point: DDLSPoint2D;

	constructor() {

	}
}