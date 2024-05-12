import { Color, Graphics, Label, Node, UITransform, Vec3, color } from "cc";
import { DDLSEntityAI } from "../ai/DDLSEntityAI";
import { DDLSEdge } from "../data/DDLSEdge";
import { DDLSFace } from "../data/DDLSFace";
import { DDLSMesh } from "../data/DDLSMesh";
import { DDLSVertex } from "../data/DDLSVertex";
import { IteratorFromMeshToVertices } from "../iterators/IteratorFromMeshToVertices";
import { IteratorFromVertexToIncomingEdges } from "../iterators/IteratorFromVertexToIncomingEdges";

export class DDLSSimpleView extends Node {

    public colorEdges: number = 0x999999FF;
    public colorConstraints: number = 0xFF0000FF;
    public colorVertices: number = 0x0000FFFF;
    public colorPaths: number = 0xFF00FFFF;
    public colorEntities: number = 0x00FF00FF;
    /**
     * 反转Y轴坐标
     */
    mirrorY: boolean = true;

    private _edges: Node;
    private _edgesGraphics: Graphics;
    private _constraints: Node;
    private _constraintsGraphics: Graphics;

    private _vertices: Node;
    private _verticesGraphics: Graphics;

    private _paths: Node;
    private _pathsGraphics: Graphics;

    private _entities: Node;
    private _entitiesGraphics: Graphics;

    private _surfaceGraphics: Graphics;

    private _showVerticesIndices: boolean = false;

    constructor() {
        super("DebugView");
        this._edges = this.__createNode("edges");
        this._edgesGraphics = this._edges.addComponent(Graphics);

        this._constraints = this.__createNode("constraints");
        this._constraintsGraphics = this._constraints.addComponent(Graphics);

        this._vertices = this.__createNode("vertices");
        this._verticesGraphics = this._vertices.addComponent(Graphics);

        this._entities = this.__createNode("entities");
        this._entitiesGraphics = this._entities.addComponent(Graphics);


        this._paths = this.__createNode("paths");
        this._pathsGraphics = this._paths.addComponent(Graphics);

        this._surfaceGraphics = this.addComponent(Graphics);
        let trans = this.getComponent(UITransform);
        trans.anchorX = 0;
        trans.anchorY = 1;

        this.addChild(this._edges);
        this.addChild(this._constraints);
        this.addChild(this._vertices);
        this.addChild(this._paths);
        this.addChild(this._entities);
    }

    private __createNode(name: string): Node {
        let result = new Node(name);
        let trans = result.addComponent(UITransform);
        trans.anchorX = 0;
        trans.anchorY = 1;
        return result;
    }

    Clear(): void {
        this._surfaceGraphics.clear();
        this._edgesGraphics.clear();
        this._constraintsGraphics.clear();
        this._verticesGraphics.clear();


        this._vertices.removeAllChildren();
    }

    DrawMesh(mesh: DDLSMesh): void {
        this.Clear();

        this._surfaceGraphics.lineWidth = 1;
        this._surfaceGraphics.strokeColor.fromHEX('#FF0000FF');
        this._surfaceGraphics.fillColor.fromHEX('#00000000');
        this._surfaceGraphics.moveTo(0, 0);
        this._surfaceGraphics.lineTo(0, this.mirrorY ? -mesh.height : mesh.height);
        this._surfaceGraphics.lineTo(mesh.width, this.mirrorY ? -mesh.height : mesh.height);
        this._surfaceGraphics.lineTo(mesh.width, 0);
        this._surfaceGraphics.close();
        this._surfaceGraphics.stroke();
        this._surfaceGraphics.fill();

        let vertex: DDLSVertex;
        let incomingEdge: DDLSEdge;
        let holdingFace: DDLSFace;

        let iterVertices: IteratorFromMeshToVertices;
        iterVertices = new IteratorFromMeshToVertices();
        iterVertices.fromMesh = mesh;
        //
        let iterEdges: IteratorFromVertexToIncomingEdges;
        iterEdges = new IteratorFromVertexToIncomingEdges();
        let dictVerticesDone: Map<DDLSVertex, boolean> = new Map<DDLSVertex, boolean>();
        let constraintsFrist: boolean = true;
        let edgesFrist: boolean = true;
        //
        while (vertex = iterVertices.Next()) {
            dictVerticesDone.set(vertex, true);
            if (!this.VertexIsInsideAABB(vertex, mesh))
                continue;

            this._verticesGraphics.lineWidth = 1;
            this._verticesGraphics.fillColor = this.GetColor(this.colorVertices);

            this._verticesGraphics.circle(vertex.pos.x, this.mirrorY ? -vertex.pos.y : vertex.pos.y, 3);
            this._verticesGraphics.fill();

            if (this._showVerticesIndices) {
                let tfNode = new Node(vertex.id.toString());
                let tf = tfNode.addComponent(Label);
                let trans = tfNode.addComponent(UITransform);
                tf.string = vertex.id.toString();
                tfNode.setPosition(new Vec3(vertex.pos.x + 5, this.mirrorY ? -vertex.pos.y : vertex.pos.y + 5));
                trans.width = trans.height = 20;
                this._vertices.addChild(tfNode);
            }
            constraintsFrist = edgesFrist = true;
            iterEdges.fromVertex = vertex;
            while (incomingEdge = iterEdges.Next()) {
                if (!dictVerticesDone.has(incomingEdge.originVertex)) {
                    if (incomingEdge.isConstrained) {
                        this._constraintsGraphics.lineWidth = 3;
                        this._constraintsGraphics.strokeColor = this.GetColor(this.colorConstraints);
                        if (constraintsFrist) {
                            constraintsFrist = false;
                            this._constraintsGraphics.moveTo(incomingEdge.destinationVertex.pos.x, this.mirrorY ? -incomingEdge.destinationVertex.pos.y : incomingEdge.destinationVertex.pos.y);
                        } else {
                            this._constraintsGraphics.lineTo(incomingEdge.destinationVertex.pos.x, this.mirrorY ? -incomingEdge.destinationVertex.pos.y : incomingEdge.destinationVertex.pos.y);
                        }
                        this._constraintsGraphics.lineTo(incomingEdge.originVertex.pos.x, this.mirrorY ? -incomingEdge.originVertex.pos.y : incomingEdge.originVertex.pos.y);
                    }
                    else {
                        this._edgesGraphics.lineWidth = 2;
                        this._edgesGraphics.strokeColor = this.GetColor(this.colorEdges);
                        if (edgesFrist) {
                            edgesFrist = false;
                            this._edgesGraphics.moveTo(incomingEdge.destinationVertex.pos.x, this.mirrorY ? -incomingEdge.destinationVertex.pos.y : incomingEdge.destinationVertex.pos.y);
                        } else {
                            this._edgesGraphics.lineTo(incomingEdge.destinationVertex.pos.x, this.mirrorY ? -incomingEdge.destinationVertex.pos.y : incomingEdge.destinationVertex.pos.y);
                        }
                        this._edgesGraphics.lineTo(incomingEdge.originVertex.pos.x, this.mirrorY ? -incomingEdge.originVertex.pos.y : incomingEdge.originVertex.pos.y);
                    }
                }
            }
        }
        this._constraintsGraphics.stroke();
        this._edgesGraphics.stroke();
    }

