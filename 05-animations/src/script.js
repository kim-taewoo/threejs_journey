/*
# Animation
- 애니메이션은 마치 스탑모션과도 같다. 이동하고 사진 찍고(render), 이동하고 사진 찍고...
- 요즘은 주로 1초에 60번이라는 60fps 가 표준인 것처럼 쓰이지만 화면 주사율, 컴퓨터의 성능 차이 등으로 인해 화면 업데이트 주기가 다를 수 있다.
- 그래서 deltaTime 을 계산해서 반영해줘야 어느 컴퓨터에서건 같은 속도로 애니메이션을 보여줄 수 있다.

# window.requestAnimationFrame()
- 매 프레임마다 objects 들을 업데이트해서 렌더해주기 위해 requestAnimationFrame 을 호출한다.
- raf 의 목적은 '다음 프레임 에 주어진 함수를 호출'하는 거다. 이름처럼 막 혼자서 애니메이션을 만들어내고 이런 게 아니다.
- 다만 우리는 이 raf 로 어떤 함수를 다음 프레임에 호출하면서 또 그 함수 안에서 raf 를 재귀적으로 호출하면서 매 프레임마다 함수를 끊임없이 호출한다.

```js
const tick = () => {
  // 이런 함수 안에서 object 를 update 해서 매 프레임마다 움직이게 하는 게 애니메이션
  console.log('tick')
  window.requestAnimationFrame(tick)
}
```

- raf 는 프레임단위로 호출되기 떄문에 본인 컴퓨터의 주사율에 따라 raf 호출속도가 다를 수 있다. 그래서 deltaTime 을 계산한다.

# deltaTime && elapsedTime
- 이전 프레임으로부터 지난 시간으로 프레임 사이의 시간은 큰 차이가 없음을 이용해서 균등한 함수호출 진행
- 하지만 deltaTime 보다는 elapsedTime 을 사용하는 게 더 편하다. 
- elapsedTime 은 프레임 사이의 시간이 아니라 그냥 처음 이후로 쭉 상승하는 진행된 시간이다.
- Three.js 가 Clock 클래스를 이용해서 elapsedTime 을 사용할 수 있도록 제공한다. 

# GSAP
- 직접 애니메이션을 구현하기보다 라이브러리를 쓰면 편한 게 많다.
- GSAP 도 자체적인 tick 을 구현해놨기 때문에 우리가 직접 애니메이션용 tick 을 계산할 필요없이 알아서 계산해서 애니메이션을 실행한다.
- 하지만 render 는 우리가 해줘야 하기 때문에 render 를 위한 우리의 tick 도 필요하다.,
*/

import "./style.css";
import * as THREE from "three";
import gsap from "gsap";

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

gsap.to(mesh.position, { dutation: 1, delay: 1, x: 2 }); // x 가 목표 x 좌표. 나머지는 문자 그대로 뜻
gsap.to(mesh.position, { dutation: 1, delay: 2, x: 0 });

// let time = Date.now() // deltaTime 용

// Clock
// const clock = new THREE.Clock();
const tick = () => {
  // # deltaTime
  // const currentTime = Date.now();
  // const deltaTime = currentTime - time;
  // time = currentTime;
  // mesh.rotation.y += deltaTime * 0.001 // 이렇게 경과시간을 이용해서 애니메이션 속도를 frame rate 관계없이 조절가능

  // 하지만 Three.js 에서 Clock 을 이용한 계속해서 증가하는 elapsedTime 을 제공한다.
  // Clock
  // const elapsedTime = clock.getElapsedTime(); // 언제나 0부터 시작해서, 시간이 지난만큼을 초단위로 측정한다.

  // Update objects
  // elapsedTime 은 계속해서 증가하는 것이기 때문에 += 가 아니라 그냥 = 이 된다.
  // mesh.rotation.y = elapsedTime * Math.PI * 2; // 2pi * r 이 원의 둘레니까, 이렇게 하면 1초에 한 바퀴 돈다.
  // camera.position.y = Math.sin(elapsedTime);
  // camera.position.x = Math.cos(elapsedTime); // 이렇게 sin 과 cos 를 섞으면 원을 그리며 움직인다.
  // camera.lookAt(mesh.position);

  // Render
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
