/*
README.md
네가지가 필요하다.

1. 객체들을 담을 scene
1. 객체들 (objects)
1. 카메라
1. 렌더러 (renderer)

# Scene

- 컨테이너와 같은 것
- objects, models, lights 등등을 가진다.
- 우리는 3js 에게 이 Scene 을 렌더해달라고 한다.

# Objects

- Primitive geometries
- imported models
- Particles
- Lights
- Etc

시작은 Mesh 로 한다.  
Mesh 는 geometry(shape) 와 material(어떻게 보여야 하는지) 의 조합이다.
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
const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: "#ff0000" }); 나 'red' 도 가능.
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material); // Mesh 는 geometry 와 material 의 조합이니까!

scene.add(mesh); // 자주 까먹는데, scene 에 추가를 해야 렌더할 수 있다 ! 렌더러가 렌더 하는 건 결국 Scene 이니까!

// Camera (Point of view)
// 여러개의 카메라가 있을 수 있고, 여러 타입의 카메라가 있다.
// PerspectiveCamera 가 일반적인 원근감을 가지는 기본 카메라다.
// 첫번째 인자는 'The Field of View(a.k.a. fov)' 인데, Vertical vision angle 을 각도(degree) 로 넣는다.
// 각도가 클수록 한 번에 많은 영역을 볼 수 있지만 외각으로 갈수록 왜곡도 커진다.
// 작은 각도로 보면 줌인한 것처럼 보인다. 여기선 75를 쓰지만 보통 45~55쯤이 최대치다.
// 두번째 인자는 aspect ratio 다. 렌더의 width/height
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

// 위에서 mesh 와 camera 를 만들었는데, 위치를 설정하지 않았기 때문에 카메라가 mesh 안에 있고, 따라서 아무것도 찍히지 않는다.
// 그래서 위치를 조절해 줘야 하는데, 어떤 객체(카메라도 객체)를 transform 하는 건 크게 3가지다.
// 1. position, 2. rotation, 3. scale
// z 가 양수이면 '나를 향해' 오는 것이라 생각하면 된다. x 는 오른쪽, y 는 위쪽 (3js 디폴트설정이 그렇단 것이며 x,y,z 방향은 어떤 툴이냐에 따라 다를 수 있다.)
camera.position.z = 3;
scene.add(camera); // 카메라도 결국 렌더러가 인식해서 써야하니 Scene 에 추가해야 된다.

// Renderer
// 렌더러도 종류가 많긴 한데 WebGL 렌더러를 쓰자.
const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);
