import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
// scene.add(new AxesHelper());

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("./textures/matcaps/8.png");

/**
 * Object
 */
//font loader
// const fontLoader = new THREE.FontLoader();
const fontLoader = new FontLoader();

const material = new THREE.MeshMatcapMaterial();
// const material = new THREE.MeshPhongMaterial();
// material.color = 0xff0000;
material.matcap = matcapTexture;

// fontLoader.load("./fonts/Material Icons_Regular.json", (font) => {
fontLoader.load("./fonts/helvetiker_regular.typeface.json", (font) => {
  console.log("font loaded");
  const textVar = `Grzegorz Latocha
  Three.js - journey`;
  let textGeometry = new TextGeometry(textVar, {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 8,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  //   textGeometry.deleteAttribute("normal");
  //   textGeometry.deleteAttribute("uv");
  //   textGeometry = mergeVertices(textGeometry);
  //   textGeometry.computeVertexNormals();
  //   textGeometry.computeBoundingBox();
  textGeometry.center();

  const text = new THREE.Mesh(textGeometry, material);
  scene.add(text);
});
// const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial());
console.time("donut");
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
const donutArr = [];
for (let i = 0; i < 200; i++) {
  donutGeometry.rotateZ(Math.random() * Math.PI * 2);
  donutGeometry.rotateY(Math.random() * Math.PI * 2);
  const donut = new THREE.Mesh(donutGeometry.clone(), material);
  donut.position.x = (Math.random() - 0.5) * 10;
  donut.position.y = (Math.random() - 0.5) * 10;
  donut.position.z = (Math.random() - 0.5) * 10;
  donut.rotation.x = Math.random() * Math.PI * 2;
  donut.rotation.y = Math.random() * Math.PI * 2;
  const scale = Math.random() + 0.2;
  donut.scale.set(scale, scale, scale);
  donutArr.push(donut);
  //scene.add(donut);
}
donutArr.forEach((d) => {
  scene.add(d);
});
console.timeEnd("donut");

// scene.add(cube);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//LIGHTS
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

// const pointLight = new THREE.PointLight(0xffffff, 0.5);
// pointLight.position.x = 2;
// pointLight.position.y = 2;
// pointLight.position.z = 2;
// scene.add(ambientLight);
// scene.add(pointLight);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.x = -1;
camera.position.y = 1;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

console.log("scene :>> ", scene);
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //animate donuts
  donutArr.forEach((donut, index) => {
    donut.translateZ(0.005);
    // donut.rotation.x += Math.random() * 0.02;
    // donut.rotation.y += Math.random() * 0.02;
    // donut.rotation.z += Math.random() * 0.02;
    const maxPos = 5.0;
    if (Math.abs(donut.position.x) > maxPos || Math.abs(donut.position.y) > maxPos) {
      //   console.log(`donut ${index} bounced X or Y`);
      donut.rotation.y += Math.PI;
      //      donut.rotation.y = Math.random() * 2 * Math.PI;
    }
    if (Math.abs(donut.position.z) > maxPos) {
      //   console.log(`donut ${index} bounced Z`);
      donut.rotation.x += Math.PI;
      //      donut.rotation.y = Math.random() * 2 * Math.PI;
    }
  });

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
