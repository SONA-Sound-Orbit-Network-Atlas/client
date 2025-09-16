import { useRef } from 'react';
import * as THREE from 'three';
import { FakeGlowMaterial } from './materials/FakeGlowMaterial';
import { valueToColor } from '@/utils/valueToColor';

interface SimpleStellarPointProps {
  position: [number, number, number];
  color: number;
  onClick: () => void;
}

export default function SimpleStellarPoint({
  position,
  color,
  onClick,
}: SimpleStellarPointProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowMeshRef = useRef<THREE.Mesh>(null);

  const SIZE = 0.5;
  const GLOW_SIZE = SIZE * 3;
  const colorHex = valueToColor(color, 0, 360);

  return (
    <group position={position}>
      {/* 메인 스텔라 포인트 */}
      <mesh ref={meshRef} onClick={onClick} renderOrder={1}>
        <sphereGeometry args={[SIZE, 16, 16]} />
        <meshStandardMaterial
          color={colorHex}
          emissive={colorHex}
          emissiveIntensity={0.3}
          toneMapped={false}
        />
      </mesh>

      {/* 글로우 효과 */}
      <mesh ref={glowMeshRef} renderOrder={0}>
        <sphereGeometry args={[GLOW_SIZE, 16, 16]} />
        <FakeGlowMaterial
          falloff={0.2}
          glowInternalRadius={3.7}
          glowColor={colorHex}
          glowSharpness={0}
          side={THREE.DoubleSide}
          depthTest={true}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
