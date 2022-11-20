import * as PIXI from "pixi.js";
import { Coordinate } from "./core/Coordinate";

export class Camera {
  coord: Coordinate;
  viewMatrix: PIXI.Matrix;

  constructor(coord: Coordinate) {
    this.coord = coord;
  }

  updateView() {
    this.viewMatrix = new PIXI.Matrix();
    this.viewMatrix.translate(this.coord.x, this.coord.y);
  }
}
