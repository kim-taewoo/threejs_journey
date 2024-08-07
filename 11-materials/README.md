# Materials

눈에 보이는 geometries 위의 픽셀에 색을 어떻게 입힐지에 대한 것. Texture 와 어떻게 다른지 헷갈릴 수 있는데, 간단하게 구분하자면 textures 는 이미지이고, materials 는 그 이미지를 어떻게 사용해 화면에 표시할지에 대한 것으로, material 은 한 개 혹은 여러개의 textures 를 사용할 수 있다.

픽셀에 색을 입힐지를 결정하는 알고리즘은 `shader` 라고 불리는 프로그램으로 결정되나, 직접 shader 를 작성하는 것은 굉장히 복잡하므로 Three.js 에서는 자체 기본 shader 를 쓰는 많은 materials 클래스들을 제공한다.

# MeshBasicMaterial

## Materials Methods 사용법

Material 클래스를 초기화할 때 객체로 넣어줘도 되고, 직접 대입으로 따로 집어넣어줘도 된다.

## 색상

색상은 `color` 속성을 통해 지정할 수 있다. `Color` 클래스를 이용해야만 적용된다.

```js
const material = new THREE.MeshBasicMaterial();
material.color = new THREE.Color(0xff0000);
```

color 타입 텍스쳐와 함께 사용할 수도 있다.

```js
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");

const material = new THREE.MeshBasicMaterial();
material.color = new THREE.Color(0xff0000);
material.map = doorColorTexture;
```

## 투명도

material 의 투명도를 조절할 때는 opacity 뿐 아니라 transparent 속성도 수정해줘야 한다.

```js
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  opacity: 0.5,
  transparent: true,
});
```

### alphaMap 사용

opacity 속성을 사용하는 것 외에도 alphaMap 텍스쳐를 써서도 투명도 조절이 된다. Texture 때 배웠지만 alphaMap 은 흰색은 불투명, 검은색은 투명으로 인식하도록 하는 텍스쳐다.

```js
const textureLoader = new THREE.TextureLoader();
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");

const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  alphaMap: doorAlphaTexture,
});
```

## Side

Three js 의 기본설정은 한쪽면만 visible 하게 두는 것이나, side 속성 조절로 양면 혹은 후면만 visible 하게 할 수 있다.

```js
const material = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
});
```

참고로 **Blender** 에서 export 하면 기본 설정이 양면이다. 성능을 신경쓴다면 한 면만 표시하도록 따로 설정해야 한다.

# MeshNormalMaterial

전에 봤던 normal 텍스쳐처럼, 파랑, 보라, 노랑, 초록 계열의 색을 쓰는 material 이다.

## Normals

> "Normals" are vectors that are perpendicular to the faces of the geometry. They are used to determine how light interacts with the geometry. The `MeshNormalMaterial` uses the normals of the geometry to determine the color of each pixel.

"Normals" 는 각 vertex 에 encoded 된 정보로, 면의 바깥쪽으로의 방향을 나타낸다. 이 정보를 이용해 빛이 어떻게 geometry 와 상호작용하는지 결정한다. (geometry 가 vetices 로 이루어져 있으니까) `MeshNormalMaterial` 은 geometry 의 normal 을 이용해 각 픽셀의 색을 결정한다. 이 때 **광원과 카메라의 위치와 연관되어** 결정된다.

# MeshMatcapMaterial

Matcap 이란 material capture 의 줄임말로, 미리 만들어진 material 을 사용하는 것이다. 이 material 은 미리 만들어진 구형 이미지를 포함하는 texture 를 reference 로 사용해 geometry 의 표면을 렌더링한다. (구를 포함하고 있는 것이지 텍스쳐는 여전히 사각형이다.)

이 reference 텍스쳐에 따라 geometry 의 표면이 어떻게 보일지 결정된다. 빛 방향과 강도까지 모방하기 때문에 이 material 은 빛의 위치와 상관없이 geometry 의 표면을 렌더링한다. 즉, 카메라 위치를 고정해둔다면 이 matcap 을 이용했을 때 성능을 극대화할 수 있다. (텍스쳐 하나로 빛의 위치와 강도를 모방하기 때문)

3d 소프트웨어나 2d 소프트웨어로 구형 이미지를 포함하는 texture 를 만들어서 사용할 수 있다.
matcap 들을 제공하는 github 도 있고 자신만의 [matcap 을 만들 수 있는 사이트](kcapelier.com/matcap-studio)도 배포되어 있다.

# MeshDepthMaterial

가깝고 먼 것에 대한 표현을 제공하나, 직접 다룰 일은 크게 없다.

# MeshLambertMaterial

이 Material 부터는 빛이 필요하다. MeshbasicMaterial 과 같은 properties 를 제공하나, 빛과 관련된 properties 들이 있다. 근데 사실 이 Material 보다 좋은 게 많아서 굳이 쓸 필요 없는 편이다.

# MeshPhongMaterial

빛의 반사도 (shininess)를 표현할 수 있으나, 좀 작위적인 느낌이라 잘 안 쓰게 되는 Material.

# MeshToonMaterial

덜 realistic 하지만 필요에 따라 유용하게 쓸 수 있는 Material.
gradientMap 을 쓸 수 있다. 그러나 단순히 gradientMap 에 값을 대입해도 적용되지 않는데, gradient 색들을 모아둔 작은 픽셀을 stretch 해서 적용해버리면 거의 티가 안나기 때문이다. 이건 기본적으로 적용되고 있는 mipmapping 때문으로, mipmapping 을 아예 끄거나 minFilter, magFilter 를 `THREE.NearestFilter` 로 바꿔주면 된다.

# MeshStandardMaterial

Texture 에서 봤던 것처럼 PBR 을 따르기 때문에 Standard 로 취급된다.즉, 다양한 3d 소프트웨어에서 비슷하게 결과물이 나온다. material metalness, roughness 등을 조절 가능하다.

# Environment Maps

scene 을 감싸고 있는 이미지 같은 것이다.

reflection, refraction(굴절) 등을 추가하기 위한 것인데, 현재 씬의 광원들 외의 빛까지 추가해준다. 따라서 environment Map 이 잘 되어 있으면 추가적인 빛 인스턴스들을 추가하지 않아도 된다.

`scene.background`, `scene.environment` 에 값을 설정한다.

```js
const rgbeLoader = new RGBELoader();
rgbeLoader.load("/textures/environmentMaps/0/bridge.hdr", (environmentMap) => {
  // 뭔지 잘 몰라도 일단 외워서 씀
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = environmentMap;
  scene.background = environmentMap;
});
```

# MeshPhysicalMaterial

MeshStandardMaterial 을 extend 한 Material 로, 더 많은 properties 를 제공한다. 더 realistic 하게 만들 수 있다. 성능상으로는 안 좋다.

- clearcoat: clearcoat 의 강도 (유리 레이어를 올린 것 같은 효과. 성능엔 안 좋음)
- sheen: 물체의 광택. 천의 폭신해보이는 느낌을 표현할 수 있다.
- iridescence: 무지갯빛 효과. cd 표면이나 비눗방울 표면의 느낌
- transmission: 물체 뒷편의 것이 투영되는 효과. (유리, 물 등) ior 은 `Index of Refraction` 을 의미한다. 다이아몬드가 2.417 정도
