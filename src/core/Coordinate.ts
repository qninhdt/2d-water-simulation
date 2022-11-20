export class Coordinate {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  clone(): Coordinate {
    return new Coordinate(this.x, this.y);
  }
}
