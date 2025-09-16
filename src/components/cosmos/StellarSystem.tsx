import { useRef } from 'react';
import * as THREE from 'three';
import Star from './Star';
import Planet from './Planet';
import { useStellarStore } from '@/stores/useStellarStore';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';

// 순수한 디테일 스텔라 시스템 컴포넌트
// 선택된 스텔라만 렌더링하므로 조건부 로직 불필요
export default function StellarSystem({
  stellarSystemPos,
  id,
  visible = true,
}: {
  stellarSystemPos: [number, number, number];
  id: string;
  visible?: boolean;
}) {
  const { stellarStore } = useStellarStore();
  const { selectedStellarId } = useSelectedStellarStore();
  const ref = useRef<THREE.Group>(null);

  // 선택된 스텔라가 아니면 렌더링하지 않음
  if (selectedStellarId !== id) {
    return null;
  }

  return (
    <group ref={ref} position={stellarSystemPos} visible={visible}>
      {/* 항성 렌더링 */}
      {stellarStore.star && (
        <Star star={stellarStore.star} position={[0, 0, 0]} />
      )}

      {/* 행성들 렌더링 */}
      {stellarStore.planets &&
        Array.isArray(stellarStore.planets) &&
        stellarStore.planets.map((planet) => (
          <Planet key={planet.id} planet={planet} isSelectable={true} />
        ))}
    </group>
  );
}
