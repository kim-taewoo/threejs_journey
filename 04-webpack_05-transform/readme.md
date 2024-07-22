# Three.js Journey

모든 Object3D 를 상속받은 것들은(카메라, mesh 등) position, scale, rotation, quaternion(얘도 일종의 roation 관련) 속성을 가지고 있다. 이것들은 모두 결국엔 Matrices 로 변환되나, 아직까진 이 Matrices 를 직접 다루지 않아도 된다.

## Setup

Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

```bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```

## Methods

mesh.position.length()
mesh.position.distanceTo(otherVector3)
mesh.position.normalize()
