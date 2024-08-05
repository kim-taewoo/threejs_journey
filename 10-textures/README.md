# Textures

- Textures 는 geometries 를 어떻게 cover 하는지에 관한 것이다. 이 'cover' 한다는 건 단순히 색을 입히는 것 이상이다.
- 즉, Textures 는 다양한 타입이 있다.

## Textures Types

주요한 텍스쳐 타입은 다음과 같다.

- Color: 색
- Alpha: 흑백이며, 검정은 보이지 않고, 흰색은 100% 보이고, 회색은 반만 보이고 이런 거
- Height(displacement): 흑백이며, 규칙에 따라 높낮이를 나타낸다. 예로 흰색이면 어떤 Vertices 를 위로 올리고 검은색이면 내리고 회색이면 움직이지 않는다. subdivision 이 필요하다. (즉, height 텍스쳐가 움직일 vertices 정보가 있어야 한다.)
- Normal: 보라색, 푸른빛깔의 텍스쳐. 디테일을 추가하는 역할을 하는데 보통 'Lighting' 에 관한 것이다.
  - Normal 맵은 subdivision 이 필요 없으며, Height map 처럼 Vertices 를 움직이는 게 아니다.
  - 디테일을 나타내지만 여전히 평면이긴 한 상당히 흥미로운 map 이다. (빛으로 디테일을 빚어내는 느낌?)
  - Height 맵과 달리 subdivision 이 불필요하고 Vertices 를 조절하는 게 아니어서 성능이 더 좋다.
- Ambient occulusion: 흑백이며, 그림자를 '흉내'낸다. 즉 진짜 빛의 반사를 계산하는 게 아닌 틈 (crevices) 사이에 가짜 그림자를 표현하면서 Physically accurate 하진 않아도 디테일을 추가할 수 있게 한다.
- Metalness: 흑백이며, 흰색은 금속, 검은색은 금속이 아님을 나타낸다. 보통 금속의 '반사' 부분을 표현하기 위해 사용한다.
- Roughness: 흑백이며, Metalness 와 같이 사용되는 경우가 많다. 흰색부분은 거칠고 검은색 부분은 부드러움을 나타낸다. 빛의 흡수도를 나타내기 위해 쓴다. (어려운 말로 '빛의 소산'(dissipation of light) 을 다룬다.)

## PBR

- 텍스쳐들은 (특히 metalness, roughness) PBR(Physically Based Rendering) 을 따르려고 한다.
- PBR 이란 실제 현실과 가까운 계산을 지향하는 것이다.
- PBR 에 대해서 더 알고 싶다면(어떤식으로 계산하는지 등) 아래 글들을 읽어보자.
- https://marmoset.co/posts/basic-theory-of-physically-based-rendering/
- https://marmoset.co/posts/physically-based-rendering-and-you-can-too/

## Texture 사용법

이미지를 곧바로 사용할 수는 없어서 Texture 로 변환해서 써야 한다. Three.js 의 Texture 클래스를 사용함으로써 GPU 에서 쓰기 좋은 형태로 변환하고 추가적인 메서드들도 활용할 수 있다.

### THREE.Texture 사용시

```javascript
const image = new Image();
// 이미지를 로딩할 때까지 texture 를 제대로 만들 수 없지만, 코드 호이스팅 이슈가 있으므로 미리 선언해둔다.
const texture = new THREE.Texture(image);
// .map 과 .matcap 을 이용해서 texture 를 material 에 적용할 때, colorSpace 를 sRGB 로 설정해주는 것이 좋다. 원래는 이게 디폴트 값인데, 최신버전에서는 명시해주도록 하고 있다고 한다.
texture.colorSpace = THREE.sRGBEncoding;

image.src = "path/to/image.jpg";

image.onload = () => {
  // 이미지 로딩이 끝나면 texture 를 업데이트 해줘야 한다.
  texture.needsUpdate = true;
};

// ...

// material 에 texture 를 적용할 때는 map, matcap 등을 사용한다.
const material = new THREE.MeshBasicMaterial({ map: texture });
```

### THREE.TextureLoader 사용시

TextureLoader 클래스를 사용하면 위의 과정을 보다 간단하게 할 수 있다.

```javascript
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("path/to/image.jpg");
// 하나의 loader 로 여러 개의 texture 를 로딩할 수 있다.
const texture2 = textureLoader.load("path/to/image2.jpg");
```

`.load()` 는 load, progress, error 때의 콜백을 파라미터로 받는다. 다만 progress 의 경우는 어떻게 동작하는지 불분명해서 잘 사용하지 않는다.

## LoadingManager

여러 개의 texture 를 로딩할 때, 각각의 texture 가 로딩될 때마다 progress 를 업데이트하고, 모든 texture 가 로딩되면 어떤 동작을 실행하도록 할 수 있다.

