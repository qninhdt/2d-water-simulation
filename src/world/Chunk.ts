import { Coordinate } from "@/core/Coordinate";
import { Block } from "./Block";
import * as THREE from "three";
import { MaterialType, MaterialUtil } from "./MaterialType";
import { chunkShader } from "@/shader/chunkShader";

function getBlockVertexData(
  x: number,
  y: number,
  dx: number,
  dy: number,
  block: Block
): number {
  let data = 0;
  let [texCoordX, texCoordY] = MaterialUtil.getTextureCoord(block.materialType);

  texCoordY = 15 - texCoordY; // flip vertical

  // x: 6 bits
  // y: 6 bits
  // dx: 1 bit
  // dy: 1 bit
  // texcoord_x: 5 bits
  // texcoord_y: 5 bits

  // set x
  data |= x << 0;

  // set y
  data |= y << 6;

  // set dx
  data |= dx << 12;

  // set dy
  data |= dy << 13;

  // set texcoord_x
  data |= texCoordX << 14;

  // set texcoord_y
  data |= texCoordY << 19;

  return data;
}

export class Chunk {
  // chunk coordinate
  coord: Coordinate;

  blocks: Int8Array;

  solidMesh: THREE.Mesh;
  gridLines: THREE.Group;

  constructor(coord: Coordinate) {
    this.coord = coord.clone();
    this.blocks = new Int8Array(64 * 64);

    let solidGeometry = new THREE.BufferGeometry();
    solidGeometry.setAttribute(
      "vertexData",
      new THREE.BufferAttribute(new Float32Array([]), 1)
    );

    this.solidMesh = new THREE.Mesh(solidGeometry, chunkShader);
    this.solidMesh.frustumCulled = false;

    this.solidMesh.position.x += this.coord.x * 64;
    this.solidMesh.position.x += this.coord.y * 64;

    this.gridLines = new THREE.Group();

    this.gridLines.position.x += this.coord.x * 64;
    this.gridLines.position.x += this.coord.y * 64;

    for (let x = 0; x <= 64; ++x) {
      this.buildGridLine(x, 0, x, 64);
    }

    for (let y = 0; y <= 64; ++y) {
      this.buildGridLine(0, y, 64, y);
    }
  }

  update(deltaTime: number): void {}

  getBlock(coord: Coordinate): Block {
    return new Block({ data: this.blocks[coord.y * 64 + coord.x] });
  }

  setBlock(coord: Coordinate, block: Block) {
    this.blocks[coord.y * 64 + coord.x] = block.getData();
  }

  buildGridLine(x1: number, y1: number, x2: number, y2: number) {
    let lineGeomatry = new THREE.BufferGeometry();
    lineGeomatry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([x1, y1, 0, x2, y2, 0]), 3)
    );
    let lineMesh = new THREE.Line(
      lineGeomatry,
      new THREE.LineBasicMaterial({
        color: "rgb(0, 0, 0)",
      })
    );
    this.gridLines.add(lineMesh);
  }

  buildMesh() {
    let solidMeshVertices: number[] = [];
    let solidMeshIndices: number[] = [];
    for (let x = 0; x < 64; ++x) {
      for (let y = 0; y < 64; ++y) {
        let block = this.getBlock(new Coordinate(x, y));
        if (block.materialType != MaterialType.AIR) {
          let id = solidMeshVertices.length;
          solidMeshVertices.push(
            getBlockVertexData(x, y, 0, 0, block),
            getBlockVertexData(x, y, 1, 0, block),
            getBlockVertexData(x, y, 1, 1, block),
            getBlockVertexData(x, y, 0, 1, block)
          );
          solidMeshIndices.push(id + 0, id + 1, id + 2, id + 0, id + 2, id + 3);
        }
      }
    }

    (
      this.solidMesh.geometry.attributes.vertexData as THREE.BufferAttribute
    ).array = new Float32Array(solidMeshVertices);

    this.solidMesh.geometry.setIndex(solidMeshIndices);
  }
}
