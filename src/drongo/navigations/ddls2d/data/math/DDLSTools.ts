import { Vec2 } from "cc";
import { RGBA8888Texture } from "../../../../utils/RGBA8888Texture";
import { DDLSPotrace } from "./DDLSPotrace";
import { DDLSGraph } from "../graph/DDLSGraph";
import { DDLSMesh } from "../DDLSMesh";
import { DDLSEdge } from "../DDLSEdge";
import { DDLSConstraintSegment } from "../DDLSConstraintSegment";
import { DDLSRectMeshFactory } from "../../factories/DDLSRectMeshFactory";
import { DDLSVertex } from "../DDLSVertex";
import { DDLSFace } from "../DDLSFace";


export class DDLSTools {

	static ExtractMeshFromBitmap(bmpData: RGBA8888Texture, vertices: Array<Vec2>, triangles: Array<number>): void {
		let i: number;
		let j: number;

		// OUTLINES STEP-LIKE SHAPES GENERATION
		let shapes: Array<Array<number>> = DDLSPotrace.BuildShapes(bmpData);

		// GRAPHS OF POTENTIAL SEGMENTS GENERATION
		let graphs: Array<DDLSGraph> = new Array<DDLSGraph>();
		for (i = 0; i < shapes.length; i++) {
			graphs.push(DDLSPotrace.BuildGraph(shapes[i]));
		}

		// OPTIMIZED POLYGONS GENERATION
		let polygons: Array<Array<number>> = new Array<Array<number>>();
		for (i = 0; i < graphs.length; i++) {
			polygons.push(DDLSPotrace.BuildPolygon(graphs[i]));
		}

		// MESH GENERATION
		let mesh: DDLSMesh = DDLSRectMeshFactory.BuildRectangle(bmpData.width, bmpData.height);
		let edges: Array<DDLSEdge> = new Array<DDLSEdge>(); // WE KEEP TRACK OF 1 EDGE BY SHAPE
		let segment: DDLSConstraintSegment;
		for (i = 0; i < polygons.length; i++) {
			for (j = 0; j < polygons[i].length - 2; j += 2) {
				segment = mesh.InsertConstraintSegment(polygons[i][j], polygons[i][j + 1], polygons[i][j + 2], polygons[i][j + 3]);
				if (j == 0) {
					if (segment.edges[0].originVertex.pos.x == polygons[i][j] && segment.edges[0].originVertex.pos.y == polygons[i][j + 1])
						edges.push(segment.edges[0]);
					else
						edges.push(segment.edges[0].oppositeEdge);
				}
			}
			mesh.InsertConstraintSegment(polygons[i][0], polygons[i][1], polygons[i][j], polygons[i][j + 1]);
		}

		// FINAL EXTRACTION
		let indicesDict: Map<DDLSVertex, number> = new Map<DDLSVertex, number>();
		let vertex: DDLSVertex;
		let point: Vec2;
		for (i = 0; i < mesh.__vertices.length; i++) {
			vertex = mesh.__vertices[i];
			if (vertex.isReal
				&& vertex.pos.x > 0 && vertex.pos.x < bmpData.width
				&& vertex.pos.y > 0 && vertex.pos.y < bmpData.height) {
				point = new Vec2(vertex.pos.x, vertex.pos.y);
				vertices.push(point);
				indicesDict.set(vertex, vertices.length - 1);
			}
		}

		let facesDone: Map<DDLSFace, boolean> = new Map<DDLSFace, boolean>();
		let openFacesList: Array<DDLSFace> = new Array<DDLSFace>();
		for (i = 0; i < edges.length; i++) {
			openFacesList.push(edges[i].rightFace);
		}
		let currFace: DDLSFace;
		while (openFacesList.length > 0) {
			currFace = openFacesList.pop();
			if (facesDone.has(currFace))
				continue;

			triangles.push(indicesDict.get(currFace.edge.originVertex));
			triangles.push(indicesDict.get(currFace.edge.nextLeftEdge.originVertex));
			triangles.push(indicesDict.get(currFace.edge.nextLeftEdge.destinationVertex));

			if (!currFace.edge.isConstrained)
				openFacesList.push(currFace.edge.rightFace);
			if (!currFace.edge.nextLeftEdge.isConstrained)
				openFacesList.push(currFace.edge.nextLeftEdge.rightFace);
			if (!currFace.edge.prevLeftEdge.isConstrained)
				openFacesList.push(currFace.edge.prevLeftEdge.rightFace);

			facesDone.set(currFace, true);
		}
	}
}
