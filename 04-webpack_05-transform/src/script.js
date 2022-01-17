/*
# Bundler

<script> 태그로 3js 를 가져오는 데는 한계가 있다.
1. 일단 아예 빠진 클래스들이 있다.
1. 그리고 이미지와 텍스처와 같은 자원들을 불러오고 가공하는 과정이 브라우저에서 보안 이슈로 불가능한 경우가 있다. 따라서 우리는 서버를 돌려야 하고, 당연히 서버에선 script 태그를 쓸 수 없다.

따라서 우린 번들러를 쓴다.  
- 번들러는 html, css, js, images, 등 각종 assets 를 웹에서 사용하기 적합한 방식의 한 꾸러미(bundle)로 만들어주는 도구다.
- 그리고 이 과정에서 필요한 수정을 하기도 하고, 번들링 외에 로컬 개발 서버를 제공하거나 의존성 관리를 해주는 등의 개발 환경을 지원해준다.

- 수많은 번들러 중 이 수업에서 Webpack 을 쓰는 이유는 유명하고 커뮤니티가 안정적이고 크기 때문이다. (일단 이거 쓰자)

- 이후 터미널 사용방법이나 웹팩 개발 서버 사용 설명하는 건 스킵.
- Webpack 과 같은 번들러를 쓰면 자체 룰에 의해 코드가 조립되기 때문에 기존의 html 파일에 css, js 파일을 연결하는 작업이 필요없다.

# Transform Objects

이전에 transform 종류가 크게 3가지라 했는데 한 가지 추가해서 4가지를 보자.
1. postion
1. scale
1. rotation
1. quaternion <- 얘가 낯선데 rotation 과 유사하다.

모든 클래스들은 Object3D 를 상속받는데, Object3D 가 위 properties 를 가지고 있다. (다 transform 가능하단 거)
이 속성들은 matrices 로 컴파일되지만 사실 우리가 matrices 를 이해할 필요까진 없으니 넘어가자.

- 3강에서도 말했지만 xyz 축은 어떤 상황에서 바라보느냐, 어떤 툴을 사용하느냐에 따라 움직이는 방향이 다를 수 있다. 
- 그래도 일단 기본값은 현재 카메라가 바라보는 시점 기준으로 x 가 좌우, y 가 상하, z 가 앞뒤 라고 생각하자.
*/

import * as THREE from "three";
import "./style.css";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Scene
const scene = new THREE.Scene();

// # Position
// mesh.position.x = 0.7;
// mesh.position.y = -0.6;
// mesh.position.z = 1;
// 혹은 아래처럼 한번에 set 가능
// mesh.position.set(0.7, -0.6, 1);

// # Scale
// mesh.scale.x = 2;
// mesh.scale.y = 0.5;
// mesh.scale.z = 0.5;
// mesh.scale.set(2, 0.5, 0.5);

// 유니티처럼 position 은 Vector3 클래스와 관련있다.
// position.length() 는 scene 의 중심점으로 부터 이 mesh 의 position 사이의 거리를 구한다.
// console.log(mesh.position.length());

// distanceTo 를 이용해서 두 Object 사이의 거리를 구할 수도 있다.
// console.log(mesh.position.distanceTo(camera.position))

// normalize() 를 사용하면 해당 object 가 아무리 멀리 있어도 length() 가 1이 되도록 줄인다. 어디쓰냐고? 담에 알아보자.
// mesh.position.normalize();

// # Rotation
// Vector3 가 아니라 Euler(오일러) 다. '축의 방향을 중심'으로 회전하는 모양을 생각.
// 파이가 반 바퀴가 된다. (2파이*r 이 원둘레니까?)
// 회전하면 다른 축의 위치가 바뀌기 때문에 회전 순서가 중요하다.
// 이렇게 회전 순서가 중요해지는 문제 때문에 오일러 보다 Quaternion 이 더 많이 쓰인다.
// 다만 Quaternion 이 이해하기는 어려운 큰 개념이다...
// mesh.rotation.y = 1;
// mesh.rotation.reorder("YXZ");
// mesh.rotation.x = Math.PI * 0.25;
// mesh.rotation.y = Math.PI * 0.25;

// Axes Helper (화면상에 x,y,z 축을 표시해주는 헬퍼 객체. 첫번째 인자는 표시될 축의 길이)
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

// lookAt 을 사용하면 어떤 object 를 바라보도록 할 수 있다.
// camera.lookAt(mesh.position);

// 여러 객체를 한 그룹에 넣어 한 번에 tranform 할 수 있다.
const group = new THREE.Group();
group.position.y = 1;
group.scale.y = 2;
group.rotation.y = 1;
scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
cube2.position.x = -2;
group.add(cube2);

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
cube3.position.x = 2;
group.add(cube3);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);

// render() 은 사진을 찍는 시점이라고 생각하자.
// 따라서 render() 이후 변경 사항은 화면에 나타나지 않는다.
renderer.render(scene, camera);
