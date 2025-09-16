//은하계 컴포넌트

import { useMemo } from 'react';
import StellarSystem from './StellarSystem';
import SimpleStellarPoint from './SimpleStellarPoint';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';
import useStellarSystemSelection from '@/hooks/useStellarSystemSelection';

// 임시 더미 데이터 (나중에 API로 교체)
const dummyStellarList = [
  { id: 'sys-001', stellarSystemPos: [0, 0, 0], starColor: 0 },
  { id: 'sys-002', stellarSystemPos: [20, 0, 0], starColor: 60 },
  { id: 'sys-003', stellarSystemPos: [-30, 0, 0], starColor: 120 },
  { id: 'sys-004', stellarSystemPos: [0, 1, 30], starColor: 180 },
  { id: 'sys-005', stellarSystemPos: [0, -2, 10], starColor: 240 },
  { id: 'sys-006', stellarSystemPos: [0, 0, 120], starColor: 300 },
  { id: 'sys-007', stellarSystemPos: [0, 0, -130], starColor: 45 },
];

export default function Galaxy() {
  const { selectedStellarId } = useSelectedStellarStore();
  const { selectStellar } = useStellarSystemSelection();

  // 선택된 스텔라 정보
  const selectedStellar = useMemo(() => {
    return dummyStellarList.find((stellar) => stellar.id === selectedStellarId);
  }, [selectedStellarId]);

  // 선택되지 않은 스텔라들
  const unselectedStellars = useMemo(() => {
    return dummyStellarList.filter(
      (stellar) => stellar.id !== selectedStellarId
    );
  }, [selectedStellarId]);

  const handleStellarClick = (stellarId: string) => {
    selectStellar(stellarId);
  };

  return (
    <group>
      {/* 선택된 스텔라만 디테일 렌더링 */}
      {selectedStellar && (
        <StellarSystem
          key={selectedStellar.id}
          stellarSystemPos={
            selectedStellar.stellarSystemPos as [number, number, number]
          }
          id={selectedStellar.id}
        />
      )}

      {/* 선택되지 않은 스텔라들은 심플 포인트로 렌더링 */}
      {unselectedStellars.map((stellar) => (
        <SimpleStellarPoint
          key={stellar.id}
          position={stellar.stellarSystemPos as [number, number, number]}
          color={stellar.starColor}
          onClick={() => handleStellarClick(stellar.id)}
        />
      ))}
    </group>
  );
}