```javascript
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
  console.log("Loading started");
};

loadingManager.onLoad = () => {
  console.log("All loaded");
};

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  console.log(`Loading ${url}: ${itemsLoaded} of ${itemsTotal}`);
};

loadingManager.onError = (url) => {
  console.log(`Error loading ${url}`);
};

// 이런식으로 loader 를 초기화할 때 loadingManager 를 넣어준다.
const textureLoader = new THREE.TextureLoader(loadingManager);
const texture = textureLoader.load("path/to/image.jpg");
const texture2 = textureLoader.load("path/to/image2.jpg");
// ... 이런식으로 여러 개의 texture 를 로딩할 때 loadingManager 가 전부 관리할 수 있다.
```

## UV Unwrapping

texture 가 geometry 에 어떻게 매핑되는지(how the texture is placed on the geometry)를 결정하는 것이 UV unwrapping 이다. 예를 들어, geometry 가 단순 큐브인지, 도넛 모양인지, 삼각뿔 모양인지 등에 따라 texture 가 입혀지는 방식이 달라져야 하는 것이다.

### UV Coordinates

각 vertex 들은 3d 상에서의 좌표점 뿐 아니라 2d 상에서의 좌표점을 가지고 있다. 이 2d 좌표점이 UV coordinate 이며, 이게 texture 의 어느 부분에 매핑되는지 결정한다. (보통 2d 사각형 형태의 텍스쳐다.) 0~1 의 값을 주로 사용한다.

```js
const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
// itemSize 이 2 인 array 를 확인할 수 있다.
console.log(geometry.attributes.uv);
```

#### vertices 개수

https://www.reddit.com/r/threejs/comments/s71axy/comment/ht7lwlj/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&u
geometry.attributes.uv 를 보면, 단순 큐브의 count 가 24 이다.
이는 큐브의 6개의 면이 각각 4개의 정점을 가지고 있기 때문이다.
즉 6\*4 = 24 가 되는 것이다.

중복되는 vertices 가 있는 이유는 각 vertex는 원래 normal data 를 가지고 있고,
이 추가적인 3차원 데이터는 보통 object 를 부드럽게 보이도록 하는데 사용된다.
아무튼 이 계산을 위해 인접한 면마다 별도의 normal 값, 즉 3개의 vertex 가 필요하다.

한편 geometry.index 를 보면, 큐브의 인덱스가 36개로 되어있다.
이는 큐브의 6개의 면이 각각 2개의 삼각형을 가지고 있어 삼각형이 총 12개가 되고,
각 삼각형이 3개의 정점을 가지고 있기 때문에 12\*3 = 36 이 되는 것이다.
여기서 index 는 어떻게 삼각형을 만들어야 할지를(그룹지어 면을 만들지를) 알려주는 역할을 한다.

#### 커스텀 UV

직접 geometry 를 만든다면 uv coordinate 를 직접 설정해야 한다. 3d 소프트웨어를 통해서도 마찬가지긴 하나, 대부분 자동으로 설정되기 때문에 크게 신경쓰지 않는다.

## Transforming the texture

텍스쳐를 변형시키는 여러가지 방법이 있다.

- Repeat
  - 기본 설정이 repeat 하지 않는 것이기 때문에 RepeatWrapping 설정을 해주지 않으면 stretched 되는등 보기 안 좋을 수 있다.
- offset
- rotation
- center

## Filtering and Mipmapping

> Mipmapping (or "mip mapping" with a space) is a technique that consists of creating half a smaller version of a texture again and again until you get a 1x1 texture. All those texture variations are sent to the GPU, and the GPU will choose the most appropriate version of the texture. Three.js and the GPU already handle all of this, and you can just set what filter algorithm to use. There are two types of filter algorithms: the minification filter and the magnification filter.

Mipmapping 으로 어떤 텍스쳐를 사용할 때 다양한 크기의 텍스쳐를 미리 만들어 GPU 에 보내고, GPU 가 가장 적절한 텍스쳐를 선택하게 한다. Three.js 가 이미 이 프로세스를 자동으로 하고 있으니, 우리는 텍스쳐를 확대하거나 축소할 때, 어떤 필터 알고리즘을 사용할지 설정하면 된다. 두 가지 필터 알고리즘은 minification filter 와 magnification filter 가 있다.

성능상으로 NearestFilter 를 쓰는 것이 좋다. 성능이 더 좋고, 텍스쳐가 더 선명해 보인다.

minFilter 에 NearestFilter 를 쓴다면 mipmapping 이 필요없다.
그래서 `texture.generateMipmaps = false` 를 해줌으로써 불필요한 mipmaps 를 생성하지 않도록 할 수 있다. (GPU 에 작은 사이즈의 텍스쳐만 전달되게 되므로 성능향상)

## Texture Format and Optimization
