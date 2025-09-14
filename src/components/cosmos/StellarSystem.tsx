import { useMemo, useRef, useEffect } from 'react';
import Star from './Star';
import Planet from './Planet';
import * as THREE from 'three';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';
import OrbitLine from './OrbitLine';
import { useStellarStore } from '@/stores/useStellarStore';
import useStellarSystemSelection from '@/hooks/useStellarSystemSelection';
import type {
  Planet as PlanetType,
  CentralStar as CentralStarType,
} from '@/types/stellar';
//항성계 컴포넌트

export default function StellarSystem({
  stellarSystemPos,
  id,
}: {
  stellarSystemPos: [number, number, number];
  id: string;
}) {
  const { stellarStore } = useStellarStore();
  const { mode, selectedStellarId } = useSelectedStellarStore();
  const { selectStellar } = useStellarSystemSelection();

  const ref = useRef<THREE.Group>(null);
  const detailGroupRef = useRef<THREE.Group>(null);
  const lowDetailMesh = useRef<THREE.Mesh>(null);
  const LOW_DETAIL_SIZE = 0.5;

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
    if (detailGroupRef.current && lowDetailMesh.current) {
      // isSelectedSystem 값에 따라 두 요소의 visible 속성을 간단하게 할당
      detailGroupRef.current.visible = isSelectedSystem;
      lowDetailMesh.current.visible = !isSelectedSystem && mode === 'idle';
    }
  }, [isSelectedSystem, mode]);

  return (
    <group ref={ref} position={stellarSystemPos}>
      <mesh
        ref={lowDetailMesh}
        onClick={onStellarSystemClicked}
        renderOrder={1}
      >
        <sphereGeometry args={[LOW_DETAIL_SIZE, 8, 8]} />
        <meshStandardMaterial
          color="#ff6b6b"
          emissive="#ffffff"
          emissiveIntensity={0.5}
          toneMapped={false}
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
              <>
                <OrbitLine
                  orbitRadius={
                    planetObject.properties.find(
                      (prop) => prop.label === 'distanceFromStar'
                    )?.value || object.planetId + 1
                  }
                  inclination={
                    planetObject.properties.find(
                      (prop) => prop.label === 'inclination'
                    )?.value || 0
                  }
                  eccentricity={
                    planetObject.properties.find(
                      (prop) => prop.label === 'eccentricity'
                    )?.value || 0
                  }
                />
                <Planet
                  key={object.planetId}
                  planet={planetObject as PlanetType}
                  isSelectable={isSelectedSystem}
                />
              </>
            );
          })}
      </group>
    </group>
  );
}
