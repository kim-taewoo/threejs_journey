import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;

  console.log(cursor.x, cursor.y);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Scene
const scene = new THREE.Scene();

// Object
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(mesh);

// Camera
// 첫번째 인자인 degree 는 vertical field of view 이다. 즉, 세로방향임. 숫자가 클수록 많은 게 보이지만, 더 많이 왜곡된다.
// 왜 왜곡이 되냐면, 화면은 사각형 모양의, 작은 공간인데, 그곳에 너무 넓은 것을 구겨 넣어 표현하려고 하기 때문이다.
// 그래서 45~75 정도의 값이 권장된다. 사실 75도 크다고 한다. 성능 문제랑도 관련되어 있지만 일단 넘어가자.
// 카메라에는 3번째, 4번째 인자도 있다. 각각 렌더하는 최소거리(near), 최대거리(far)를 말한다. 즉, 최대거리보다 멀리 있는 사물은 렌더되지 않는다.
// 마치 시야에서 너무 먼 것은 어차피 너무 머니 표현하지 않는 것과 같다.
// 그러나 모든 것을 표현하겠다고 각각 0.00000001, 999999999 같은 극단적인 값을 넣어버리면 오히려 렌더러가 계산하는 데 어려움을 겪는다.
// 따라서 0.1, 200 정도의 일반적인 값을 넣어주는 게 좋다.

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

// OrthographicCamera 는 원근감 없이 렌더한다. 이펙트 등을 만들 때 쓰이기도 한다.
// left, right, top, bottom 순서로 카메라가 각 방향으로 얼마나 멀리 볼 수 있는지 설정한다. 그 뒤 5, 6번째 인자로 near, far 을 추가 설정한다.
// 그리고 그 비율대로 캔버스 크기 안에 속에 모든 걸 우겨넣기 때문에, 왜곡을 피하려면 aspectRatio 를 계산해서 넣어주자
// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   100
// );
// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 2;
// camera.lookAt(mesh.position);
scene.add(camera);

// Contorls
// OrbitControl 을 사용하면 드래그 회전, 오른쪽 클릭으로 이동, 줌인아웃도 된다.
const controls = new OrbitControls(camera, canvas);
// damping 을 사용하면, 마우스가 상호작용하지 않을때도 작동하도록 하게 하기 위해서 tick 마다 매번 update 해줘야 한다.
controls.enableDamping = true;
// controls.target.z = 1
// controls.update()

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  //   mesh.rotation.y = elapsedTime;

  // Update Camera
  // 카메라가 대상을 중심으로 주변을 원형으로 돌게 하려면 어떻게 해야할까?
  // 위아래까지 찍지 않는다면, 바닥을 원형으로 돌면 되는 것이고,
  // 바닥을 움직이는 데는 x 축과 y 축의 변화가 필요하다.
  // 그리고 원형으로 돌려면 그 2개의 축이 같은 값을 가지는 하나는 sin, 하나는 cos 여야 한다.
  // 파이 값을 쓰는 이유는, 보통 2파이r 이 한바퀴를 뜻하기 때문이다.
  // 커서 값이 0 일 때 sin(x) 값은 0이고 cos(x) 값은 1이므로 카메라는 z 축으로 1 값을 가지고 있게 된다.
  // 그리고 sin, cos 의 변화 값은 -1 부터 1 여서 값이 너무 작으니, 그 결과값에 가중치를 곱해주어야 변화를 보기 좋다.(여기선 3)
  //   camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  //   camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  //   camera.position.y = cursor.y * 5;
  //   camera.lookAt(mesh.position); // 중심점을 바라보게 됨.

  // Update control
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
