import { Coordinate } from "@/core/Coordinate";
import { Block } from "@/world/Block";
import { Chunk } from "@/world/Chunk";
import { WorldGenerator } from "@/world/WorldGenerator";

export class World {
  chunks: Map<Coordinate, Chunk>;
  generator: WorldGenerator;
  scene: THREE.Scene;
  grid: boolean;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.chunks = new Map();
    this.generator = new WorldGenerator(123);
    this.grid = false;
  }

  update(deltaTime: number) {}

  loadChunk(chunkCoord: Coordinate) {
    let chunk = this.generator.generateChunk(chunkCoord);
    this.chunks.set(chunkCoord, chunk);
    chunk.buildMesh();

    this.scene.add(chunk.solidMesh);
  }

  removeChunk(chunkCoord: Coordinate) {
    this.scene.remove(this.chunks.get(chunkCoord).solidMesh);
    this.chunks.delete(chunkCoord);
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
