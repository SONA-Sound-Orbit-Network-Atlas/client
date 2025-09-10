import { useMemo, useRef } from 'react';
import Star from './Star';
import Planet from './Planet';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore } from '@/stores/useSceneStore';
import OrbitLine from './OrbitLine';
import { useStellarSystem } from '@/hooks/useStellarSystem';
//항성계 컴포넌트

export default function StellarSystem({
  stellarSystemPos,
  id,
}: {
  stellarSystemPos: [number, number, number];
  id: number;
}) {
  const { selectedStellarSystemId, viewMode, selectedStellarSystem } =
    useSceneStore();
  const { enterStellarSystemView } = useStellarSystem();

  const ref = useRef<THREE.Group>(null);
  const detailGroupRef = useRef<THREE.Group>(null);
  const lowDetailMesh = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const systemPos = new THREE.Vector3(...stellarSystemPos);
  const LOW_DETAIL_SIZE = 0.5;

  const isSelectedSystem = useMemo(() => {
    return viewMode === 'StellarSystem' && selectedStellarSystemId === id;
  }, [viewMode, selectedStellarSystemId, id]);

  const onStellarSystemClicked = () => {
    enterStellarSystemView(id);
  };
  useFrame(() => {
    // 항성계 LOD 처리
    if (!ref.current || !detailGroupRef.current || !lowDetailMesh.current)
      return;

    const distance = camera.position.distanceTo(systemPos);

    //factor 값을 계산
    const minDistance = 10; // 거리가 minDistance 이하면 완전히 보임
    const fadeRange = 10; // 20~30 거리에서 페이드 아웃
    const maxOpacity = 1; // 최대 투명도
    const minOpacity = 0; // 최소 투명도

    const factor =
      maxOpacity -
      Math.min(
        Math.max((distance - minDistance) / fadeRange, minOpacity),
        maxOpacity
      );

    //메시 스케일 조정정
    detailGroupRef.current.scale.set(factor, factor, factor);
    if (isSelectedSystem) {
      lowDetailMesh.current.scale.set(1 - factor, 1 - factor, 1 - factor);
    }
  });

  return (
    <group
      ref={ref}
      position={stellarSystemPos}
      onClick={onStellarSystemClicked}
    >
      <group ref={detailGroupRef} visible={isSelectedSystem}>
        <Star
          position={[0, 0, 0]}
          color="#ff6b6b"
          size={1}
          onClick={() => onStellarSystemClicked()}
        />
        {selectedStellarSystem?.planets.map((planet, index) => {
          return (
            <>
              <OrbitLine
                orbitRadius={
                  selectedStellarSystem.planets[index].distanceFromStar ||
                  planet.distanceFromStar
                }
                inclination={
                  selectedStellarSystem.planets[index].inclination ||
                  planet.inclination
                }
                eccentricity={
                  selectedStellarSystem.planets[index].eccentricity ||
                  planet.eccentricity
                }
              />
              <Planet
                key={index}
                index={index}
                distanceFromStar={
                  isSelectedSystem
                    ? selectedStellarSystem.planets[index].distanceFromStar ||
                      planet.distanceFromStar
                    : planet.distanceFromStar
                }
                orbitSpeed={
                  isSelectedSystem
                    ? selectedStellarSystem.planets[index].orbitSpeed ||
                      planet.orbitSpeed
                    : planet.orbitSpeed
                }
                planetSize={
                  isSelectedSystem
                    ? selectedStellarSystem.planets[index].planetSize ||
                      planet.planetSize
                    : planet.planetSize
                }
                planetColor={
                  isSelectedSystem
                    ? selectedStellarSystem.planets[index].planetColor ||
                      planet.planetColor
                    : planet.planetColor
                }
                planetBrightness={
                  isSelectedSystem
                    ? selectedStellarSystem.planets[index].planetBrightness ||
                      planet.planetBrightness
                    : planet.planetBrightness
                }
                eccentricity={
                  isSelectedSystem
                    ? selectedStellarSystem.planets[index].eccentricity ||
                      planet.eccentricity
                    : planet.eccentricity
                }
                tilt={
                  isSelectedSystem
                    ? selectedStellarSystem.planets[index].tilt || planet.tilt
                    : planet.tilt
                }
                rotationSpeed={
                  isSelectedSystem
                    ? selectedStellarSystem.planets[index].rotationSpeed ||
                      planet.rotationSpeed
                    : planet.rotationSpeed
                }
                inclination={
                  isSelectedSystem
                    ? selectedStellarSystem.planets[index].inclination ||
                      planet.inclination
                    : planet.inclination
                }
                isSelectable={isSelectedSystem}
              />
            </>
          );
        })}
      </group>
      <mesh ref={lowDetailMesh} onClick={() => enterStellarSystemView(id)}>
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
