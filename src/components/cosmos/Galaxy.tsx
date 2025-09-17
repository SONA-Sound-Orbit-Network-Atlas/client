//은하계 컴포넌트
import { useMemo } from 'react';
import StellarSystem from './StellarSystem';
import SimpleStellarPoint from './SimpleStellarPoint';
import LoadingStellarSystem from './LoadingStellarSystem';
import { useStellarList } from '@/hooks/api/useGalaxy';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';
import useStellarSystemSelection from '@/hooks/useStellarSystemSelection';
import type { simpleStellar } from '@/types/galaxy';

interface GalaxyProps {
  galaxyId?: string;
}

export default function Galaxy({ galaxyId = 'gal_abc123' }: GalaxyProps) {
  const {
    data: galaxyStellarListData,
    isLoading,
    error,
  } = useStellarList(galaxyId);
  const { selectedStellarId } = useSelectedStellarStore();
  const { selectStellar } = useStellarSystemSelection();

  // 스텔라 리스트 가져오기 - 안전한 데이터 처리
  const stellarSystems: simpleStellar[] = useMemo(() => {
    // 데이터가 없거나 배열이 아닌 경우 빈 배열 반환
    if (!galaxyStellarListData || !Array.isArray(galaxyStellarListData)) {
      console.warn(
        'Galaxy: Invalid stellar data received:',
        galaxyStellarListData
      );
      return [];
    }
    return galaxyStellarListData;
  }, [galaxyStellarListData]);

  const handleStellarClick = (stellarId: string) => {
    selectStellar(stellarId);
  };

  // 로딩 상태 처리
  if (isLoading) {
    return <LoadingStellarSystem text="갤럭시 데이터를 불러오는 중..." />;
  }

  // 에러 상태 처리
  if (error) {
    console.error('Galaxy: Error loading stellar data:', error);
    return (
      <LoadingStellarSystem text="데이터를 불러오는 중 오류가 발생했습니다." />
    );
  }

  // 데이터가 아직 로드되지 않은 상태 (undefined)
  if (galaxyStellarListData === undefined) {
    return <LoadingStellarSystem text="갤럭시 데이터를 준비하는 중..." />;
  }

  // 빈 상태 처리
  if (!stellarSystems.length) {
    return <LoadingStellarSystem text="표시할 스텔라 시스템이 없습니다." />;
  }

  return (
    <group>
      {/* 선택된 스텔라만 디테일 렌더링 */}
      {selectedStellarId && (
        <StellarSystem key={selectedStellarId} id={selectedStellarId} />
      )}

      {/* 모든 스텔라를 심플 포인트로 렌더링 */}
      {stellarSystems.map((stellar: simpleStellar) => (
        <SimpleStellarPoint
          key={stellar.id}
          position={stellar.position}
          color={stellar.color}
          onClick={() => handleStellarClick(stellar.id)}
        />
      ))}
    </group>
  );
}
