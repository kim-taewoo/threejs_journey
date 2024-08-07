# Formats

정말 다양한 3d 관련 확장자가 있으나, GLTF 가 최근에 많이 쓰이고 있다.

- geometries, materials, cameras, lights, scene graph, animations, skeletons, morphing 등 거의 모든 것을 담을 수 있다.
- json, binary, embed textures 등으로 export 할 수 있다.
- 다양한 3d 프로그램들에서 지원한다.

물론 최적화된 포맷은 상황에 따라 다를 수 있다. (예를 들어 particles 를 위해서는 Poly 가 낫다고 한다.)

## GLTF 종류들

### GLTF

gltf default format 이라고도 부르며 `.gltf`, `.bin`, `.png` 파일 3개로 이루어진 포맷이다.

- `.gltf` : json 파일로, cameras, lights, scenes, materials, objects transformations 등을 담고 있다. **geometry 나 texture 는 포함하지 않는다.**
- `.bin` : binary 파일로, geometries(vertices positions, UV coordinates, normals, colors 등) 정보를 담고 있다.
- `.png` : 이미지 파일로, textures 를 담고 있다.

gltf 를 import 하면 .bin 과 .png 는 보통 자동으로 로드된다. (gltf 파일의 buffers, images 같은 속성필드에 파일 이름들이 적혀 있음.)

### GLTF-Binary

`.glb` 파일 하나로만 이루어져 있고, 위의 3개 파일을 하나로 합친 것으로 보면 된다. import 하기에는 좋으나 수정사항이 있을 때 거의 불가능하다는 단점이 크다.

### GLTF-Draco

gltf default format 과 거의 같은 구성이나 buffer data 가 Draco algorithm 으로 압축되어 있어 훨씬 크기가 작다. 3배 이상 차이나는 편이다.

### GLTF-Embedded

gltf default format 파일들을 전부 gltf 파일에 인코딩해서 넣은 것이다. 즉, buffer 데이터든 texture 든 모두 바이너리 형태로 json 파일 하나에 다 들어가 있다. 파일 크기가 제일 크기도 하고 난해해서 잘 쓰지 않는다.

## GLTF loader

다양한 확장자의 loader 가 있지만, GLTF loader 로 공부해본다.
GLTFLoader 는 크기가 커서 THREE 클래스에 내장되어 있지 않다. 따로 import 해야 한다.
load 결과물을 보면 scene 도 있고 scenes 도 있는데, scene 은 scenes 중 default scene 을 가리킨다. 즉, gltf 파일 하나는 여러개의 scenes 를 가지고 있을 수 있다.

scene 은 `THREE.Group` 클래스로, children 속성 array 첫 요소로 Object3D 를 가지고 있다.(scene 이 여러 object3D 를 가지고 있을 수 있다.) 이 Object3D 는 또 children 을 가지고 있고, 이 children 배열 안에 PerspectiveCamera, mesh 가 있다. 이 중 PerspectiveCamera 는 무시해도 된다. 우리가 원하는 건 mesh 다. 이 mesh 의 position, scale, rotation 정보는 mesh 의 상위 경로에 있다.. 즉 어떻게 import 하냐에 따라서 import 되는 객체 정보가 더 깔끔하거나 정확하지만 귀찮아질 수도 있고 그렇다. gltf.scene 을 통째로 scene.add 할 수도 있고, children 을 루프 돌면서 scene.add 할 수도 있다. 필터링을 통해 원하는 mesh 만 scene.add 할 수도 있고 3d 프로그램에서 불필요한 객체를 지워서 export 한 후 다시 import 할 수도 있다.

```js
const gltfLoader = new GLTFLoader();
gltfLoader.load("/models/Duck/glTF-Embedded/Duck.gltf", (gltf) => {
  console.log(gltf);
  scene.add(gltf.scene);
});
```

## Animation

gltf 파일에는 animation 정보도 담겨있다. AnimationMixer 로 gltf 내 애니메이션을 가져온 뒤, deltaTime 에 맞게 mixer 를 업데이트해주면 동작한다.
