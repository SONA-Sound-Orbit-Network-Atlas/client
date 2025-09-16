import { useRef } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { FakeGlowMaterial } from './materials/FakeGlowMaterial';
import { valueToColor } from '@/utils/valueToColor';

interface SimpleStellarPointProps {
  position: [number, number, number];
  color: number;
  onClick: () => void;
  isSelected?: boolean;
  stellarId?: string;
  showInfo?: boolean;
}

export default function SimpleStellarPoint({
  position,
  color,
  onClick,
  isSelected = false,
  stellarId = 'unknown',
  showInfo = true,
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

      {/* 스텔라 정보 UI - 우상단에 표시 (조건부 렌더링) */}
      {showInfo && (
        <Html
          position={[3, 3, 0]}
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '12px 16px',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            fontFamily: 'monospace',
            border: isSelected
              ? '2px solid #4CAF50'
              : '2px solid rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(8px)',
            pointerEvents: 'none', // 클릭 이벤트가 스텔라로 전달되도록
            minWidth: '180px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div
            style={{
              fontWeight: 'bold',
              color: isSelected ? '#4CAF50' : '#FFD700',
              fontSize: '22px',
              marginBottom: '6px',
            }}
          >
            ⭐ {stellarId}
          </div>
          <div
            style={{ fontSize: '19px', color: '#B0B0B0', marginBottom: '4px' }}
          >
            Color: {color}°
          </div>
          <div
            style={{ fontSize: '19px', color: '#B0B0B0', marginBottom: '4px' }}
          >
            Pos: [{position.join(', ')}]
          </div>
          {isSelected && (
            <div
              style={{
                fontSize: '18px',
                color: '#4CAF50',
                fontStyle: 'italic',
                fontWeight: 'bold',
                marginTop: '4px',
              }}
            >
              ✓ Selected
            </div>
          )}
        </Html>
      )}
    </group>
  );
}
