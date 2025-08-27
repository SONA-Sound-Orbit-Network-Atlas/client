import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import * as random from 'maath/random/dist/maath-random.esm';

export default function Stars() {
  // 별 포인트 생성 (1000개의 별)
  const starsRef = useRef<THREE.Points>(null!);
  const positions = useMemo(
    () => random.inSphere(new Float32Array(3 * 1000), { radius: 2.4 }),
    []
  );

  // 별들이 회전하는 애니메이션
  useFrame((_, dt) => {
    if (!starsRef.current) return;

    // 별들이 회전
    starsRef.current.rotation.x -= dt / 10;
    starsRef.current.rotation.y -= dt / 15;
  });

  return (
    <group position={[0, 0, -5]}>
      {/* 첫 번째 별 레이어 - 가장 큰 별들 */}
      <Points
        ref={starsRef}
        positions={positions}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#ffffff" // 밝은 흰색
          size={0.03} // 살짝 큰 별들
          sizeAttenuation
          depthWrite={false}
          opacity={0.9}
          blending={THREE.AdditiveBlending} // 가산 블렌딩으로 빛나는 효과
        />
      </Points>

      {/* 두 번째 별 레이어 - 중간 크기 별들 */}
      <Points positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#87ceeb" // 하늘색 별들
          size={0.05} // 중간 크기 별들
          sizeAttenuation
          depthWrite={false}
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* 세 번째 별 레이어 - 작은 별들로 깊이감 추가 */}
      <Points positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#dda0dd" // 연보라색 별들
          size={0.1} // 작은 별들
          sizeAttenuation
          depthWrite={false}
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}
