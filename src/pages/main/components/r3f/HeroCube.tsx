import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';

type Props = {
  totalPages?: number;
};

export default function HeroCube({ totalPages = 5 }: Props) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);
  const { pointer } = useThree();
  const scroll = useScroll();

  useFrame((_, dt) => {
    // 동적으로 범위 계산
    const pageSize = 1 / totalPages;
    const r1 = scroll.range(0 * pageSize, pageSize);
    const r2 = scroll.range(1 * pageSize, pageSize);
    const r3 = scroll.range(2 * pageSize, pageSize);
    const r4 = scroll.range(3 * pageSize, pageSize);
    const r5 = totalPages > 4 ? scroll.range(4 * pageSize, pageSize) : 0;

    const targetPos = new THREE.Vector3(
      THREE.MathUtils.lerp(0, -1.5, r2) + THREE.MathUtils.lerp(0, 1.5, r3),
      THREE.MathUtils.lerp(0, 1.2, r1) - THREE.MathUtils.lerp(0, 0.8, r4),
      0
    );

    const targetRot = new THREE.Euler(
      -pointer.y * 0.3 + THREE.MathUtils.lerp(0, Math.PI * 0.25, r3),
      pointer.x * 0.4 + (r2 + r4) * 0.5,
      0
    );

    const targetScale = THREE.MathUtils.lerp(1, 1.4, r5);

    meshRef.current.position.lerp(targetPos, 1 - Math.exp(-dt * 4));
    meshRef.current.rotation.x = THREE.MathUtils.damp(
      meshRef.current.rotation.x,
      targetRot.x,
      4,
      dt
    );
    meshRef.current.rotation.y = THREE.MathUtils.damp(
      meshRef.current.rotation.y,
      targetRot.y,
      4,
      dt
    );
    meshRef.current.rotation.z = THREE.MathUtils.damp(
      meshRef.current.rotation.z,
      targetRot.z,
      4,
      dt
    );
    meshRef.current.scale.x =
      meshRef.current.scale.y =
      meshRef.current.scale.z =
        THREE.MathUtils.damp(meshRef.current.scale.x, targetScale, 4, dt);

    const c2 = new THREE.Color('#2fb2ff');
    const c3 = new THREE.Color('#39e6c9');
    const c4 = new THREE.Color('#dff2ff');
    const mix23 = c2.clone().lerp(c3, r3);
    const mix34 = c3.clone().lerp(c4, r4);
    const targetColor = r4 > 0 ? mix34 : mix23;

    materialRef.current.color.lerp(targetColor, dt * 2);

    // StarsField와 동일한 회전 속도로 회전 (시계방향)
    meshRef.current.rotation.y += dt * -0.1;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 4]} />
      <meshBasicMaterial
        ref={materialRef}
        color="#00bfff"
        transparent
        opacity={0.8}
      />

      {/* 네온 글로우 효과를 위한 외부 레이어 */}
      <mesh scale={1.2}>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshBasicMaterial
          color="#00bfff"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </mesh>
  );
}
