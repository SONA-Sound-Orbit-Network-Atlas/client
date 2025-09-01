// 행성들 ( 악기들)

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import type { TPlanet } from '@/types/cosmos';

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

      // 2. 기본 원형 궤도 좌표
      const baseX = distanceFromStar * Math.cos(currentAngle);
      const baseZ = distanceFromStar * Math.sin(currentAngle);

      // 3. 기울기 적용 (Y축 회전)
      const inclinationRad = (inclination * Math.PI) / 180;
      const x =
        baseX * Math.cos(inclinationRad) - baseZ * Math.sin(inclinationRad);
      const z =
        baseX * Math.sin(inclinationRad) + baseZ * Math.cos(inclinationRad);
      const y =
        distanceFromStar * Math.sin(inclinationRad) * Math.sin(currentAngle);

      // 4. 위치 업데이트
      meshRef.current.position.set(x, y, z);

      // 5. 자전
      meshRef.current.rotation.y += rotationSpeed * deltaTime;
      meshRef.current.rotation.z += tilt * deltaTime;

      // 6. 빛 강도 적용
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