    private GetColor(value: number): Color {
        let r = ((value >> 24) & 0xff);
        let g = ((value >> 16) & 0xff);
        let b = ((value >> 8) & 0xff);
        let a = ((value) & 0xff);
        return color(r, g, b, a);
    }

    DrawEntity(entity: DDLSEntityAI, cleanBefore: boolean = true): void {
        if (cleanBefore)
            this._entitiesGraphics.clear();


        this._entitiesGraphics.lineWidth = 0.5;
        this._entitiesGraphics.color = this.GetColor(this.colorEntities);
        this._entitiesGraphics.circle(entity.x, entity.y, entity.radius);
        this._entitiesGraphics.fill();
        if (entity.angleFOV > 0 && entity.radiusFOV > 0) {
            this._entitiesGraphics.lineWidth = 1;
            this._entitiesGraphics.color = this.GetColor(this.colorEntities);
            let dirAngle: number = Math.atan2(entity.dirNormY, entity.dirNormX);
            let leftFieldX: number = Math.cos(dirAngle - entity.angleFOV / 2);
            let leftFieldY: number = Math.sin(dirAngle - entity.angleFOV / 2);
            this._entitiesGraphics.moveTo(entity.x, entity.y);
            this._entitiesGraphics.lineTo(entity.x + leftFieldX * entity.radiusFOV, entity.y + leftFieldY * entity.radiusFOV);
            let rightFieldX: number = Math.cos(dirAngle + entity.angleFOV / 2);
            let rightFieldY: number = Math.sin(dirAngle + entity.angleFOV / 2);
            this._entitiesGraphics.moveTo(entity.x, entity.y);
            this._entitiesGraphics.lineTo(entity.x + rightFieldX * entity.radiusFOV, entity.y + rightFieldY * entity.radiusFOV);
        }
    }

    DrawEntities(vEntities: Array<DDLSEntityAI>, cleanBefore: boolean = true): void {
        if (cleanBefore)
            this._entitiesGraphics.clear();

        for (let i = 0; i < vEntities.length; i++) {
            this.DrawEntity(vEntities[i], false);
        }
    }

    DrawPath(path: Array<number>, cleanBefore: boolean = true): void {
        if (cleanBefore)
            this._pathsGraphics.clear();

        if (path.length == 0)
            return;

        this._pathsGraphics.lineWidth = 1.5;
        this._pathsGraphics.strokeColor = this.GetColor(this.colorPaths);
        this._pathsGraphics.moveTo(path[0], this.mirrorY ? -path[1] : path[1]);
        for (let i = 2; i < path.length; i += 2) {
            this._pathsGraphics.lineTo(path[i], this.mirrorY ? -path[i + 1] : path[i + 1]);
        }
        this._pathsGraphics.stroke();
    }

    private VertexIsInsideAABB(vertex: DDLSVertex, mesh: DDLSMesh): Boolean {
        if (vertex.pos.x < 0 || vertex.pos.x > mesh.width || vertex.pos.y < 0 || vertex.pos.y > mesh.height)
            return false;
        else
            return true;
    }
}
