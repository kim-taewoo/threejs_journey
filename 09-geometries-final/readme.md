# Geometry

단수: Vertex
복수: Vertices

Vertex 들이 연결돼서 faces 를 만든다.
그리고 이것들이 모여 geometry 가 된다.

물론 faces 없이 gemoetry 가 될 수도 있다.
예를 들어 particle 의 경우 각각의 Vertex 마다 particle 을 그린다.

geometry 가 가진 vertices 들은 단순히 3D 좌표(position)를 가지는 것이 아니다.
uv 좌표나 normal vector 등 다양한 정보를 가질 수 있다.

## Built in geometries

모든 geometries 는 BufferGeometry 를 상속받는다.

## Custom geometries

BufferGeometry 를 활용해 geometry 를 직접 만들 수도 있다.
우선 buffer geometry data 를 어떻게 저장해야하는지를 알아야 한다.

**Float32Array** 를 사용한다.

Float32Array

- Typed array
- Can only store floats
- Fixed length
- Easier to handle for the computer

Float32Array 에 3개의 vertices 좌표를 저장하려면 3의 배수로 length 를 설정해야 한다.
즉, 점 3개를 찍으려면 9개의 숫자가 필요하다.

```js
const positionsArray = new Float32Array([
  0,
  0,
  0, // 1st vertex
  0,
  1,
  0, // 2nd vertex
  1,
  0,
  0, // 3rd vertex
]);
```

그 뒤 이 Float32Array 를 BufferAttribute 로 변환해야 한다.
이 때 2번째 param 은 상황에 따라 달라질 수 있다. uv 좌표를 저장하려면 2, normal vector 를 저장하려면 3 이다. particle 이라면 1이 될 수 있다.

```js
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
```

그 뒤 BufferGeometry 를 만들어서 이 attribute 를 추가해준다.

```js
const geometry = new THREE.BufferGeometry();
// 여기서 'position' 은 shaders 에서 사용하게 될 attribute 이름이다.
// 즉 three.js 의 built in shaders 에 이미 'position' 이라는 attribute 가 사용되고 있고 거기에 값을 추가하는 것이다.
geometry.setAttribute("position", positionsAttribute);
```

## Index

하나의 vertex 를 여러 face 에서 공유하는 것을 명시해서 성능 향상을 가져올 수 있다.
그러나 복잡하니.. 일단 알고만 넘어가자.
