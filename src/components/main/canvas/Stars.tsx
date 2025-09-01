import { useMemo, useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import * as random from 'maath/random/dist/maath-random.esm';

function StarsContent() {
  // 별 포인트 생성 (1000개의 별)
  const starsRef = useRef<THREE.Points>(null!);
  const starsRef2 = useRef<THREE.Points>(null!);
  const starsRef3 = useRef<THREE.Points>(null!);

  const positions = useMemo(
    () => random.inSphere(new Float32Array(3 * 1000), { radius: 2.4 }),
    []
  );

  // 별들이 회전하는 애니메이션 + 반짝임 효과
  useFrame((_, dt) => {
    if (!starsRef.current) return;

    // 별들이 회전
    starsRef.current.rotation.x -= dt / 10;
    starsRef.current.rotation.y -= dt / 15;

    // 각 레이어별로 다른 속도로 회전하여 반짝임 효과
    if (starsRef2.current) {
      starsRef2.current.rotation.x -= dt / 8;
      starsRef2.current.rotation.y -= dt / 12;
    }

    if (starsRef3.current) {
      starsRef3.current.rotation.x -= dt / 6;
      starsRef3.current.rotation.y -= dt / 18;
    }
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
          color="#ffffff" // 순백색으로 최대 밝기
          size={0.04} // 살짝만 크기 증가 (0.03 → 0.04)
          sizeAttenuation
          depthWrite={false}
          opacity={1.0} // 완전 불투명으로 밝기 증가
          blending={THREE.AdditiveBlending} // 가산 블렌딩으로 네온 효과
        />
      </Points>

      {/* 두 번째 별 레이어 - 중간 크기 별들 */}
      <Points
        ref={starsRef2}
        positions={positions}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#87ceeb" // 밝은 하늘색으로 네온 효과
          size={0.06} // 살짝만 크기 증가 (0.05 → 0.06)
          sizeAttenuation
          depthWrite={false}
          opacity={0.9} // 밝기 증가
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* 세 번째 별 레이어 - 작은 별들로 깊이감 추가 */}
      <Points
        ref={starsRef3}
        positions={positions}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#dda0dd" // 밝은 연보라색으로 네온 효과
          size={0.11} // 살짝만 크기 증가 (0.1 → 0.11)
          sizeAttenuation
          depthWrite={false}
          opacity={0.8} // 밝기 증가
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

export default function Stars() {
  return (
    <Suspense fallback={null}>
      <StarsContent />
    </Suspense>
  );
}
