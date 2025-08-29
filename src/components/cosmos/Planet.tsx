// 행성들 ( 악기들)

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

type PlanetProps = {
  key: number;
  orbitRadius: number;
  orbitSpeed: number;
  planetSize: number;
  planetColor: string;
  rotationSpeed: number;
};

export default function Planet({
  key,
  orbitRadius,
  orbitSpeed,
  planetSize,
  planetColor,
  rotationSpeed,
}: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const position = calculateOrbitPosition(orbitRadius, orbitSpeed, 0);

  useFrame((state, deltaTime) => {
    if (meshRef.current) {
      // 1. 공전 위치 계산
      const currentAngle = orbitSpeed * state.clock.elapsedTime;
      const x = orbitRadius * Math.cos(currentAngle);
      const z = orbitRadius * Math.sin(currentAngle);

      // 2. mesh 위치 업데이트
      meshRef.current.position.set(x, 0, z);

      // 3. 자전 (선택사항)
      meshRef.current.rotation.y += rotationSpeed * deltaTime;
    }
  });

  return (
    <mesh ref={meshRef} position={[position.x, position.y, position.z]}>
      <sphereGeometry args={[planetSize, 32, 32]} />
      <meshStandardMaterial color={planetColor} />
    </mesh>
  );
}

const calculateOrbitPosition = (
  orbitRadius: number,
  orbitSpeed: number,
  elapsedTime: number
) => {
  // 현재 공전 각도 = 속도 × 시간
  const currentAngle = orbitSpeed * elapsedTime;

  // 원형 궤도 좌표
  const x = orbitRadius * Math.cos(currentAngle);
  const z = orbitRadius * Math.sin(currentAngle);
  const y = 0; // 평면 궤도

  return { x, y, z };
};
