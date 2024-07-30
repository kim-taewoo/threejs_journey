# Three.js Journey

overflow:hidden 을 해줘야 특정 환경에서의 아래부분 스크롤 영역 표시 문제를 해결가능

```css
html,
body {
  margin: 0;
  overflow: hidden;
}
```

outline: none 을 해줘야 특정 환경에서의 선택시 바깥쪽 테두리가 생기는 문제 해결가능

```css
canvas {
  outline: none;
}
```

## Resize

resize 이벤트 핸들러로 canvas 사이즈를 조절해줄 때 **카메라**도 업데이트 해줘야 한다.
왜냐하면 카메라의 aspect ratio 가 변하기 때문이다.
단순히 새로운 값을 할당해주는 것만으로는 카메라가 업데이트 되지 않는다.
Three js 의 카메라에게 projection matrix 를 업데이트하라고 알려줘야 한다.
matrices 는 projection, modification 등을 해주는 데이터이다.
우리가 직접 업데이트 해줄 필요는 없다.

객체가 변경되니까 **renderer** 도 업데이트 해줘야 한다.
**Pixel Ratio** 를 조절해줄 수도 있다.

```js
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
```
