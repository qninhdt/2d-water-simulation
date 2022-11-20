import { Coordinate } from "@/core/Coordinate";
import * as THREE from "three";

export class BlockOutline extends THREE.Mesh {
  constructor() {
    let geomatry = new THREE.BufferGeometry();
    geomatry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array([0, 0, 5, 1, 0, 5, 1, 1, 5, 0, 1, 5]),
        3
      )
    );
    geomatry.setIndex([0, 1, 2, 0, 2, 3]);
    super(
      geomatry,
      new THREE.MeshBasicMaterial({
        color: "black",
        transparent: true,
        opacity: 0.2,
      })
    );
  }
  setCoordinate(coord: Coordinate) {
    this.position.x = coord.x;
    this.position.y = coord.y;
  }
}
