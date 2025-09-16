import { useMemo, useRef, useEffect } from 'react';
import Star from './Star';
import Planet from './Planet';
import * as THREE from 'three';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';
import { useStellarStore } from '@/stores/useStellarStore';
import useStellarSystemSelection from '@/hooks/useStellarSystemSelection';
import { valueToColor } from '@/utils/valueToColor';
import { FakeGlowMaterial } from './materials/FakeGlowMaterial';
import type {
  Planet as PlanetType,
  CentralStar as CentralStarType,
} from '@/types/old_stellar';
//항성계 컴포넌트

export default function StellarSystem({
  stellarSystemPos,
  id,
  starColor,
}: {
  stellarSystemPos: [number, number, number];
  id: string;
  starColor: number;
}) {
  const { stellarStore } = useStellarStore();
  const { mode, selectedStellarId } = useSelectedStellarStore();
  const { selectStellar } = useStellarSystemSelection();

  const ref = useRef<THREE.Group>(null);
  const detailGroupRef = useRef<THREE.Group>(null);
  const lowDetailMesh = useRef<THREE.Mesh>(null);
  const lowDetailGlowMesh = useRef<THREE.Mesh>(null);
  const LOW_DETAIL_SIZE = 0.5;

  // starColor를 색상으로 변환
  const starColorHex = valueToColor(starColor, 0, 360);

  const isSelectedSystem = useMemo(() => {
    return (mode === 'view' && selectedStellarId === id) || mode === 'create';
  }, [mode, selectedStellarId, id]);

  // 중앙별 찾기 (planetId가 0인 객체)
  const centralStar = useMemo(() => {
    if (!stellarStore.objects || !Array.isArray(stellarStore.objects)) {
      return undefined;
    }
    return stellarStore.objects.find(
      (obj) => obj.planetId === 0 && obj.planetType === 'CENTRAL STAR'
    ) as CentralStarType | undefined;
  }, [stellarStore.objects]);

  const onStellarSystemClicked = () => {
    selectStellar(id);
  };
  useEffect(() => {
    if (
      detailGroupRef.current &&
      lowDetailMesh.current &&
      lowDetailGlowMesh.current
    ) {
      // isSelectedSystem 값에 따라 두 요소의 visible 속성을 간단하게 할당
      detailGroupRef.current.visible = isSelectedSystem;
      lowDetailMesh.current.visible = !isSelectedSystem && mode === 'idle';
      lowDetailGlowMesh.current.visible = !isSelectedSystem && mode === 'idle';
    }
  }, [isSelectedSystem, mode]);

  return (
    <group ref={ref} position={stellarSystemPos}>
      <mesh
        ref={lowDetailMesh}
        onClick={onStellarSystemClicked}
        renderOrder={1}
      >
        <sphereGeometry args={[LOW_DETAIL_SIZE, 16, 16]} />
        <meshStandardMaterial
          color={starColorHex}
          emissive={starColorHex}
          emissiveIntensity={0.3}
          toneMapped={false}
        />
      </mesh>
      {/* 은은한 FakeGlowMaterial 추가 */}
      <mesh ref={lowDetailGlowMesh} renderOrder={0}>
        <sphereGeometry args={[LOW_DETAIL_SIZE * 3, 16, 16]} />
        <FakeGlowMaterial
          falloff={0.2}
          glowInternalRadius={3.7}
          glowColor={starColorHex}
          glowSharpness={0}
          side={THREE.DoubleSide}
          depthTest={true}
          depthWrite={false}
        />
      </mesh>
      <group ref={detailGroupRef}>
        {centralStar && <Star centralStar={centralStar} position={[0, 0, 0]} />}
        {stellarStore.objects &&
          Array.isArray(stellarStore.objects) &&
          stellarStore.objects.map((object) => {
            if (object.planetId === 0) return null;
            const planetObject = stellarStore.objects[object.planetId];
            if (!planetObject || !planetObject.properties) return null;

            return (
              <Planet
                key={object.planetId}
                planet={planetObject as PlanetType}
                isSelectable={isSelectedSystem}
              />
            );
          })}
      </group>
    </group>
  );
}
