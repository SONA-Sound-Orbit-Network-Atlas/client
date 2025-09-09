import { detailStellarSystemsMock } from '@/mocks/data/stellarSystems';
import { useSceneStore } from '@/stores/useSceneStore';
import { useCallback } from 'react';
import * as THREE from 'three';

const getStellarSystemOnMock = (stellarSystemId: number) => {
  return detailStellarSystemsMock[stellarSystemId];
};

export function useStellarSystem() {
  // 선택한 항성계 변경
  const {
    setSelectedStellarSystemId,
    setSelectedStellarSystem,
    setViewMode,
    setFocusedPosition,
  } = useSceneStore();

  // 항성계 뷰 진입
  const enterStellarSystemView = useCallback(
    (stellarSystemId: number) => {
      const mockStellarSystem = getStellarSystemOnMock(stellarSystemId);
      setViewMode('StellarSystem');
      setSelectedStellarSystemId(stellarSystemId);
      // TODO : ID로 항성계 조회 api 호출
      if (mockStellarSystem) {
        setSelectedStellarSystem(mockStellarSystem);
      }
      setFocusedPosition(
        new THREE.Vector3(...mockStellarSystem.stellarSystemPos)
      );
    },
    [
      setSelectedStellarSystemId,
      setSelectedStellarSystem,
      setFocusedPosition,
      setViewMode,
    ]
  );

  return { enterStellarSystemView };
}
