## Geometry

Geometry 란건 `Vertices` & `faces` 로 이루어져 있다. (vertices 의 단수형은 vertex 이다.)
vertices 는 3d 공간상의 좌표점들이다.
faces 는 vertices 들을 join 해서 만든 면이다.
geometry 는 meshes 에 사용될 수 있는데, `Particles` 에도 사용가능하다. 따라서 meshes 에만 사용할 수 있는 것은 아니다.

각각의 vertex 는 단순히 좌표뿐 아니라 다른 정보들도 가질 수 있다.

- position (3d 공간상 좌표)
- 색상
- 법선벡터( === normal vector)
- uv 좌표
- 등등

[normal vector 에 대한 추가 공부자료](https://m.blog.naver.com/martinok1103/221509843129)

Geometry 클래스는 다양한 메서드들을 가지고 있는데, 모두 **vertex** 에 대한 작업을 수행한다. 즉, **뭔가를 움직이고 회전하고 변형시킨다면 그건 faces 를 움직이는 게 아니라 vertices 를 움직이는 것**이다. 물론 겉으로는 geometry 로 mesh 를 만들고 그 mesh 를 움직인다.

## Built in geometries

모든 geometries 는 BufferGeometry 를 상속받는다.

## Subdivisions

geometries 는 생성할 때 subdivisions 를 설정할 수 있다. 이는 생성된 geometry 의 vertices 와 faces 의 수를 결정한다. 더 많은 subdivisions 는 더 많은 vertices 와 faces 를 생성한다. 이는 더 정교한 모델을 만들 수 있게 해준다. material 설정 때 wireframe 을 true 로 설정하면 이를 확인할 수 있다.

## BufferGeometry

커스텀 geometries 를 만드려면 결국 BufferGeometry 를 이용해서 직접 geometices 를 만들 줄 알아야 한다. buffer geometry 의 데이터는 `Float32Array` 형태로 저장한다.

## Float32Array

- typed array 이다.
- 32bit floating point numbers 를 저장한다.
- 고정된 길이를 가진다.(클래스 인스턴스 생성 시에 정해진다.)
- 컴퓨터 입장에서 다루기 쉬운 형태다.

Float32Array 에 3개의 vertices 좌표를 저장하려면 3의 배수로 length 를 설정해야 한다.
즉, 점 3개를 찍으려면 9개의 숫자가 필요하다.

```js
const positionsArray = new Float32Array(9); // 혹은 new Float32Array([x, y, z, x, y, z, x, y, z])
positionsArray[0] = 0;
positionsArray[1] = 0;
positionsArray[2] = 0;
positionsArray[3] = 0;
positionsArray[4] = 1;
positionsArray[5] = 0;
positionsArray[6] = 1;
positionsArray[7] = 0;
positionsArray[8] = 0;

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3); // 3 은 itemSize (uv 좌표라면 2개가 한 쌍이니 2, particle 이라면 사이즈 값만 있으면 되니 1)

const geometry = new THREE.BufferGeometry();
// position 이라는 이름의 attribute 를 추가한다. 이 이름은 threejs builtin 쉐이더에서 이미 정해져 있는 이름이다. 커스텀쉐이더 만들어 쓰지 않는 이상 이 이름을 사용해야 한다.
geometry.setAttribute("position", positionsAttribute);
```

## Index

하나의 vertex 를 여러 face 에서 공유하는 vertices 를 명시해서 성능 향상을 가져올 수 있다.
이것도 buffer attribute 로 존재하기 때문에 거기 값들을 다 넘겨주면 된다.
그러나 복잡하니.. 일단 알고만 넘어가자.
