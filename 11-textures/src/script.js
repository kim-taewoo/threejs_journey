/*
# Textures
- Textures 는 geometries 를 어떻게 cover 하는지에 관한 것이다. 이 'cover' 한다는 건 단순히 색을 입히는 것 이상이다.
- 즉, Textures 는 다양한 타입이 있다.

## Textures Types
- Color: 색
- Alpha: 흑백이며, 검정은 보이지 않고, 흰색은 100% 보이고, 회색은 반만 보이고 이런 거
- Height: 흑백이며, 규칙에 따라 높낮이를 나타낸다. 예로 어떤 Vertex 가 흰색이면 위로 올리고 검은색이면 내리고 회색이면 움직이지 않는다.
- Normal: 보라색, 푸른빛깔의 텍스쳐. 디테일을 나타내는데 보통 'Lighting' 에 관한 것이다.
  - Normal 맵은 subdivision 이 필요 없으며, Height map 처럼 Vertices 를 움직이는 게 아니다.
  - 디테일을 나타내지만 여전히 평면이긴 한 상당히 흥미로운 map 이다. (빛으로 디테일을 빚어내는 느낌?)
  - Height 맵과 달리 subdivision 이 불필요하고 Vertices 를 조절하는 게 아니어서 성능이 더 좋다.
- Ambient occulusion: 흑백이며, 그림자를 '흉내'낸다. 즉 진짜 빛의 반사를 계산하는 게 아닌 틈 사이에 가짜 그림자를 표현하면서 Physically accurate 하진 않아도 디테일을 추가할 수 있게 한다.
- Metalness: 흑백이며, 흰색은 금속, 검은색은 금속이 아님을 나타낸다. 보통 금속의 '반사' 부분을 표현하기 위해 사용한다.
- Roughness: 흑백이며, Metalness 와 같이 사용되는 경우가 많다. 흰색부분은 거칠고 검은색 부분은 부드러움을 나타낸다. 빛의 흡수도를 나타내기 위해 쓴다.

## PBR
- 텍스쳐들은 (특히 metalness, roughness) PBR(Physically Based Rendering) 을 따르려고 한다.
- PBR 이란 실제 현실과 가까운 계산을 지향하는 것이다. 
- PBR 에 대해서 더 알고 싶다면(어떤식으로 계산하는지 등) 아래 글들을 읽어보자.
- https://marmoset.co/posts/basic-theory-of-physically-based-rendering/
- https://marmoset.co/posts/physically-based-rendering-and-you-can-too/

*/

import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log("onStart");
};
loadingManager.onLoad = () => {
  console.log("onLoad");
};
loadingManager.onProgress = () => {
  console.log("onProgress");
};
loadingManager.onError = () => {
  console.log("onError");
};
const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load(
  "/textures/door/color.jpg",
  () => {
    console.log("load");
  },
  () => {
    // 근데 이 progress 단계는 쓰기 진짜 애매해서 사실상 쓸 일이 없다.
    console.log("progress");
  },
  () => {
    console.log("error");
  }
);
const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const heightTexture = textureLoader.load("/textures/door/height.jpg");
const normalTexture = textureLoader.load("/textures/door/normal.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

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
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
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
