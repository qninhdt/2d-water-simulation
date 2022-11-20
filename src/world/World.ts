import { Coordinate } from "@/core/Coordinate";
import { Block } from "@/world/Block";
import { Chunk } from "@/world/Chunk";
import { WorldGenerator } from "@/world/WorldGenerator";
import { MaterialType } from "./MaterialType";

export class World {
  chunks: Map<string, Chunk>;
  generator: WorldGenerator;
  scene: THREE.Scene;
  grid: boolean;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.chunks = new Map();
    this.generator = new WorldGenerator(123);
    this.grid = false;
  }

  placeBlock(coord: Coordinate, materialType: MaterialType) {
    let chunkCoord = new Coordinate(coord.x >> 6, coord.y >> 6);
    let localCoord = new Coordinate(coord.x & 63, coord.y & 63);
    let chunk = this.chunks.get(JSON.stringify(chunkCoord));

    if (chunk) {
      chunk.setBlock(localCoord, new Block({ materialType }));
      chunk.buildMesh();
    } else {
      throw Error(`Block at (${coord.x}, ${coord.y}) is not loaded`);
    }
  }

  breakBlock(coord: Coordinate) {
    let chunkCoord = new Coordinate(coord.x >> 6, coord.y >> 6);
    let localCoord = new Coordinate(coord.x & 63, coord.y & 63);
    let chunk = this.chunks.get(JSON.stringify(chunkCoord));

    if (chunk) {
      chunk.setBlock(localCoord, new Block({ materialType: MaterialType.AIR }));
      chunk.buildMesh();
    } else {
      throw Error(`Block at (${coord.x}, ${coord.y}) is not loaded`);
    }
  }

  update(deltaTime: number) {}

  loadChunk(chunkCoord: Coordinate) {
    let chunk = this.generator.generateChunk(chunkCoord);
    this.chunks.set(JSON.stringify(chunkCoord), chunk);
    chunk.buildMesh();

    this.scene.add(chunk.solidMesh);
  }

  removeChunk(chunkCoord: Coordinate) {
    this.scene.remove(this.chunks.get(JSON.stringify(chunkCoord)).solidMesh);
    this.chunks.delete(JSON.stringify(chunkCoord));
  }

  toggleGrid() {
    this.grid = !this.grid;

    if (this.grid) {
      this.chunks.forEach((chunk) => {
        this.scene.add(chunk.gridLines);
      });
    } else {
      this.chunks.forEach((chunk) => {
        this.scene.remove(chunk.gridLines);
      });
    }
  }
}
