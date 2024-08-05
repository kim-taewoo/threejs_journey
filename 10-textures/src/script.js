import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);

/**
 * vertices 개수
    https://www.reddit.com/r/threejs/comments/s71axy/comment/ht7lwlj/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&u
    geometry.attributes.uv 를 보면, 단순 큐브의 count 가 24 이다.
    이는 큐브의 6개의 면이 각각 4개의 정점을 가지고 있기 때문이다.
    즉 6*4 = 24 가 되는 것이다.

    중복되는 vertices 가 있는 이유는 각 vertex는 원래 normal data 를 가지고 있고,
    이 추가적인 3차원 데이터는 보통 object 를 부드럽게 보이도록 하는데 사용된다.
    아무튼 이 계산을 위해 인접한 면마다 별도의 normal 값, 즉 3개의 vertex 가 필요하다.

    한편 geometry.index 를 보면, 큐브의 인덱스가 36개로 되어있다.
    이는 큐브의 6개의 면이 각각 2개의 삼각형을 가지고 있어 삼각형이 총 12개가 되고,
    각 삼각형이 3개의 정점을 가지고 있기 때문에 12*3 = 36 이 되는 것이다.
    여기서 index 는 어떻게 삼각형을 만들어야 할지를(그룹지어 면을 만들지를) 알려주는 역할을 한다.
 */
console.log(geometry.attributes);
console.log(geometry.index);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 1;
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

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
