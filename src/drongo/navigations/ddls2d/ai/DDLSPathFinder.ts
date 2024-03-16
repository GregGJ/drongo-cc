import { DDLSEdge } from "../data/DDLSEdge";
import { DDLSFace } from "../data/DDLSFace";
import { DDLSMesh } from "../data/DDLSMesh";
import { DDLSGeom2D } from "../data/math/DDLSGeom2D";
import { DDLSAStar } from "./DDLSAStar";
import { DDLSFunnel } from "./DDLSFunnel";


export class DDLSPathFinder {

	private _mesh: DDLSMesh;
	private _astar: DDLSAStar;
	private _funnel: DDLSFunnel;
	//		private var _entity:DDLSEntityAI;
	private _radius: number;


	private __listFaces: Array<DDLSFace>;
	private __listEdges: Array<DDLSEdge>;

	constructor() {
		this._astar = new DDLSAStar();
		this._funnel = new DDLSFunnel();

		this.__listFaces = new Array<DDLSFace>();
		this.__listEdges = new Array<DDLSEdge>();
	}

	Dispose(): void {
		this._mesh = null;
		this._astar.Dispose();
		this._astar = null;
		this._funnel.Dispose();
		this._funnel = null;
		this.__listEdges = null;
		this.__listFaces = null;
	}

	/*		 get entity():DDLSEntityAI
			{
				return _entity;
			}
	
			 set entity(value:DDLSEntityAI):void
			{
				_entity = value;
			}*/

	get mesh(): DDLSMesh {
		return this._mesh;
	}

	set mesh(value: DDLSMesh) {
		this._mesh = value;
		this._astar.mesh = this._mesh;
	}

	FindPath(startX: number, startY: number, toX: number, toY: number, resultPath: Array<number>, radius: number = 1): void {
		resultPath.splice(0, resultPath.length);

		if (!this._mesh)
			throw new Error("Mesh missing");
		/*			if (!_entity)
						throw new Error("Entity missing");*/

		if (DDLSGeom2D.IsCircleIntersectingAnyConstraint(toX, toY, radius, this._mesh)) {
			return;
		}

		this._astar.radius = radius;
		this._funnel.radius = radius;

		this.__listFaces.splice(0, this.__listFaces.length);
		this.__listEdges.splice(0, this.__listEdges.length);
		this._astar.FindPath(startX, startY, toX, toY, this.__listFaces, this.__listEdges);
		if (this.__listFaces.length == 0) {
			console.log("DDLSPathFinder this.__listFaces.length == 0");
			return;
		}
		this._funnel.FindPath(startX, startY, toX, toY, this.__listFaces, this.__listEdges, resultPath);
	}

}