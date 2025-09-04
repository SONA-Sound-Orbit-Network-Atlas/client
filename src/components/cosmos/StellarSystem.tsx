import { useMemo, useRef, useState } from 'react';
import Star from './Star';
import Planet from './Planet';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore } from '@/stores/useSceneStore';
import OrbitLine from './OrbitLine';
import type { TPlanet, TStellarSystem } from '@/types/cosmos';
//항성계 컴포넌트

//mock data
const mockPlanets: TPlanet[] = [
  {
    distanceFromStar: 3,
    orbitSpeed: 0.3,
    planetSize: 0.4,
    planetColor: '#FFFFFF',
    rotationSpeed: 0.3,
    inclination: -180,
    planetBrightness: 1,
    eccentricity: 0.5,
    tilt: 0,
  },
  {
    distanceFromStar: 8.5,
    orbitSpeed: 0.4,
    planetSize: 0.6,
    planetColor: '#96ceb4',
    rotationSpeed: 0.4,
    inclination: 120,
    planetBrightness: 1,
    eccentricity: 0.1,
    tilt: 0,
  },
  {
    distanceFromStar: 8,
    orbitSpeed: 0.2,
    planetSize: 0.6,
    planetColor: '#feca57',
    rotationSpeed: 0.2,
    inclination: -35,
    planetBrightness: 1,
    eccentricity: 0.5,
    tilt: 0,
  },
  {
    distanceFromStar: 10,
    orbitSpeed: 0.1,
    planetSize: 0.8,
    planetColor: '#ff9ff3',
    rotationSpeed: 0.1,
    inclination: 15,
    planetBrightness: 0.1,
    eccentricity: 0.1,
    tilt: 0,
  },
];

const mockStellarSystem: TStellarSystem = {
  id: 1,
  name: 'Stellar System 1',
  planets: mockPlanets,
};

export default function StellarSystem({
  stellarSystemPos,
  id,
}: {
  stellarSystemPos: [number, number, number];
  id: number;
}) {
  const {
    setFocusedPosition,
    selectedStellarSystemId,
    viewMode,
    setSelectedStellarSystemId,
    setSelectedStellarSystem,
    selectedStellarSystem,
  } = useSceneStore();

  const ref = useRef<THREE.Group>(null);
  const detailGroupRef = useRef<THREE.Group>(null);
  const lowDetailMesh = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const systemPos = new THREE.Vector3(...stellarSystemPos);
  const LOW_DETAIL_SIZE = 0.5;
  const [planets] = useState<TPlanet[]>(mockPlanets);

  const onStellarSystemClicked = () => {
    // 초점 위치 업데이트
    setFocusedPosition(new THREE.Vector3(...stellarSystemPos));
    // 선택된 항성계 업데이트
    setSelectedStellarSystemId(id);
    setSelectedStellarSystem(mockStellarSystem);
  };

  const isSelectedSystem = useMemo(() => {
    return viewMode === 'StellarSystem' && selectedStellarSystemId === id;
  }, [viewMode, selectedStellarSystemId, id]);

  useFrame(() => {
    // 항성계 LOD 처리
    if (!ref.current || !detailGroupRef.current || !lowDetailMesh.current)
      return;

    const distance = camera.position.distanceTo(systemPos);

    //factor 값을 계산
    const minDistance = 100; // 거리가 20 이하면 완전히 보임
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
    lowDetailMesh.current.scale.set(1 - factor, 1 - factor, 1 - factor);
  });

  return (
    <group
      ref={ref}
      position={stellarSystemPos}
      onClick={onStellarSystemClicked}
    >
      <group ref={detailGroupRef}>
        <Star
          position={[0, 0, 0]}
          color="#ff6b6b"
          size={1}
          onClick={() => onStellarSystemClicked()}
        />
        {planets.map((planet, index) => {
          return (
            <>
              {isSelectedSystem && (
                <>
                  <OrbitLine
                    orbitRadius={
                      selectedStellarSystem?.planets[index].distanceFromStar ||
                      planet.distanceFromStar
                    }
                    inclination={
                      selectedStellarSystem?.planets[index].inclination ||
                      planet.inclination
                    }
                    eccentricity={
                      selectedStellarSystem?.planets[index].eccentricity ||
                      planet.eccentricity
                    }
                  />
                </>
              )}
              <Planet
                key={index}
                index={index}
                distanceFromStar={
                  isSelectedSystem
                    ? selectedStellarSystem?.planets[index].distanceFromStar ||
                      planet.distanceFromStar
                    : planet.distanceFromStar
                }
                orbitSpeed={
                  isSelectedSystem
                    ? selectedStellarSystem?.planets[index].orbitSpeed ||
                      planet.orbitSpeed
                    : planet.orbitSpeed
                }
                planetSize={
                  isSelectedSystem
                    ? selectedStellarSystem?.planets[index].planetSize ||
                      planet.planetSize
                    : planet.planetSize
                }
                planetColor={
                  isSelectedSystem
                    ? selectedStellarSystem?.planets[index].planetColor ||
                      planet.planetColor
                    : planet.planetColor
                }
                planetBrightness={
                  isSelectedSystem
                    ? selectedStellarSystem?.planets[index].planetBrightness ||
                      planet.planetBrightness
                    : planet.planetBrightness
                }
                eccentricity={
                  isSelectedSystem
                    ? selectedStellarSystem?.planets[index].eccentricity ||
                      planet.eccentricity
                    : planet.eccentricity
                }
                tilt={
                  isSelectedSystem
                    ? selectedStellarSystem?.planets[index].tilt || planet.tilt
                    : planet.tilt
                }
                rotationSpeed={
                  isSelectedSystem
                    ? selectedStellarSystem?.planets[index].rotationSpeed ||
                      planet.rotationSpeed
                    : planet.rotationSpeed
                }
                inclination={
                  isSelectedSystem
                    ? selectedStellarSystem?.planets[index].inclination ||
                      planet.inclination
                    : planet.inclination
                }
                isSelectable={isSelectedSystem}
              />
            </>
          );
        })}
      </group>
      <mesh
        ref={lowDetailMesh}
        onClick={() =>
          setFocusedPosition(new THREE.Vector3(...stellarSystemPos))
        }
      >
        <sphereGeometry args={[LOW_DETAIL_SIZE, 4, 4]} />
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
