import { Coordinate } from "@/core/Coordinate";

export enum MaterialType {
  AIR,
  GRASS,
  DIRT,
  SAND,
  STONE,
  BEDROCK,
  WATER_1,
  WATER_2,
  WATER_3,
  WATER_4,
  WATER_5,
  WATER_6,
  WATER_7,
  WATER_8,
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
      case MaterialType.WATER_8:
        return [0, 1];
      case MaterialType.WATER_7:
        return [1, 1];
      case MaterialType.WATER_6:
        return [2, 1];
      case MaterialType.WATER_5:
        return [3, 1];
      case MaterialType.WATER_4:
        return [4, 1];
      case MaterialType.WATER_3:
        return [5, 1];
      case MaterialType.WATER_2:
        return [6, 1];
      case MaterialType.WATER_1:
        return [7, 1];
    }
  }
  static getName(type: MaterialType): string {
    switch (type) {
      case MaterialType.GRASS:
        return "grass";
      case MaterialType.DIRT:
        return "dirt";
      case MaterialType.BEDROCK:
        return "bedrock";
      case MaterialType.SAND:
        return "sand";
      case MaterialType.WATER_1:
        return "water_1";
      case MaterialType.WATER_2:
        return "water_2";
      case MaterialType.WATER_3:
        return "water_3";
      case MaterialType.WATER_4:
        return "water_4";
      case MaterialType.WATER_5:
        return "water_5";
      case MaterialType.WATER_6:
        return "water_6";
      case MaterialType.WATER_7:
        return "water_7";
      case MaterialType.WATER_8:
        return "water_8";
      default:
        break;
    }
  }
  static isWater(type: MaterialType): boolean {
    return type >= MaterialType.WATER_1 && type <= MaterialType.WATER_8;
  }
}
