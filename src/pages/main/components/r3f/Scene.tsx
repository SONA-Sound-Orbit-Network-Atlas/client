import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import StarsField from './StarsField';
import HeroCube from './HeroCube';

type Props = {
  ready: boolean;
  totalPages?: number;
};

export default function Scene({ ready, totalPages = 5 }: Props) {
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
      <color attach="background" args={['#001122']} />{' '}
      {/* 살짝 푸른빛이 도는 배경 */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 5, 2]} intensity={0.8} />
      <StarsField count={2500} /> {/* 배경 조명 효과를 위해 별 개수 증가 */}
      <HeroCube totalPages={totalPages} />
      {/* 블룸 효과 */}
      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          radius={0.4}
        />
      </EffectComposer>
      {/* 필요 시 scroll.offset으로 글로벌 타임라인을 만들 수 있음 */}
      {/* console.log(scroll.offset) */}
    </>
  );
}
