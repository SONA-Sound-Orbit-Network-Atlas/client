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
    setCameraTarget,
  } = useSceneStore();

  // 항성계 뷰 진입
  const enterStellarSystemView = useCallback(
    (stellarSystemId: number) => {
      // 데이터 로딩
      const mockStellarSystem = getStellarSystemOnMock(stellarSystemId);
      const newCameraTarget = new THREE.Vector3(
        ...mockStellarSystem.stellarSystemPos
      );

      // 모든 상태를 한 번에 업데이트
      setSelectedStellarSystemId(stellarSystemId);
      setSelectedStellarSystem(mockStellarSystem);
      setCameraTarget(newCameraTarget);
      setViewMode('StellarSystem');
    },
    [
      setSelectedStellarSystemId,
      setSelectedStellarSystem,
      setViewMode,
      setCameraTarget,
    ]
  );

  const changeToGalaxyView = useCallback(() => {
    setViewMode('Galaxy');
    setSelectedStellarSystemId(null);
    setSelectedStellarSystem(null);
  }, [setViewMode, setSelectedStellarSystemId, setSelectedStellarSystem]);

  return { enterStellarSystemView, changeToGalaxyView };
}
