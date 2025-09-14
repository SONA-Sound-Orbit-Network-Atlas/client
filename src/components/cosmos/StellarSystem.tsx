import { useMemo, useRef, useEffect } from 'react';
import Star from './Star';
import Planet from './Planet';
import * as THREE from 'three';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';
import OrbitLine from './OrbitLine';
import { useStellarStore } from '@/stores/useStellarStore';
import useStellarSystemSelection from '@/hooks/useStellarSystemSelection';
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

  const onStellarSystemClicked = () => {
    console.log('onStellarSystemClicked', id);
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
                planetColor={
                  stellarStore.objects[object.planetId].properties.find(
                    (prop) => prop.label === 'planetColor'
                  )?.value || 100
                }
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
    </group>
  );
}
