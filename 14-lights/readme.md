# Lights

## Ambient Light

실제 세계에서는 빛이 반사되면서 직접 빛을 맞이하지 않는 면도 어느정도 보인다. 그러나 그래픽엔진 세계에서는 그런 빛의 반사를 표현하기 어렵고, 따라서 Ambient Light 로 전체적인 윤곽을 고르게 비춰주는 역할을 대신하게 된다. 즉, 다른 light 를 쓰더라도 Ambient Light 는 기본으로 깔고 가는 경우가 많다.

## Directional Light

방향성을 가진 빛. 기본값으로 center 를 향해서 평행한 빛을 내리쬔다. 무한대로 뻗어나가는 빛이기에 떨어진 거리와 상관 없이 고르게 비춰진다.

## Hemisphere Light

하늘과 지표면을 기준으로 빛을 비추는 빛. 하늘색과 지표면색 2개를 설정하면 위에서부터는 하늘색, 아래에서는 지표면색으로 빛을 비춘다. Ambient Light 와 비슷하게 전체적으로 빛을 비추지만, 위아래 색상을 정해서 자연스럽게 섞이게 할 수 있다.

## Point Light

특정 지점에서 모든 방향으로 빛을 내리쬔다. 3번째 인자로 decay 값을 넣어주면 거리에 따라 빛의 강도가 줄어들도록 설정할 수 있다.

## RectArea Light

MeshStandardMaterial 과 MeshPhysicalMaterial 에서만 사용할 수 있는 빛. 사각형 모양의 빛을 내리쬔다. 빛의 강도는 사각형의 크기와 강도로 결정된다.

## Spot Light

원형의 빛을 내리쬔다. 특이점은 쬐는 방향을 바꾸려면 `spotLight.target` 위치를 바꾼 후 다시 scene 에 add 해줘야만 제대로 동작한다.

# 성능 순서 (좋은 것부터 나열)

- Ambient Light & HemisphereLight
- Directional Light & Point Light
- Spot Light & RectArea Light

# Baking

빛을 미리 계산해서 texture 로 만들어두는 것. 빛을 계산하는 것은 매우 무거운 작업이기 때문에, 미리 계산해두면 렌더링 속도가 빨라진다. (즉 baking 후의 scene 에는 Light 객체가 존재하지 않는데도 자연스러운 빛의 반사를 볼 수 있다.) 그러나 한 번 계산 후 텍스쳐로 빚어내고 나면, 2d 이미지로 고정되는 것이기 때문에 빛이나 geometry 가 바뀌면 다시 계산해야 한다.

# Helpers

빛의 위치와 방향을 확인하기 편하게 하기 위해 Helper 클래스에 Light 객체를 넣어서 확인할 수 있다.
