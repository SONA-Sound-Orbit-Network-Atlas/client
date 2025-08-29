import { Grid } from '@react-three/drei';
import * as THREE from 'three';
import Galaxy from './cosmos/Galaxy';
import { useSceneStore } from '@/stores/useSceneStore';
import { useEffect } from 'react';
import MainCamera from './systems/MainCamera';

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
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      {/* 별자리 시스템 */}
      <Galaxy />

      {/* 그리드 헬퍼 (공간감을 위해) */}
      <Grid args={[20, 20]} />

      {/* 축 헬퍼 */}
      <primitive object={axesHelper} />

      <MainCamera />
    </>
  );
}
