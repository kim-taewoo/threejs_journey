# Three.js Journey

컴퓨터마다 혹은 모니터마다 frame rate (FPS Frame per Seconds) 가 다르기 때문에 동일한 애니메이션을 보여주고 싶다면 시간에 따른 변화를 계산해야 한다. 이것을 위해 `requestAnimationFrame` 을 사용해 프레임마다 실행되는 함수를 만들어야 한다. 혹은 three js 에서 제공하는 Clock 클래스를 사용할 수도 있다.

```js
let time = Date.now();

const tick = () => {
  const currentTime = Date().now();
  const deltaTime = currentTime - time;
  time = currentTime;

  // Update Objects
  mesh.rotation.y += 0.001 * deltaTime;

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
```

Clock 의 elapsedTime 은 시작부터의 시간을 초로 반환한다.

```js
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update Objects
  // 아래 코드는 1초마다 한 바퀴를 돌게 한다.
  mesh.rotation.y = elapsedTime * Math.PI * 2;

  console.log("tick");

  window.requestAnimationFrame(tick);
};

tick();
```

참고로 `getDelta` 라는 놈도 있는데, 쓰지마라. 이해하기 어려운 값을 반환한다.
