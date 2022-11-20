import { Coordinate } from "@/core/Coordinate";
import { Block } from "@/world/Block";
import { Chunk } from "@/world/Chunk";
import { MaterialType } from "@/world/MaterialType";

export class WorldGenerator {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  generateChunk(chunkCoord: Coordinate): Chunk {
    let chunk = new Chunk(chunkCoord);

    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 64; x++) {
        let block: Block;
        let base = Math.round(5 * Math.sin(x / 5) + 20 + x / 5);

        if (y == 0) {
          block = new Block({ materialType: MaterialType.BEDROCK });
        } else if (y == base) {
          block = new Block({ materialType: MaterialType.GRASS });
        } else if (y > base) {
          block = new Block({ materialType: MaterialType.AIR });
        } else {
          block = new Block({ materialType: MaterialType.DIRT });
        }
        chunk.setBlock(new Coordinate(x, y), block);
      }
    }
    return chunk;
  }
}
