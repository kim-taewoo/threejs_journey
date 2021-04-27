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

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: "#ff0000" }); 나 'red' 도 가능.
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Position
// mesh.position.x = 0.7;
// mesh.position.y = -0.6;
// mesh.position.z = 1;
mesh.position.set(0.7, -0.6, 1);

// Scale
// mesh.scale.x = 2;
// mesh.scale.y = 0.5;
// mesh.scale.z = 0.5;
mesh.scale.set(2, 0.5, 0.5);

// Rotation
// Vector3 가 아니라 Euler 다.(오일러) 축의 방향을 중심으로 회전하는 모양을 생각.
// 파이가 반 바퀴가 된다. (수학적인 이유는 모르겠음)
// 회전하면 다른 축의 위치가 바뀌기 때문에 회전 순서가 중요하다.
// 이렇게 회전 순서가 중요해지는 문제 때문에 오일러 보다 Quaternion 이 더 많이 쓰인다.
// 다만 Quaternion 이 이해하기는 어려운 큰 개념이다...
// mesh.rotation.y = 1;
mesh.rotation.reorder("YXZ");
mesh.rotation.x = Math.PI * 0.25;
mesh.rotation.y = Math.PI * 0.25;

// 유니티처럼 position 은 Vector3 클래스와 관련있다.
// position.length() 는 scene 의 중심점으로 부터 이 mesh 의 position 사이의 거리를 구한다.
// mesh.position.normalize();
// console.log(mesh.position.length());

// Axes Helper (화면상에 x,y,z 축을 표시해주는 헬퍼 객체. 첫번째 인자는 표시될 축의 길이)
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
// z 가 양수이면 '나를 향해' 오는 것이라 생각하면 된다. x 는 오른쪽, y 는 위쪽
camera.position.z = 3;
// camera.position.set(1, 1, 3);
scene.add(camera);

camera.lookAt(mesh.position);

// console.log(mesh.position.distanceTo(camera.position));

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);

// render() 은 사진을 찍는 시점이라고 생각하자.
// 따라서 render() 이후 변경 사항은 화면에 나타나지 않는다.
renderer.render(scene, camera);
