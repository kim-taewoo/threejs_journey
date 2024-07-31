# Camera

## ArrayCamera

여러 개의 카메라 각각이 보고 있는 것을 한 화면의 여러 부분에 각각 렌더링할 수 있다.

## StereoCamera

VR 렌더링을 위해 사용되는 카메라. 두 개의 카메라를 사용하여 렌더링한다.

## CubeCamera

three.js 내부에서 environment mapping 을 위해 사용되는 카메라. 여러 개(6개)의 카메라를 사용하여 큐브 맵을 만든다.

## Orthographic camera

원근감 제외

Canvas 사이즈가 1:1 이 아니라면, 카메라의 aspect ratio 를 조정해야 한다.

```js
const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.OrthographicCamera(
  -1 * aspectRatio,
  1 * aspectRatio,
  1,
  -1,
  0.1,
  100
);
```

Effect 를 만드는 데도 쓰이는 카메라다.

## PerspectiveCamera

원근감 포함

## Near, Far AND z-fighting

카메라의 near, far 을 너무 극단적으로 하면 z-fighting 이 일어나 객체들을 제대로 렌더하는 데 어려움을 겪을 수 있다.
기본 카메라 값은 0.1, 100 이다.

# Built in Controls

## OrbitControls

좀 더 스무스한 카메라 무브먼트를 위해선 enableDamping 설정을 true 로 둔 뒤 controls.update() 를 tick 에서 하면 된다.

```js
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// ...

const tick = () => {
  // ...

  // Update controls
  controls.update();

  // ...
};
```
