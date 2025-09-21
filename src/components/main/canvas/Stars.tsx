import { useMemo, useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import * as random from 'maath/random';

function StarsContent() {
  const starsRef = useRef<THREE.Points>(null!);
  const starsRef2 = useRef<THREE.Points>(null!);
  const starsRef3 = useRef<THREE.Points>(null!);

  const positions = useMemo(
    // 별 포인트 개수 (3(x,y,z좌표값) * n 개의 별)
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
        positions={positions as Float32Array}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#ffffff" // 순백색으로 최대 밝기
          size={2} // 별 크기
          sizeAttenuation
          depthWrite={false}
          opacity={0.3} // 별 밝기
          blending={THREE.AdditiveBlending} // 가산 블렌딩으로 네온 효과
        />
      </Points>

      {/* 두 번째 별 레이어 - 중간 크기 별들 */}
      <Points
        ref={starsRef2}
        positions={positions as Float32Array}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#87ceeb"
          size={2}
          sizeAttenuation
          depthWrite={false}
          opacity={0.9} // 밝기 증가
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* 세 번째 별 레이어 - 작은 별들로 깊이감 추가 */}
      <Points
        ref={starsRef3}
        positions={positions as Float32Array}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#dda0dd"
          size={1}
          sizeAttenuation
          depthWrite={false}
          opacity={0.9}
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
