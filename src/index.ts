import * as THREE from "three";
import "normalize.css";
import "@assets/style.css";
import { World } from "@/world/World";
import { Coordinate } from "./core/Coordinate";
import { BlockOutline } from "./graphic/BlockOutline";
import { MaterialType } from "./world/MaterialType";
import { BlockMenu } from "./BlockMenu";

const wrapper = document.getElementById("game");
const blockOutline = new BlockOutline();
const blockMenu = new BlockMenu();

// init
const camera = new THREE.OrthographicCamera(
  wrapper.clientWidth / -2,
  wrapper.clientWidth / 2,
  wrapper.clientHeight / 2,
  wrapper.clientHeight / -2,
  0.1,
  1000
);

var cameraMaxSpeed = 64;
var cameraSpeedX = 0;
var cameraSpeedY = 0;

camera.position.x = 22;
camera.position.y = 25;
camera.position.z = 100;
camera.zoom = 2 ** 5;

camera.updateProjectionMatrix();

// animation
var clock = new THREE.Clock();
var delta = 0;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(
  Math.floor(wrapper.clientWidth),
  Math.floor(wrapper.clientHeight)
);

renderer.setClearColor(new THREE.Color("#dfe6e9"));

wrapper.appendChild(renderer.domElement);

function loop() {
  delta = clock.getDelta();
  camera.position.x += cameraSpeedX * delta;
  camera.position.y += cameraSpeedY * delta;
  renderer.render(scene, camera);

  requestAnimationFrame(loop);
}

window.addEventListener("resize", () => {
  camera.left = wrapper.clientWidth / -2;
  camera.right = wrapper.clientWidth / 2;
  camera.top = wrapper.clientHeight / 2;
  camera.bottom = wrapper.clientHeight / -2;
  camera.updateProjectionMatrix();
  renderer.setSize(
    Math.floor(wrapper.clientWidth),
    Math.floor(wrapper.clientHeight)
  );
});

window.addEventListener("wheel", (e) => {
  camera.zoom *= Math.exp(-e.deltaY / 1000);
  camera.zoom = Math.max(10, camera.zoom);
  camera.updateProjectionMatrix();
});

function getWorldCoordOfCursor(
  cursorX: number,
  cursorY: number
): [number, number] {
  let screenX = cursorX - wrapper.clientWidth / 2;
  let screenY = -(cursorY - wrapper.clientHeight / 2);
  let worldX = Math.floor(screenX / camera.zoom + camera.position.x);
  let worldY = Math.floor(screenY / camera.zoom + camera.position.y);
  return [worldX, worldY];
}

wrapper.addEventListener("mousemove", (e) => {
  let [worldX, worldY] = getWorldCoordOfCursor(e.clientX, e.clientY);
  blockOutline.setCoordinate(new Coordinate(worldX, worldY));
});

wrapper.addEventListener("mousedown", (e) => {
  let [worldX, worldY] = getWorldCoordOfCursor(e.clientX, e.clientY);
  if (e.button == 0) {
    world.breakBlock(new Coordinate(worldX, worldY));
  } else if (e.button == 2) {
    world.placeBlock(
      new Coordinate(worldX, worldY),
      blockMenu.selectingMaterialType
    );
  }
});

wrapper.addEventListener("contextmenu", (e) => {
  e.stopPropagation();
  e.preventDefault();
});

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "d":
      cameraSpeedX = cameraMaxSpeed;
      break;
    case "a":
      cameraSpeedX = -cameraMaxSpeed;
      break;
    case "w":
      cameraSpeedY = cameraMaxSpeed;
      break;
    case "s":
      cameraSpeedY = -cameraMaxSpeed;
      break;
  }
});

window.addEventListener("keypress", (e) => {
  if (e.key == "g") {
    world.toggleGrid();
  }
  if (e.key == "o") {
    world.chunks.forEach(
      (chunk) => (chunk.simulateWater = !chunk.simulateWater)
    );
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "d":
    case "a":
      cameraSpeedX = 0;
      break;
    case "w":
    case "s":
      cameraSpeedY = 0;
      break;
  }
});

const world = new World(scene);

// world.loadChunk(new Coordinate(-1, 0));
world.loadChunk(new Coordinate(0, 0));
// world.loadChunk(new Coordinate(1, 0));

loop();

world.toggleGrid();

scene.add(blockOutline);
