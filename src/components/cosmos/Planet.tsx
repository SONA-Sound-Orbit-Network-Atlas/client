// 행성들 ( 악기들)

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import type { TPlanet } from '@/types/cosmos';
import { calculateOrbitPosition } from '@/utils/orbitCalculations';

export default function Planet({
  planetSize,
  planetColor,
  planetBrightness,
  distanceFromStar,
  orbitSpeed,
  rotationSpeed,
  inclination,
  eccentricity,
  tilt,
}: TPlanet) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, deltaTime) => {
    if (meshRef.current) {
      // 1. 공전 각도 계산
      const currentAngle = orbitSpeed * state.clock.elapsedTime;

      // 2. 타원 궤도 계산
      const { x, y, z } = calculateOrbitPosition(
        distanceFromStar,
        inclination,
        eccentricity,
        currentAngle
      );

      // 3. 위치 업데이트
      meshRef.current.position.set(x, y, z);

      // 4. 자전
      meshRef.current.rotation.y += rotationSpeed * deltaTime;
      meshRef.current.rotation.z += tilt * deltaTime;

      // 5. 빛 강도 적용
      if (
        meshRef.current.material &&
        'emissiveIntensity' in meshRef.current.material
      ) {
        (
          meshRef.current.material as THREE.MeshStandardMaterial
        ).emissiveIntensity = planetBrightness;
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[planetSize, 16, 16]} />
      <meshStandardMaterial color={planetColor} />
    </mesh>
  );
}
