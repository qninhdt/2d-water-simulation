import { Coordinate } from "@/core/Coordinate";

export enum MaterialType {
  AIR,
  GRASS,
  DIRT,
  SAND,
  STONE,
  BEDROCK,
}

export class MaterialUtil {
  static isOpaque(type: MaterialType): boolean {
    switch (type) {
      case MaterialType.GRASS:
      case MaterialType.DIRT:
      case MaterialType.SAND:
      case MaterialType.STONE:
      case MaterialType.BEDROCK:
        return true;
      default:
        return false;
    }
  }
  static getTextureCoord(type: MaterialType): [number, number] {
    switch (type) {
      case MaterialType.GRASS:
        return [0, 0];
      case MaterialType.DIRT:
        return [1, 0];
      case MaterialType.BEDROCK:
        return [2, 0];
      default:
        return [15, 15];
    }
  }
}
