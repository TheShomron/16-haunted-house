import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//fog
const fog = new THREE.Fog("#262837", 1, 15);
scene.fog = fog;

/**
 * Textures
 */
//door
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("textures/door/alpha.jpg");
const doorNormalTexture = textureLoader.load("textures/door/normal.jpg");
const doorAmbiantTexture = textureLoader.load(
  "textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("textures/door/height.jpg");
const doorMetalnessTexture = textureLoader.load("textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("textures/door/roughness.jpg");

//walls
const brickColorTex = textureLoader.load("textures/bricks/color.jpg");
const brickAmbTex = textureLoader.load("textures/bricks/ambientOcclusion.jpg");
const brickNormalTex = textureLoader.load("textures/bricks/normal.jpg");
const brickRoughTex = textureLoader.load("textures/bricks/roughness.jpg");

//grass
const grassColorTex = textureLoader.load("textures/grass/color.jpg");
const grassAmbTex = textureLoader.load("textures/grass/ambientOcclusion.jpg");
const grassNormalTex = textureLoader.load("textures/grass/normal.jpg");
const grassRoughTex = textureLoader.load("textures/grass/roughness.jpg");
grassColorTex.repeat.set(8, 8);
grassAmbTex.repeat.set(8, 8);
grassNormalTex.repeat.set(8, 8);
grassRoughTex.repeat.set(8, 8);
grassColorTex.wrapS = THREE.RepeatWrapping;
grassAmbTex.wrapS = THREE.RepeatWrapping;
grassNormalTex.wrapS = THREE.RepeatWrapping;
grassRoughTex.wrapS = THREE.RepeatWrapping;
grassColorTex.wrapT = THREE.RepeatWrapping;
grassAmbTex.wrapT = THREE.RepeatWrapping;
grassNormalTex.wrapT = THREE.RepeatWrapping;
grassRoughTex.wrapT = THREE.RepeatWrapping;

/**
 * House
 */
// house group
const house = new THREE.Group();

//walls
const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: brickColorTex,
    aoMap: brickAmbTex,
    roughnessMap: brickRoughTex,
    normalMap: brickNormalTex,
  })
);
walls.geometry.setAttribute(
  //for aoMap
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = 1.25;
house.add(walls);

//roof
const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({
    color: "#b35f45",
  })
);
roof.position.y = 2.5 + 0.5;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

//door
const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbiantTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.geometry.setAttribute(
  //for aoMap
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.z = 2.001;
door.position.y = 1;
house.add(door);

//bushes
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: "#89c854",
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.1);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.5);
house.add(bush1, bush2, bush3, bush4);

//graves
const graves = new THREE.Group();

const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "grey" });

for (let i = 0; i < 20; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3.4 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, 0.4, z);
  grave.rotation.y = (Math.random() - 0.5) * 1;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.castShadow = true;

  graves.add(grave);
}

scene.add(graves);
scene.add(house);

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTex,
    aoMap: grassAmbTex,
    normalMap: grassNormalTex,
    roughnessMap: grassRoughTex,
  })
);
floor.geometry.setAttribute(
  //for aoMap
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

// door light
const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

//ghosts
const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);

const ghost2 = new THREE.PointLight("#00ffff", 2, 3);

const ghost3 = new THREE.PointLight("#ffff00", 2, 3);
scene.add(ghost1, ghost2, ghost3);

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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
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
renderer.setClearColor("#262837");

//shadows activate
moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;
walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;
floor.receiveShadow = true;

//optimaze shadows
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7
ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7
ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //ghosts
  const ghost1Angle = elapsedTime * 0.6;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime) * 3;

  const ghost2Angle = elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(ghost2Angle * 2.5);

  const ghost3Angle = elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime) * Math.sin(ghost2Angle * 2.5);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
