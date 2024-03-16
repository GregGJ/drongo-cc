import { Graphics } from "cc";
import { RGBA8888Texture } from "../../../utils/RGBA8888Texture";
import { DDLSMesh } from "../data/DDLSMesh";
import { DDLSPotrace } from "../data/math/DDLSPotrace";
import { DDLSGraph } from "../data/graph/DDLSGraph";
import { DDLSRectMeshFactory } from "./DDLSRectMeshFactory";


export class DDLSBitmapMeshFactory {

	static buildFromBmpData(bmpData: RGBA8888Texture
		, debugBmp: RGBA8888Texture = null
		, debugShape: Graphics = null): DDLSMesh {
		var i: number;
		var j: number;

		// OUTLINES STEP-LIKE SHAPES GENERATION
		var shapes: Array<Array<number>> = DDLSPotrace.BuildShapes(bmpData, debugBmp, debugShape);

		// GRAPHS OF POTENTIAL SEGMENTS GENERATION
		var graphs: Array<DDLSGraph> = new Array<DDLSGraph>();
		for (i = 0; i < shapes.length; i++) {
			graphs.push(DDLSPotrace.BuildGraph(shapes[i]));
		}

		// OPTIMIZED POLYGONS GENERATION
		var polygons: Array<Array<number>> = new Array<Array<number>>();
		for (i = 0; i < graphs.length; i++) {
			polygons.push(DDLSPotrace.BuildPolygon(graphs[i], debugShape));
		}

		// MESH GENERATION
		var mesh: DDLSMesh = DDLSRectMeshFactory.BuildRectangle(bmpData.width, bmpData.height);
		for (i = 0; i < polygons.length; i++) {
			for (j = 0; j < polygons[i].length - 2; j += 2)
				mesh.InsertConstraintSegment(polygons[i][j], polygons[i][j + 1], polygons[i][j + 2], polygons[i][j + 3]);
			mesh.InsertConstraintSegment(polygons[i][0], polygons[i][1], polygons[i][j], polygons[i][j + 1]);
		}

		return mesh;
	}

}