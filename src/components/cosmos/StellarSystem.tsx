import { useRef, useState } from 'react';
import Star from './Star';
import Planet from './Planet';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore } from '@/stores/useSceneStore';

//항성계 컴포넌트

type Planet = {
  orbitRadius: number; // 최소: 0.1, 최대: 20 (궤도 반지름)
  orbitSpeed: number; // 최소: 0.01, 최대: 5.0 (공전 속도)
  planetSize: number; // 최소: 0.1, 최대: 3.0 (행성 크기)
  planetColor: string; // 최소: 1자, 최대: 7자 (색상 코드)
  rotationSpeed: number; // 최소: 0.01, 최대: 10.0 (자전 속도)
  inclination: number; // 최소: -180, 최대: 180 (궤도 기울기, 도 단위)
};

//mock data
const mockPlanets: Planet[] = [
  {
    orbitRadius: 3,
    orbitSpeed: 0.3,
    planetSize: 0.8,
    planetColor: '#FFFFFF',
    rotationSpeed: 0.3,
    inclination: -180,
  },
  {
    orbitRadius: 4,
    orbitSpeed: 0.4,
    planetSize: 1.2,
    planetColor: '#96ceb4',
    rotationSpeed: 0.4,
    inclination: 120,
  },
  {
    orbitRadius: 2,
    orbitSpeed: 0.2,
    planetSize: 0.6,
    planetColor: '#feca57',
    rotationSpeed: 0.2,
    inclination: -35,
  },
  {
    orbitRadius: 5,
    orbitSpeed: 0.1,
    planetSize: 0.9,
    planetColor: '#ff9ff3',
    rotationSpeed: 0.1,
    inclination: 15,
  },
];

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
  } = useSceneStore();

  const ref = useRef<THREE.Group>(null);
  const detailGroupRef = useRef<THREE.Group>(null);
  const lowDetailMesh = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const systemPos = new THREE.Vector3(...stellarSystemPos);

  const [planets] = useState<Planet[]>(mockPlanets);

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

    // 뷰 모드에 따른 회전 처리
    if (viewMode === 'StellarSystem') {
      if (selectedStellarSystemId === id) {
        // 선택된 항성계만 카메라 방향을 따라감
        detailGroupRef.current.quaternion.copy(camera.quaternion);
        //detailGroupRef.current.rotation.set(-Math.PI / 2, 0, 0);
      }
      // 선택되지 않은 항성계는 기존 방향 유지 (아무것도 하지 않음)
    } else {
      // Galaxy 뷰에서는 모든 항성계가 기본 방향
      detailGroupRef.current.quaternion.identity();
    }
  });

  return (
    <group
      ref={ref}
      position={stellarSystemPos}
      onClick={() => setSelectedStellarSystemId(id)}
    >
      <group ref={detailGroupRef}>
        <Star
          position={[0, 0, 0]}
          color="#ff6b6b"
          size={1.5}
          onClick={() =>
            setFocusedPosition(new THREE.Vector3(...stellarSystemPos))
          }
        />
        {planets.map((planet, index) => (
          <Planet
            key={index}
            orbitRadius={planet.orbitRadius}
            orbitSpeed={planet.orbitSpeed}
            planetSize={planet.planetSize}
            planetColor={planet.planetColor}
            rotationSpeed={planet.rotationSpeed}
            inclination={planet.inclination}
          />
        ))}
      </group>
      <mesh
        ref={lowDetailMesh}
        onClick={() =>
          setFocusedPosition(new THREE.Vector3(...stellarSystemPos))
        }
      >
        <sphereGeometry args={[1.5, 16, 16]} />
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
