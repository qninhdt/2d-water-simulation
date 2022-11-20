import { Coordinate } from "@/core/Coordinate";
import { Block } from "./Block";
import * as THREE from "three";
import { MaterialType, MaterialUtil } from "./MaterialType";
import { chunkShader } from "@/shader/chunkShader";
import { BufferAttribute } from "three";

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

function hash(coord: Coordinate) {
  return coord.x + (coord.y << 6);
}
export class Chunk {
  // chunk coordinate
  coord: Coordinate;

  blocks: Int8Array;

  solidMesh: THREE.Mesh;
  gridLines: THREE.Group;

  simulateWater: boolean;

  waterBlocks: Map<number, Coordinate>;

  constructor(coord: Coordinate) {
    this.coord = coord.clone();
    this.waterBlocks = new Map();
    this.blocks = new Int8Array(64 * 64);
    this.simulateWater = true;

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

    setInterval(this.updateWater.bind(this), 100);
  }

  update(deltaTime: number): void {}

  addWater(coord: Coordinate, size: number) {
    let coordId = hash(coord);

    if (this.waterBlocks.has(coordId)) {
      let oldBlock = new Block({ data: this.blocks[coord.y * 64 + coord.x] });
      let current = oldBlock.materialType - MaterialType.WATER_1 + 1;
      size = Math.min(8, current + size);
    }

    this.waterBlocks.set(coordId, coord);

    this.blocks[coord.y * 64 + coord.x] = new Block({
      materialType: MaterialType.WATER_1 + size - 1,
    }).getData();
  }

  getBlock(coord: Coordinate): Block {
    return new Block({ data: this.blocks[coord.y * 64 + coord.x] });
  }

  setBlock(coord: Coordinate, block: Block) {
    let oldBlock = new Block({ data: this.blocks[coord.y * 64 + coord.x] });
    if (MaterialUtil.isWater(block.materialType)) {
      this.waterBlocks.set(hash(coord), coord);
      // this.addWater(coord, block.materialType - MaterialType.WATER_1 + 1);
    } else {
      if (MaterialUtil.isWater(oldBlock.materialType)) {
        let coordId = hash(coord);
        this.waterBlocks.delete(coordId);
      }
    }
    this.blocks[coord.y * 64 + coord.x] = block.getData();
    // }
  }

  updateWater() {
    if (!this.simulateWater) return;

    let waterDelta: Map<number, [Coordinate, number]> = new Map();

    this.waterBlocks.forEach((coord, coordId) => {
      let block = this.getBlock(coord);
      let belowCoord = new Coordinate(coord.x, coord.y - 1);
      let belowCoordId = hash(belowCoord);
      let belowBlock = this.getBlock(belowCoord);

      if (
        (MaterialUtil.isWater(belowBlock.materialType) &&
          belowBlock.materialType != MaterialType.WATER_8) ||
        belowBlock.materialType == MaterialType.AIR
      ) {
        if (waterDelta.has(coordId)) {
          let old = waterDelta.get(coordId);
          waterDelta.set(coordId, [old[0], old[1] - 1]);
        } else {
          waterDelta.set(coordId, [coord, -1]);
        }
        if (waterDelta.has(belowCoordId)) {
          let old = waterDelta.get(belowCoordId);
          waterDelta.set(belowCoordId, [old[0], old[1] + 1]);
        } else {
          waterDelta.set(belowCoordId, [belowCoord, +1]);
        }
      }
    });

    waterDelta.forEach(([coord, delta], coordId) => {
      let block = this.getBlock(coord);
      if (block.materialType == MaterialType.AIR) {
        this.setBlock(
          coord,
          new Block({ materialType: MaterialType.WATER_1 + delta - 1 })
        );
      } else if (block.materialType + delta < MaterialType.WATER_1) {
        this.waterBlocks.delete(coordId);
        this.setBlock(coord, new Block({ materialType: MaterialType.AIR }));
      } else {
        if (delta == 0) console.log(1);
        this.setBlock(
          coord,
          new Block({ materialType: block.materialType + delta })
        );
      }
    });

    this.buildMesh();
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

    this.solidMesh.geometry.setAttribute(
      "vertexData",
      new BufferAttribute(new Float32Array(solidMeshVertices), 1)
    );

    this.solidMesh.geometry.setIndex(solidMeshIndices);
  }
}
