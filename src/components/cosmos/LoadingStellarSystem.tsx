import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import Star from './Star';
import Planet from './Planet';
import type { Star as StarType, Planet as PlanetType } from '@/types/stellar';

interface LoadingStellarSystemProps {
  text?: string;
}

/**
 * 로딩용 스텔라 시스템 컴포넌트
 * 실제 StellarSystem과 동일한 구조로 작동하지만 로딩용 데이터 사용
 */
export default function LoadingStellarSystem({
  text = '로딩 중...',
}: LoadingStellarSystemProps) {
  const stellarSystemRef = useRef<THREE.Group>(null);

  // 로딩용 Star 데이터 생성
  const loadingStar: StarType = {
    id: 'loading-star',
    object_type: 'STAR',
    system_id: 'loading-system',
    name: 'Loading Star',
    properties: {
      spin: 100,
      brightness: 3,
      color: 60, // 노란색
      size: 15,
    },
    created_at: '2021-01-01T00:00:00Z',
    updated_at: '2021-01-01T00:00:00Z',
  };

  // 로딩용 Planet 데이터 생성
  const loadingPlanets: PlanetType[] = [
    {
      id: 'loading-planet-1',
      object_type: 'PLANET',
      system_id: 'loading-system',
      name: 'Loading Planet 1',
      role: 'BASS',
      properties: {
        planetSize: 0.3,
        planetColor: 120, // 초록색
        planetBrightness: 2.0,
        distanceFromStar: 3,
        orbitSpeed: 2.0,
        rotationSpeed: 1.5,
        inclination: 0,
        eccentricity: 0.1,
        tilt: 15,
      },
      created_at: '2021-01-01T00:00:00Z',
      updated_at: '2021-01-01T00:00:00Z',
    },
    {
      id: 'loading-planet-2',
      object_type: 'PLANET',
      system_id: 'loading-system',
      name: 'Loading Planet 2',
      role: 'ARPEGGIO',
      properties: {
        planetSize: 0.4,
        planetColor: 240, // 파란색
        planetBrightness: 1.8,
        distanceFromStar: 5,
        orbitSpeed: 1.2,
        rotationSpeed: 2.0,
        inclination: 10,
        eccentricity: 0.2,
        tilt: 30,
      },
      created_at: '2021-01-01T00:00:00Z',
      updated_at: '2021-01-01T00:00:00Z',
    },
    {
      id: 'loading-planet-3',
      object_type: 'PLANET',
      system_id: 'loading-system',
      name: 'Loading Planet 3',
      role: 'PAD',
      properties: {
        planetSize: 0.35,
        planetColor: 300, // 보라색
        planetBrightness: 2.2,
        distanceFromStar: 7,
        orbitSpeed: 0.8,
        rotationSpeed: 1.0,
        inclination: -15,
        eccentricity: 0.15,
        tilt: 45,
      },
      created_at: '2021-01-01T00:00:00Z',
      updated_at: '2021-01-01T00:00:00Z',
    },
  ];

  // 스텔라 시스템만 회전 애니메이션
  useFrame((_, delta) => {
    if (stellarSystemRef.current) {
      stellarSystemRef.current.rotation.y += delta * 0.5; // 천천히 회전
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 회전하는 스텔라 시스템 */}
      <group ref={stellarSystemRef}>
        {/* 실제 Star 컴포넌트 사용 */}
        <Star star={loadingStar} position={[0, 0, 0]} />

        {/* 실제 Planet 컴포넌트들 사용 */}
        {loadingPlanets.map((planet) => (
          <Planet key={planet.id} planet={planet} isSelectable={false} />
        ))}
      </group>

      {/* 고정된 로딩 텍스트 (항상 카메라를 향함) */}
      <Html
        position={[0, 6, 0]}
        center
        style={{
          color: '#ffffff',
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {text}
      </Html>
    </group>
  );
}
