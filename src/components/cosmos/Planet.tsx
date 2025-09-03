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

      // 2. 타원 궤도 계산 (이심률 적용)
      const semiMajorAxis = distanceFromStar;
      const semiMinorAxis =
        distanceFromStar * Math.sqrt(1 - eccentricity * eccentricity);

      // 타원 궤도 좌표 (semiMinorAxis 사용)
      const baseX = semiMajorAxis * Math.cos(currentAngle);
      const baseZ = semiMinorAxis * Math.sin(currentAngle);

      // 이심률에 따른 Y축 높이 조정 (타원 궤도면의 기울기)
      const yOffset = eccentricity * semiMajorAxis * Math.sin(currentAngle);

      // 3. 기울기 적용 (Y축 회전)
      const inclinationRad = (inclination * Math.PI) / 180;
      const x =
        baseX * Math.cos(inclinationRad) - baseZ * Math.sin(inclinationRad);
      const z =
        baseX * Math.sin(inclinationRad) + baseZ * Math.cos(inclinationRad);
      const y =
        distanceFromStar * Math.sin(inclinationRad) * Math.sin(currentAngle) +
        yOffset;

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
