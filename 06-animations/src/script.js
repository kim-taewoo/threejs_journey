import "./style.css";
import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Time
// 화면 주사율, 컴퓨터의 성능 차이 등으로 인해 화면 업데이트 주기가 다르다.
// 그래서 deltaTime 을 계산해서 반영해줘야 어느 컴퓨터에서건 같은 속도로 실행할 수 있다.
// let time = Date.now();

// Clock
const clock = new THREE.Clock();

// Animation
// 애니메이션은 마치 스탑모션과도 같다. 이동하고 사진 찍고(render), 이동하고 사진 찍고...
const tick = () => {
  // Time
  // const currentTime = Date.now();
  // const deltaTime = currentTime - time;
  // time = currentTime;

  // Clock
  const elapsedTime = clock.getElapsedTime(); // 언제나 0부터 시작해서, 시간이 지난만큼을 초단위로 측정한다.

  // Update objects
  // mesh.rotation.y = elapsedTime * Math.PI * 2; // 2pi * r 이 원의 둘레니까, 이렇게 하면 1초에 한 바퀴 돈다.
  camera.position.y = Math.sin(elapsedTime);
  camera.position.x = Math.cos(elapsedTime);
  camera.lookAt(mesh.position);

  // Render
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
