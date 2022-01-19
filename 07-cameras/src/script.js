/*
# Camera
- 3js 공식문서에 검색하면 여러 종류의 카메라가 나온다.
- 그 중 그냥 'Camera' 는 모든 카메라의 기반이 되는 Abstract base class 이므로 직접 사용할 일 없다.
- ArrayCamera 는 여러 카메라들을 한 번에 렌더해주는 한 화면 멀티플레이 게임에 쓸법한 카메라
- StereoCamera 는 VR 을 위해 쓸법한 카메라
- 6개의 렌더를 한다. environment map 과 같이 둘러싼 환경을 조성할 때 쓰곤 한다.
- Orthographic camera 는 원근법이 적용되지 않는 카메라다. 멀리 있어도 같은 사이즈로 렌더된다.
- 우리가 주로 쓸 건 위 Orthographic 이랑 일반 원근법을 가진 Perspective 카메라
- 아래 코드에서 우선은 직접 마우스 위치를 파악해서 카메라가 mesh 를 둘러보는 기능을 구현해볼 것이지만
- 결국엔 3js 가 제공하는 Controls 클래스를 쓴다.
- Controls 가 내가 원하는 기능을 모두 제공하면 그냥 그걸 쓰면 되고, 아니면 내가 직접 필요한 걸 구현해야 한다.
*/

import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  // 너비로 나눠서 0부터 1까지의 범위로 만들고, 0.5를 빼서 -0.5~0.5 범위로 만든다.
  // 물론 범위를 잡는 건 본인 취향
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  // 사람들이 여러 화면을 연결해놓고 오갈 때도 있기 때문에 pixelRatio 도 다시 설정하는 게 좋다.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;
  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitFullscreenElement) {
      canvas.webketRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

const canvas = document.querySelector("canvas.webgl");

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
// 예를 들어 'z-fighting' 이라는 상황이 발생하는데, 객체들 사이에서 어떤 게 카메라에 더 가깝고 먼지 그 순서를 계산하는 데 렌더러가 어려움을 겪는다.
// 따라서 0.1, 200 정도의 일반적인 값을 넣어주는 게 좋다.
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

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

camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

// # Contorls
// 여러종류의 controls 가 있지만 카메라와 관련해서 가장 쓸만한 건 OrbitControl 이다.
// OrbitControl 을 사용하면 드래그 회전, 오른쪽 클릭으로 이동, 줌인아웃도 된다.
// 첫 인자로 카메라, 두번째 인자로 드래그, 마우스, 터치 등 이벤트를 감지할 DOM element 를 받는다.
const controls = new OrbitControls(camera, canvas);

// controls 설정을 변경할 수 있는데, 변경사항을 적용하려면 controls.update() 를 해줘야 한다.
// controls.target.z = 1
// controls.update()

// damping 을 사용하면 가속력, 마찰력 등을 적용해서 스무스한 애니메이션을 만들어 준다.
// 다만 유저가 이벤트로 상호작용하지 않을때도 렌더하게 하기 위해서 tick 마다 매번 controls 를 update 해줘야 한다.
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Animate
const clock = new THREE.Clock();

const tick = () => {
  // const elapsedTime = clock.getElapsedTime();

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
  //   camera.position.y = cursor.y * 5; // 이건 그냥 위아래도 움직일 수 있게 하는 서비스
  //   camera.lookAt(mesh.position); // 중심점을 바라보게 됨.(mesh 가 0,0,0 에 있으니까)

  // 근데 위 모든 게 직접하기 너무 힘드니까 controls 라는 걸 쓴다. 3js 가 제공하면 써야지

  // Update control
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
