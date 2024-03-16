import { Color, Graphics, Label, Node, UITransform, Vec3, color } from "cc";
import { DDLSEntityAI } from "../ai/DDLSEntityAI";
import { DDLSEdge } from "../data/DDLSEdge";
import { DDLSFace } from "../data/DDLSFace";
import { DDLSMesh } from "../data/DDLSMesh";
import { DDLSVertex } from "../data/DDLSVertex";
import { IteratorFromMeshToVertices } from "../iterators/IteratorFromMeshToVertices";
import { IteratorFromVertexToIncomingEdges } from "../iterators/IteratorFromVertexToIncomingEdges";

export class DDLSSimpleView {

    public colorEdges: number = 0x999999;
    public colorConstraints: number = 0xFF0000;
    public colorVertices: number = 0x0000FF;
    public colorPaths: number = 0xFF00FF;
    public colorEntities: number = 0x00FF00;

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

    private _surface: Node;
    private _surfaceGraphics: Graphics;

    private _showVerticesIndices: boolean = false;

    constructor() {
        this._edges = new Node("edges");
        this._edgesGraphics = this._edges.addComponent(Graphics);

        this._constraints = new Node("constraints");
        this._constraintsGraphics = this._constraints.addComponent(Graphics);

        this._vertices = new Node("vertices");
        this._constraintsGraphics = this._vertices.addComponent(Graphics);

        this._entities = new Node("entities");
        this._pathsGraphics = this._vertices.addComponent(Graphics);


        this._paths = new Node("paths");
        this._pathsGraphics = this._vertices.addComponent(Graphics);

        this._surface = new Node("surface");
        this._surfaceGraphics = this._vertices.addComponent(Graphics);

        this._surface.addChild(this._edges);
        this._surface.addChild(this._constraints);
        this._surface.addChild(this._vertices);
        this._surface.addChild(this._paths);
        this._surface.addChild(this._entities);
    }

    get surface(): Node {
        return this._surface;
    }

    clean(): void {
        this._surfaceGraphics.clear();
        this._edgesGraphics.clear();
        this._constraintsGraphics.clear();
        this._verticesGraphics.clear();


        this._vertices.removeAllChildren();
    }

    DrawMesh(mesh: DDLSMesh): void {
        this.clean();

        this._surfaceGraphics.lineWidth = 0;
        this._surfaceGraphics.color = this.GetColor(0x000000);
        this._surfaceGraphics.fill();

        this._surfaceGraphics.fillColor = this.GetColor(0x000000);
        this._surfaceGraphics.lineWidth = 1;
        this._surfaceGraphics.color = this.GetColor(0xFF0000);
        this._surfaceGraphics.rect(0, 0, mesh.width, mesh.height);
        this._surfaceGraphics.fill();

        var vertex: DDLSVertex;
        var incomingEdge: DDLSEdge;
        var holdingFace: DDLSFace;

        var iterVertices: IteratorFromMeshToVertices;
        iterVertices = new IteratorFromMeshToVertices();
        iterVertices.fromMesh = mesh;
        //
        var iterEdges: IteratorFromVertexToIncomingEdges;
        iterEdges = new IteratorFromVertexToIncomingEdges();
        var dictVerticesDone: Map<DDLSVertex, boolean> = new Map<DDLSVertex, boolean>();
        //
        while (vertex = iterVertices.Next()) {
            dictVerticesDone.set(vertex, true);
            if (!this.VertexIsInsideAABB(vertex, mesh))
                continue;

            this._verticesGraphics.lineWidth = 1;
            this._verticesGraphics.color = this.GetColor(this.colorVertices);

            this._verticesGraphics.circle(vertex.pos.x, vertex.pos.y, 0.5);
            this._verticesGraphics.fill();

            if (this._showVerticesIndices) {
                let tfNode = new Node(vertex.id.toString());
                var tf = tfNode.addComponent(Label);
                let trans = tfNode.addComponent(UITransform);
                tf.string = vertex.id.toString();
                tfNode.setPosition(new Vec3(vertex.pos.x + 5, vertex.pos.y + 5));
                trans.width = trans.height = 20;
                this._vertices.addChild(tfNode);
            }

            iterEdges.fromVertex = vertex;
            while (incomingEdge = iterEdges.Next()) {
                if (!dictVerticesDone.has(incomingEdge.originVertex)) {
                    if (incomingEdge.isConstrained) {
                        this._constraintsGraphics.lineWidth = 2;
                        this._constraintsGraphics.color = this.GetColor(this.colorConstraints);
                        this._constraintsGraphics.moveTo(incomingEdge.originVertex.pos.x, incomingEdge.originVertex.pos.y);
                        this._constraintsGraphics.lineTo(incomingEdge.destinationVertex.pos.x, incomingEdge.destinationVertex.pos.y);
                    }
                    else {
                        this._constraintsGraphics.lineWidth = 1;
                        this._constraintsGraphics.color = this.GetColor(this.colorEdges);
                        this._constraintsGraphics.moveTo(incomingEdge.originVertex.pos.x, incomingEdge.originVertex.pos.y);
                        this._constraintsGraphics.lineTo(incomingEdge.destinationVertex.pos.x, incomingEdge.destinationVertex.pos.y);
                    }
                }
            }
        }
    }

    private GetColor(value: number): Color {
        let r = ((this.colorVertices >> 16) & 0xff);
        let g = ((this.colorVertices >> 8) & 0xff);
        let b = ((this.colorVertices) & 0xff);
        let a = ((this.colorVertices >> 24) & 0xff);
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

        for (var i = 0; i < vEntities.length; i++) {
            this.DrawEntity(vEntities[i], false);
        }
    }

    DrawPath(path: Array<number>, cleanBefore: boolean = true): void {
        if (cleanBefore)
            this._pathsGraphics.clear();

        if (path.length == 0)
            return;

        this._pathsGraphics.lineWidth = 1.5;
        this._pathsGraphics.color = this.GetColor(this.colorPaths);
        this._pathsGraphics.moveTo(path[0], path[1]);
        for (var i = 2; i < path.length; i += 2)
            this._pathsGraphics.lineTo(path[i], path[i + 1]);
    }

    private VertexIsInsideAABB(vertex: DDLSVertex, mesh: DDLSMesh): Boolean {
        if (vertex.pos.x < 0 || vertex.pos.x > mesh.width || vertex.pos.y < 0 || vertex.pos.y > mesh.height)
            return false;
        else
            return true;
    }
}
