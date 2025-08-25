import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import StarsField from './StarsField';
import ImageCarousel from './ImageCarousel';

type Props = {
  ready: boolean;
  autoExpandStars?: boolean;
  useOrbitControls?: boolean;
  zoom?: number;
};

export default function Scene({
  ready,
  autoExpandStars = false,
  useOrbitControls = false,
  zoom = 10,
}: Props) {
  // ready 전에는 배경 어둡게, ready 이후 서서히 밝기/색상 보간
  useFrame(({ scene }, dt) => {
    const bg = scene.background as THREE.Color | null;
    if (bg && ready) bg.lerp(new THREE.Color('#000000'), dt * 0.5);
  });

  useEffect(() => {
    // 초기 배경 세팅
    // @ts-expect-error THREE 타입 추가
    window.THREE = THREE; // 디버깅 편의(선택)
  }, []);

  return (
    <>
      <color attach="background" args={['#000000']} />
      {/* 카메라 컨트롤 - ScrollControls 사용 시에는 비활성화 */}
      {useOrbitControls && (
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
          enableDamping={false}
        />
      )}
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 5, 2]} intensity={0.8} />
      <StarsField count={2500} autoExpand={autoExpandStars} />
      {/* 이미지 갤러리 */}
      <ImageCarousel zoom={zoom} />
      {/* 블룸 효과 - 이미지 밝기 조절 */}
      <EffectComposer>
        <Bloom
          intensity={0.3} // 블룸 강도 낮춤 (1.5 → 0.3)
          luminanceThreshold={0.8} // 밝기 임계값 높임 (0.0 → 0.8) - 더 밝은 것만 빛남
          luminanceSmoothing={0.4}
          radius={0.5} // 블룸 범위 축소 (0.85 → 0.5)
        />
      </EffectComposer>
    </>
  );
}
