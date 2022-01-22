/*
# Debug UI
- 우리가 개발을 할 때, 어떤 mesh 의 색상 변경, 카메라 각도 변경 등 자질구레한 설정을 변경해보고 싶을 수 있다.
- 그런데 그 때마다 일일이 코드를 하나씩 변경해서 저장하고 확인하는 작업을 한다면 너무 테스트하기 힘들다.
- 그래서 Debug UI 를 이용해서 화면에서 바로바로 다른 설정을 적용해볼 수 있게 하는데, 다양한 관련 라이브러리가 있다.
- 이 강의에서는 dat.gui 를 처음에 썼으나 업데이트가 안되고 취약점이 발견되어 lil-gui 로 갈아탔다.
- 코드는 dat.gui 를 기준으로 쓰여졌으나, lil-gui 도 거의 동일하다.
*/

import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import * as dat from "lil-gui";

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: parameters.color });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Debug gui 패널을 추가.
 */
const gui = new dat.GUI({
  // closed: true,
  width: 400,
});

// 브라우저에서 h 키를 눌러서 디버그 패널을 숨길 수 있는데, 처음시작부터 숨기고 싶다면 gui.hide() 로 시작하면 된다.
// gui.hide()
// 만들어진 패널에서 어떤 객체를 어떻게 조작할 것인지 등록한다.
// 어떤 객체를 등록할지, 그 객체의 어떤 속성을, 최소값, 최대값, 한 번에 얼마씩 조절할지, 원하는 Debug UI 이름, 순서로 등록한다.
// gui.add(mesh.position, "y", -3, 3, 0.01);
// 근데 순서를 외우기 헷갈릴 수 있으니 메서드 체이닝으로 작성할 수 있다.
// prettier-ignore
gui
  .add(mesh.position, "y")
  .min(-3)
  .max(3)
  .step(0.01)
  .name("elevation");
gui.add(mesh, "visible");
gui.add(material, "wireframe");

// material 의 color 속성은 Color 클래스의 인스턴스이기 때문에
// 위 다른 속성들처럼 단순히 값을 대입한다고 해서 바로 값을 수정할 수 없다.
// 그래서 아래처럼 속성에 대한 객체를 따로 정의해놓고, Color 클래스의 set() 메서드로 업데이트한다.
const parameters = {
  color: 0xff0000,
  spin: () => {
    gsap.to(mesh.rotation, 1, { y: mesh.rotation.y + Math.PI * 2 });
  },
};

gui.addColor(parameters, "color").onChange(() => {
  // material 의 color 인스턴스를 set 메서드로 업데이트
  material.color.set(parameters.color);
});

gui.add(parameters, "spin");

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
