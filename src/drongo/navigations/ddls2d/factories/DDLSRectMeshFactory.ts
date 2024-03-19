import { DDLSConstants } from "../data/DDLSConstants";
import { DDLSConstraintSegment } from "../data/DDLSConstraintSegment";
import { DDLSConstraintShape } from "../data/DDLSConstraintShape";
import { DDLSEdge } from "../data/DDLSEdge";
import { DDLSFace } from "../data/DDLSFace";
import { DDLSMesh } from "../data/DDLSMesh";
import { DDLSVertex } from "../data/DDLSVertex";


export class DDLSRectMeshFactory {

	static BuildRectangle(width: number, height: number): DDLSMesh {
		/*
		   TL
		  ----+-----+ TR
		\   |    /|
		\   |   / |
		\   |  /  |
		\   | /   |
		\   |/    |
		\   +-----+ BR
		\  BL     \
		\----------
		*/

		let vTL: DDLSVertex = new DDLSVertex();
		let vTR: DDLSVertex = new DDLSVertex();
		let vBR: DDLSVertex = new DDLSVertex();
		let vBL: DDLSVertex = new DDLSVertex();

		let eTL_TR: DDLSEdge = new DDLSEdge();
		let eTR_TL: DDLSEdge = new DDLSEdge();
		let eTR_BR: DDLSEdge = new DDLSEdge();
		let eBR_TR: DDLSEdge = new DDLSEdge();
		let eBR_BL: DDLSEdge = new DDLSEdge();
		let eBL_BR: DDLSEdge = new DDLSEdge();
		let eBL_TL: DDLSEdge = new DDLSEdge();
		let eTL_BL: DDLSEdge = new DDLSEdge();
		let eTR_BL: DDLSEdge = new DDLSEdge();
		let eBL_TR: DDLSEdge = new DDLSEdge();
		let eTL_BR: DDLSEdge = new DDLSEdge();
		let eBR_TL: DDLSEdge = new DDLSEdge();

		let fTL_BL_TR: DDLSFace = new DDLSFace();
		let fTR_BL_BR: DDLSFace = new DDLSFace();
		let fTL_BR_BL: DDLSFace = new DDLSFace();
		let fTL_TR_BR: DDLSFace = new DDLSFace();

		let boundShape: DDLSConstraintShape = new DDLSConstraintShape();
		let segTop: DDLSConstraintSegment = new DDLSConstraintSegment();
		let segRight: DDLSConstraintSegment = new DDLSConstraintSegment();
		let segBot: DDLSConstraintSegment = new DDLSConstraintSegment();
		let segLeft: DDLSConstraintSegment = new DDLSConstraintSegment();

		let mesh: DDLSMesh = new DDLSMesh(width, height);

		//

		let offset: number = DDLSConstants.EPSILON * 1000;
		vTL.pos.Set(0 - offset, 0 - offset);
		vTR.pos.Set(width + offset, 0 - offset);
		vBR.pos.Set(width + offset, height + offset);
		vBL.pos.Set(0 - offset, height + offset);

		vTL.SetDatas(eTL_TR);
		vTR.SetDatas(eTR_BR);
		vBR.SetDatas(eBR_BL);
		vBL.SetDatas(eBL_TL);

		eTL_TR.SetDatas(vTL, eTR_TL, eTR_BR, fTL_TR_BR, true, true);
		eTR_TL.SetDatas(vTR, eTL_TR, eTL_BL, fTL_BL_TR, true, true);
		eTR_BR.SetDatas(vTR, eBR_TR, eBR_TL, fTL_TR_BR, true, true);
		eBR_TR.SetDatas(vBR, eTR_BR, eTR_BL, fTR_BL_BR, true, true);
		eBR_BL.SetDatas(vBR, eBL_BR, eBL_TL, fTL_BR_BL, true, true);
		eBL_BR.SetDatas(vBL, eBR_BL, eBR_TR, fTR_BL_BR, true, true);
		eBL_TL.SetDatas(vBL, eTL_BL, eTL_BR, fTL_BR_BL, true, true);
		eTL_BL.SetDatas(vTL, eBL_TL, eBL_TR, fTL_BL_TR, true, true);
		eTR_BL.SetDatas(vTR, eBL_TR, eBL_BR, fTR_BL_BR, true, false);// diagonal edge
		eBL_TR.SetDatas(vBL, eTR_BL, eTR_TL, fTL_BL_TR, true, false);// diagonal edge
		eTL_BR.SetDatas(vTL, eBR_TL, eBR_BL, fTL_BR_BL, false, false);// imaginary edge
		eBR_TL.SetDatas(vBR, eTL_BR, eTL_TR, fTL_TR_BR, false, false);// imaginary edge

		fTL_BL_TR.SetDatas(eBL_TR);
		fTR_BL_BR.SetDatas(eTR_BL);
		fTL_BR_BL.SetDatas(eBR_BL, false);
		fTL_TR_BR.SetDatas(eTR_BR, false);

		// constraint relations datas
		vTL.fromConstraintSegments.push(segTop, segLeft);
		vTR.fromConstraintSegments.push(segTop, segRight);
		vBR.fromConstraintSegments.push(segRight, segBot);
		vBL.fromConstraintSegments.push(segBot, segLeft);

		eTL_TR.fromConstraintSegments.push(segTop);
		eTR_TL.fromConstraintSegments.push(segTop);
		eTR_BR.fromConstraintSegments.push(segRight);
		eBR_TR.fromConstraintSegments.push(segRight);
		eBR_BL.fromConstraintSegments.push(segBot);
		eBL_BR.fromConstraintSegments.push(segBot);
		eBL_TL.fromConstraintSegments.push(segLeft);
		eTL_BL.fromConstraintSegments.push(segLeft);

		segTop.edges.push(eTL_TR);
		segRight.edges.push(eTR_BR);
		segBot.edges.push(eBR_BL);
		segLeft.edges.push(eBL_TL);
		segTop.fromShape = boundShape;
		segRight.fromShape = boundShape;
		segBot.fromShape = boundShape;
		segLeft.fromShape = boundShape;
		boundShape.segments.push(segTop, segRight, segBot, segLeft);

		mesh.__vertices.push(vTL, vTR, vBR, vBL);
		mesh.__edges.push(eTL_TR, eTR_TL, eTR_BR, eBR_TR, eBR_BL, eBL_BR, eBL_TL, eTL_BL, eTR_BL, eBL_TR, eTL_BR, eBR_TL);
		mesh.__faces.push(fTL_BL_TR, fTR_BL_BR, fTL_BR_BL, fTL_TR_BR);
		mesh.__constraintShapes.push(boundShape);

		let securityRect: Array<number> = new Array<number>();
		securityRect.push(0, 0, width, 0);
		securityRect.push(width, 0, width, height);
		securityRect.push(width, height, 0, height);
		securityRect.push(0, height, 0, 0);
		mesh.clipping = false;
		mesh.InsertConstraintShape(securityRect);
		mesh.clipping = true;

		return mesh;
	}

}