import { Graphics } from "cc";
import { RGBA8888Texture } from "../../../utils/RGBA8888Texture";
import { DDLSObject } from "../data/DDLSObject";
import { DDLSPotrace } from "../data/math/DDLSPotrace";
import { DDLSGraph } from "../data/graph/DDLSGraph";

export class DDLSBitmapObjectFactory {

	static buildFromBmpData(bmpData: RGBA8888Texture, scale: number = 1.0,
		debugBmp: RGBA8888Texture = null, debugShape: Graphics = null): DDLSObject {
		let i: number;
		let j: number;

		// OUTLINES STEP-LIKE SHAPES GENERATION
		let shapes: Array<Array<number>> = DDLSPotrace.BuildShapes(bmpData, debugBmp, debugShape);

		// GRAPHS OF POTENTIAL SEGMENTS GENERATION
		let graphs: Array<DDLSGraph> = new Array<DDLSGraph>();
		for (i = 0; i < shapes.length; i++) {
			graphs.push(DDLSPotrace.BuildGraph(shapes[i]));
		}

		// OPTIMIZED POLYGONS GENERATION
		let polygons: Array<Array<number>>  = new Array<Array<number>> ();
		for (i = 0; i < graphs.length; i++) {
			polygons.push(DDLSPotrace.BuildPolygon(graphs[i], debugShape));
		}
		//精确路径 但是生成的三角形多卡
		//			for (i=0 ; i<shapes.length ; i++)
		//			{
		//				let sp:Vector.<Number> = shapes[i];
		//				polygons[i] = new Vector.<Number>();
		//				let nowDir:int = 0;
		//				for(j = 0; j < sp.length - 2; j+=2)
		//				{
		//					if(nowDir == 0)
		//					{
		//						polygons[i].push(sp[j]);
		//						polygons[i].push(sp[j+1]);
		//						
		//						if(sp[j]==sp[j+2])
		//						{
		//							nowDir = 1;
		//						}
		//						else if(sp[j+1]==sp[j+3])
		//						{
		//							nowDir = 2;
		//						}
		//					}
		//					else
		//					{
		//						if(sp[j]==sp[j+2])
		//						{
		//							if(nowDir == 1)
		//							{
		//								
		//							}
		//							else
		//							{
		//								polygons[i].push(sp[j]);
		//								polygons[i].push(sp[j+1]);
		//								nowDir = 1;
		//							}
		//						}
		//						else if(sp[j+1]==sp[j+3])
		//						{
		//							if(nowDir == 2)
		//							{
		//								
		//							}
		//							else
		//							{
		//								polygons[i].push(sp[j]);
		//								polygons[i].push(sp[j+1]);
		//								nowDir = 2;
		//							}
		//						}
		//					}
		//				}
		//				polygons[i].push(sp[j]);
		//				polygons[i].push(sp[j+1]);
		//			}

		// OBJECT GENERATION
		let obj: DDLSObject = new DDLSObject();
		for (i = 0; i < polygons.length; i++) {
			for (j = 0; j < polygons[i].length - 2; j += 2) {
				obj.coordinates.push(polygons[i][j] * scale, polygons[i][j + 1] * scale, polygons[i][j + 2] * scale, polygons[i][j + 3] * scale);
				//console.log(polygons[i][j], polygons[i][j+1], polygons[i][j+2], polygons[i][j+3]);
			}

			obj.coordinates.push(polygons[i][0] * scale, polygons[i][1] * scale, polygons[i][j] * scale, polygons[i][j + 1] * scale);
			//console.log(polygons[i][0], polygons[i][1], polygons[i][j], polygons[i][j+1]);
		}

		return obj;
	}

}