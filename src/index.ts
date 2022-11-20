import * as THREE from "three";
import "normalize.css";
import "@assets/style.css";
import { World } from "@/world/World";
import { Coordinate } from "./core/Coordinate";

const wrapper = document.getElementById("game");

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

camera.position.x = 32;
camera.position.y = 32;
camera.position.z = 2;
camera.zoom = 80;

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

renderer.setClearColor(new THREE.Color(1, 1, 1));

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
  camera.zoom -= e.deltaY / 25;
  camera.zoom = Math.max(40, camera.zoom);
  camera.updateProjectionMatrix();
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

world.loadChunk(new Coordinate(-1, 0));
world.loadChunk(new Coordinate(0, 0));
world.loadChunk(new Coordinate(1, 0));

loop();
