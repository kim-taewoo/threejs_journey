# Debug GUI(Graphic User Interface)

- 우리가 개발을 할 때, 어떤 mesh 의 색상 변경, 카메라 각도 변경 등 자질구레한 설정을 변경해보고 싶을 수 있다.
- 그런데 그 때마다 일일이 코드를 하나씩 변경해서 저장하고 확인하는 작업을 한다면 너무 테스트하기 힘들다.
- 그래서 Debug UI 를 이용해서 화면에서 바로바로 다른 설정을 적용해볼 수 있게 하는데, 다양한 관련 라이브러리가 있다.
- 이 강의에서는 dat.gui 를 처음에 썼으나 업데이트가 안되고 취약점이 발견되어 lil-gui 로 갈아탔다.
- 코드는 dat.gui 를 기준으로 쓰여졌으나, lil-gui 도 거의 동일하다.

## tweaks Types

Debug GUI 에서 수정할 수 있는 타입들은 크게 아래와 같다.

- Range
- Color
- Text
- Button
- Checkbox
- Select

## gui.add()

- 만들어진 패널에서 어떤 객체를 어떻게 조작할 것인지 등록한다. (오로지 객체 형태만 받을 수 있음에 주의하자.)
- `gui.add(...)` 로 GUI 에 추가하는데, 파라미터 순서는 다음과 같다.
  - 어떤 객체를 등록할지
  - 그 객체의 어떤 속성(attribute)을
  - 최소값
  - 최대값
  - 한 번에 얼마씩 조절할지
  - 원하는 Debug UI 이름
- 그러나 파라미터 순서를 외우기 헷갈리기도 하고 가독성 향상을 위해 메서드 체이닝으로 작성하는 게 낫다.

```js
// gui.add(mesh.position, "y", -3, 3, 0.01);

// line break 를 이용한 가독성 향상 (prettier 설정 끄는 것 귀찮다...)
// prettier-ignore
gui.add(mesh.position, "y")
  .min(-3)
  .max(3)
  .step(0.01)
  .name("elevation");
```

## Debug GUI 숨기기

- 브라우저에서 h 키를 눌러서 디버그 패널을 숨길 수 있는데, 처음시작부터 숨기고 싶다면 `gui.hide()` 로 시작하면 된다. 강의자의 경우 자신의 사이트 url 에 `#debug` 를 붙이는 경우 패널이 보이게 하고, 그렇지 않으면 숨기게 했다.

## Color 변경

Three js 에서는 최적화를 위해 자체적인 색상 관리 시스템이 있다. 따라서 단순히 색상 코드를 반영하는 것이 아니라, Three js 의 Color 클래스를 이용해서 색상을 변경해야 한다. (그러지 않으면 debug gui 에 표시되는 색상코드를 실제로 three js material 에 넣었을 때 전혀 다른 색상처럼 보인다.) 아래처럼 속성에 대한 객체를 따로 정의해놓고, Color 클래스의 set() 메서드로 업데이트한다.

```js
const parameters = {
  color: 0xff0000,
};

// 색상표를 제공해주는 gui 메서드인 addColor 를 이용
gui.addColor(parameters, "color").onChange(() => {
  // mesh 를 구성하는 material 의 color 인스턴스를 set 메서드로 업데이트
  material.color.set(parameters.color);
});
```

## Function

함수 attribute 를 gui 에 추가하면 버튼이 생성되고, 클릭하면 해당 함수가 실행된다.

```js
parameters.spin = () => {
  gsap.to(mesh.rotation, 1, { y: mesh.rotation.y + Math.PI * 2 });
};

gui.add(parameters, "spin");
```

## Geometry 변경 (예시: Subdivision)

- Three js 의 geometry 는 초기화 이후 (ex: `new BoxGeometry()`) 수정이 불가능하다.(일회용이다.) 따라서 geometry 를 수정하려면 새로운 geometry 를 만들어서 대상 mesh 의 기존 geometry 를 대체해야 한다.

### 주의! onFinishChange 를 사용하자.

color 를 변경할 때처럼 `onChange` 를 쓸 수도 있겠지만, geometry 를 변경하는 과정은 CPU 가 많이 사용되므로, 모든 값 변경마다 geometry 변경이 실행되지 않도록 `onFinishChange` 를 사용하는 것이 좋다.

```js
const debugObject = {
  subdivision: 2,
};

// prettier-ignore
gui
  .add(debugObject, "subdivision")
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    // 기존 geometry 를 대체하는 방식으로 변경 (widthSegments, heightSegments, depthSegments 모두 변경하는 코드)
    geometry = new THREE.BoxGeometry(1, 1, 1, debugObject.subdivision, debugObject.subdivision, debugObject.subdivision);
    mesh.geometry.dispose(); // 기존 geometry 를 메모리에서 해제 (메모리 누수 방지)
    mesh.geometry = geometry;
  });
```

### Performance TIP: dispose()

위 코드 예시처럼, geometry, material, texture, renderTarget 등 메모리를 사용하는 객체를 사용하지 않게 됐을 때는 `dispose()` 메서드를 이용해서 메모리를 해제해줘야 한다. 그러지 않으면 없어지지 않고 어디선가 메모리를 차지하고 있게 된다.

## gui 폴더 관리

`gui.addFolder(폴더명)` 으로 폴더를 만들고, 그 폴더에 add 를 함으로써 좀 더 보기 좋게 정리할 수 있다.
