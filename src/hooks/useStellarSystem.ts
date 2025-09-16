import { useSceneStore } from '@/stores/useSceneStore';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';
import { useStellarStore } from '@/stores/useStellarStore';
import { useCallback } from 'react';

import * as THREE from 'three';

export function useStellarSystem() {
  // 선택한 항성계 변경
  const { setCameraTarget } = useSceneStore();
  const { setSelectedStellarId, setIdle } = useSelectedStellarStore();
  const { stellarStore } = useStellarStore();
  // 항성계 뷰 진입
  const enterStellarSystemView = useCallback(
    (stellarSystemId: string) => {
      console.log('enterStellarSystem', stellarSystemId);
      // // 데이터 로딩
      // const mockStellarSystem = getStellarSystemOnMock(stellarSystemId);
      // const newCameraTarget = new THREE.Vector3(
      //   ...mockStellarSystem.stellarSystemPos
      // );

      // 모든 상태를 한 번에 업데이트
      // setSelectedStellarSystemId(stellarSystemId);
      setSelectedStellarId(stellarSystemId);

      // setSelectedStellarSystem(mockStellarSystem);
      const position = stellarStore.position ?? [0, 0, 0];
      const newCameraTarget = new THREE.Vector3(...position);
      setCameraTarget(newCameraTarget);
      // setViewMode('StellarSystem');
    },
    [setSelectedStellarId, setCameraTarget, stellarStore]
  );

  const changeToGalaxyView = useCallback(() => {
    // setViewMode('Galaxy');
    setIdle();
    // setSelectedStellarSystemId(null);
    // setSelectedStellarSystem(null);
  }, [setIdle]);

  return { enterStellarSystemView, changeToGalaxyView };
}
