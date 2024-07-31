// 거의 똑같은 내용이 README.md 에도 있음. 그냥 여기서도 한번 더 정리해놓은 걸 보존.

/*
# Geometries

- Geometries 는 vertices 와 faces 로 이루어진다. 
- vertex(꼭짓점) 의 복수형인 vertices 는 3D 공간상의 점들이며, 이 점들이 연결되어 면이 되면 'faces' 가 만들어진다. 
- 다만 이 face 는 아무 모양의 면이 아닌 삼각형 모양을 말한다. 면을 이루기 위한 최소한의 점이 3개이기 때문. 
- faces 를 생성하지 않고 vertices 위치에 바로 표시를 하는 Particles 도 있다. 
- 각 vertex 의 주요 정보는 position 이기는 하지만, UV 좌표, Normal, Color 등등 여러 정보를 가지고 있을 수 있다.
- 여러개의 faces 를 만들 때, 그 faces 들이 공유하는 vertices 들이 있을 수 있고, 효율을 위해 그런 공유되는 vertices 를 index 로 정할 수 있다.
- 근데 우린 안 할거다.
*/

import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2); x,y,z 크기 이후부턴 한 면의 subdivision 개수다. (= 얼마나 세부적으로 한 면을 쪼갤지)
// const material = new THREE.MeshBasicMaterial({
//   color: 0xff0000,
//   wireframe: true,
// });
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// 위에서 이미 만들어져 있는 BoxGeometry 를 사용해서 만들었던 것을 직접 구현해보자.
// 모든 geometry 는 BufferGeometry 를 상속받는다.
// 이 BufferGeometry 의 메서드들은 mesh 가 아닌 vertices 에 관한 것임을 기억해두자. (즉 별로 쓸 일이 없다. mesh 전체를 조작할 일이 더 많으니..)
// BufferGeometry 는 순서대로 xyz 좌표가 계속해서 반복되는 Float32Array 를 position 속성의 값으로 받아 vertices 를 표현 할 수 있다.
// 즉, 50개의 삼각형을 그리려 한다면, 각 삼각형마다 3개의 vertices 가 필요하고, 그 각 vertex 는 x,y,z 3개의 position 정보가 필요하다.
const geometry = new THREE.BufferGeometry();
const count = 50;
const positionsArray = new Float32Array(count * 3 * 3); // 받을 데이터의 크기를 미리 정해둔다.
for (let i = 0; i < count * 3 * 3; i++) {
  // 여기선 일단 랜덤으로 좌표를 만들어 넣어보자. -0.5 를 하는 이유는 범위를 -0.5~0.5 로 해서 중심점이 0,0,0 이 되게 하기 위함.
  positionsArray[i] = (Math.random() - 0.5) * 4;
}

// 두번째 인자는 하나의 vertex 가 얼마의 사이즈를 가지냐이다.
// 우리는 단순히 x,y,z 위치 정보를 위한 3칸이 필요하므로 3 을 넣자.
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
// 'position' 이란 이름에 버퍼 속성을 넣는 이유는 그 이름을 쓰도록 Three.js 에서 쓰는 쉐이더에 규칙이 정해져있기 때문이다.
// 나중에 커스텀 쉐이더를 만들어 쓰면 맘대로 바꿀 수 있다.
geometry.setAttribute("position", positionsAttribute);

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
camera.position.z = 3;
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
