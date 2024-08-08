import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Models
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

let mixer = null;

// gltfLoader.load("/models/Fox/glTF/Fox.gltf", (gltf) => {
//   gltf.scene.scale.set(0.025, 0.025, 0.025);
//   scene.add(gltf.scene);

//   // Animation
//   mixer = new THREE.AnimationMixer(gltf.scene);
//   const action = mixer.clipAction(gltf.animations[2]);
//   action.play();
// });

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/textures/uv_grid_opengl.jpg");
texture.colorSpace = THREE.SRGBColorSpace;

const objLoader = new OBJLoader();
// objLoader.load(
//   // "/models/male02/male02.obj",
//   "/models/Buildings/661240_mt.obj",
//   (object) => {
//     console.log(object, typeof object);
//     object.traverse(function (child) {
//       console.log(child, "child");
//       if (child.isMesh) {
//         child.material.map = texture;
//       }
//     });

//     // object.position.y = -0.95;
//     object.scale.setScalar(1000);
//     scene.add(object);
//   }, // called when loading is in progresses
//   function (xhr) {
//     console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
//   },
//   // called when loading has errors
//   function (error) {
//     console.log(error, "ERROR");
//     console.log("An error happened");
//   }
// );

// let male = null;

// new MTLLoader()
//   .setPath("/models/male02/")
//   .load("male02.mtl", function (materials) {
//     materials.preload();

//     new OBJLoader()
//       .setMaterials(materials)
//       .setPath("/models/male02/")
//       .load(
//         "male02.obj",
//         function (object) {
//           console.log(object, "man");

//           object.traverse(function (child) {
//             if (child.isMesh) {
//               child.geometry.scale(0.03, 0.03, 0.03);
//               // child.scale.setScalar(0.01);
//               // child.geometry.scale(0.01, 0.01, 0.01);
//               // console.log(child.geometry);
//               const box = new THREE.Box3();
//               child.geometry.computeBoundingBox();
//               // console.log(child.geometry.boundingBox, "box");
//               box
//                 .copy(child.geometry.boundingBox)
//                 .applyMatrix4(child.matrixWorld);
//               const helper = new THREE.Box3Helper(box, 0xffff00);
//               // scene.add(helper);
//               // console.log(box);
//               // scene.add(box);
//             }
//           });
//           scene.add(object);
//         }
//         // onProgress
//       );
//   });

new MTLLoader()
  .setPath("/models/Buildings/")
  .load("661272_mt.mtl", function (materials) {
    materials.preload();

    new OBJLoader()
      .setMaterials(materials)
      .setPath("/models/Buildings/")
      .load(
        "661272_mt.obj",
        function (object) {
          console.log(object, "object");
          // object.scale.setScalar(0.02);
          // object.position.set(0, -5, 0);
          // // object.position.setScalar(0);
          // child.scale.setScalar(0.01);

          // object.traverse(function (child) {
          //   if (child.isMesh) {
          //     child.geometry.scale(0.01, 0.01, 0.01);
          //     const box = new THREE.Box3();
          //     child.geometry.computeBoundingBox();
          //     // console.log(child.geometry.boundingBox, "box");
          //     box
          //       .copy(child.geometry.boundingBox)
          //       .applyMatrix4(child.matrixWorld);
          //     console.log(box.getCenter(new THREE.Vector3()), "center");
          //     const helper = new THREE.Box3Helper(box, 0xffff00);
          //     scene.add(helper);
          //     // console.log(child.geometry);
          //   }
          // });

          // https://discourse.threejs.org/t/i-am-using-obj-loader-but-my-obj-can-not-be-displayed-at-all/9768/2
          var box = new THREE.Box3().setFromObject(object);
          var center = new THREE.Vector3();
          // getCenter 인자에 box 의 center point 값이 저장됨
          // https://threejs.org/docs/#api/en/math/Box3.getCenter
          box.getCenter(center);
          // box 의 center point 값을 object position 에서 차감함으로써 object 의 중심을 scene 의 중심으로 이동시킴
          object.position.sub(center);

          scene.add(object);
          console.log(box.getCenter(new THREE.Vector3()), "center");
          console.log(object.position, "position");
        }
        // onProgress
      );
  });

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#444444",
    metalness: 0,
    roughness: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
// scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(-5, 5, 0);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(50, 50, 50);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Model animation
  if (mixer) {
    mixer.update(deltaTime);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
