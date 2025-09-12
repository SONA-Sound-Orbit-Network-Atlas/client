import { useMemo, useRef } from 'react';
import Star from './Star';
import Planet from './Planet';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';
import OrbitLine from './OrbitLine';
import { useStellarSystem } from '@/hooks/useStellarSystem';
import { useStellarStore } from '@/stores/useStellarStore';
//항성계 컴포넌트

export default function StellarSystem({
  stellarSystemPos,
  id,
}: {
  stellarSystemPos: [number, number, number];
  id: string;
}) {
  const { enterStellarSystemView } = useStellarSystem();
  const { stellarStore } = useStellarStore();
  const { mode, selectedStellarId } = useSelectedStellarStore();

  const ref = useRef<THREE.Group>(null);
  const detailGroupRef = useRef<THREE.Group>(null);
  const lowDetailMesh = useRef<THREE.Mesh>(null);
  const LOW_DETAIL_SIZE = 0.5;

  const isSelectedSystem = useMemo(() => {
    return (mode === 'view' && selectedStellarId === id) || mode === 'create';
  }, [mode, selectedStellarId, id]);

  const onStellarSystemClicked = () => {
    if (isSelectedSystem) {
      return;
    }
    enterStellarSystemView(selectedStellarId);
  };
  useFrame(() => {
    // 선택된 시스템만 디테일 그룹 표시, 선택되지 않은 시스템은 로우 디테일 매쉬만 표시
    if (!detailGroupRef.current || !lowDetailMesh.current) return;

    // 선택된 시스템인지에 따라 표시/숨김 처리
    detailGroupRef.current.visible = isSelectedSystem;
    lowDetailMesh.current.visible = !isSelectedSystem;
  });

  return (
    <group
      ref={ref}
      position={stellarSystemPos}
      onClick={onStellarSystemClicked}
    >
      <group ref={detailGroupRef}>
        <Star position={[0, 0, 0]} color="#ff6b6b" size={1} />
        {stellarStore.objects.map((object) => {
          if (object.planetId === 0) return null;
          return (
            <>
              <OrbitLine
                orbitRadius={
                  stellarStore.objects[object.planetId].properties.find(
                    (prop) => prop.label === 'distanceFromStar'
                  )?.value || object.planetId + 1
                }
                inclination={
                  stellarStore.objects[object.planetId].properties.find(
                    (prop) => prop.label === 'inclination'
                  )?.value || 0
                }
                eccentricity={
                  stellarStore.objects[object.planetId].properties.find(
                    (prop) => prop.label === 'eccentricity'
                  )?.value || 0
                }
              />
              <Planet
                key={object.planetId}
                id={object.planetId}
                distanceFromStar={
                  stellarStore.objects[object.planetId].properties.find(
                    (prop) => prop.label === 'distanceFromStar'
                  )?.value || object.planetId + 1
                }
                orbitSpeed={
                  stellarStore.objects[object.planetId].properties.find(
                    (prop) => prop.label === 'orbitSpeed'
                  )?.value || 0.5
                }
                planetSize={
                  stellarStore.objects[object.planetId].properties.find(
                    (prop) => prop.label === 'planetSize'
                  )?.value || 0.3
                }
                // planetColor={
                //   stellarStore.objects[index].properties.find(
                //     (prop) => prop.label === 'planetColor'
                //   )?.value || '#FFFFFF'
                // }
                planetColor={'#FFFFFF'}
                planetBrightness={
                  stellarStore.objects[object.planetId].properties.find(
                    (prop) => prop.label === 'planetBrightness'
                  )?.value || 0.3
                }
                eccentricity={
                  stellarStore.objects[object.planetId].properties.find(
                    (prop) => prop.label === 'eccentricity'
                  )?.value || 0
                }
                tilt={
                  stellarStore.objects[object.planetId].properties.find(
                    (prop) => prop.label === 'tilt'
                  )?.value || 0
                }
                rotationSpeed={
                  stellarStore.objects[object.planetId].properties.find(
                    (prop) => prop.label === 'rotationSpeed'
                  )?.value || 0.01
                }
                inclination={
                  stellarStore.objects[object.planetId].properties.find(
                    (prop) => prop.label === 'inclination'
                  )?.value || 0
                }
                isSelectable={isSelectedSystem}
              />
            </>
          );
        })}
      </group>
      <mesh ref={lowDetailMesh} onClick={onStellarSystemClicked}>
        <sphereGeometry args={[LOW_DETAIL_SIZE, 8, 8]} />
        <meshStandardMaterial
          color="#ff6b6b"
          emissive="#ffffff"
          emissiveIntensity={0.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
