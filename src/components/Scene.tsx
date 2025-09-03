import { Grid } from '@react-three/drei';
import * as THREE from 'three';
import Galaxy from './cosmos/Galaxy';
import { useSceneStore } from '@/stores/useSceneStore';
import { useEffect } from 'react';
import MainCamera from './systems/MainCamera';
import BackgroundStars from './cosmos/BackgroundStars';

// 화면 표시
export default function Scene() {
  const { focusedPosition, setViewMode } = useSceneStore();
  const axesHelper = new THREE.AxesHelper(5);

  useEffect(() => {
    if (focusedPosition) {
      setViewMode('StellarSystem');
    } else {
      setViewMode('Galaxy');
    }
  }, [focusedPosition]);

  return (
    <>
      {/* 조명 설정 */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 10]} intensity={1} />

      {/* 별자리 시스템 */}
      <group layers={0}>
        <Galaxy />
      </group>

      {/* 그리드 헬퍼 (공간감을 위해) */}
      <Grid args={[20, 20]} />

      {/* 축 헬퍼 */}
      <primitive object={axesHelper} />

      <MainCamera />

      {/* 배경 */}
      <BackgroundStars />
    </>
  );
}
