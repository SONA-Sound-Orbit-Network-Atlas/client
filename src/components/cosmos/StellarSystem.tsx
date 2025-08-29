import { useRef } from 'react';
import Star from './Star';
import Planet from './Planet';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore } from '@/stores/useSceneStore';

//항성계 컴포넌트

export default function StellarSystem({
  stellarSystemPos,
  id,
}: {
  stellarSystemPos: [number, number, number];
  id: number;
}) {
  const {
    setFocusedPosition,
    selectedStellarSystemId,
    viewMode,
    setSelectedStellarSystemId,
  } = useSceneStore();

  const ref = useRef<THREE.Group>(null);
  const detailGroupRef = useRef<THREE.Group>(null);
  const lowDetailMesh = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const systemPos = new THREE.Vector3(...stellarSystemPos);

  useFrame(() => {
    // 항성계 LOD 처리
    if (!ref.current || !detailGroupRef.current || !lowDetailMesh.current)
      return;

    const distance = camera.position.distanceTo(systemPos);

    //factor 값을 계산
    const minDistance = 20; // 거리가 20 이하면 완전히 보임
    const fadeRange = 10; // 20~30 거리에서 페이드 아웃
    const maxOpacity = 1; // 최대 투명도
    const minOpacity = 0; // 최소 투명도

    const factor =
      maxOpacity -
      Math.min(
        Math.max((distance - minDistance) / fadeRange, minOpacity),
        maxOpacity
      );

    //메시 스케일 조정정
    detailGroupRef.current.scale.set(factor, factor, factor);
    lowDetailMesh.current.scale.set(1 - factor, 1 - factor, 1 - factor);

    // 선택된 항성계가 화면과 flat하게 보여주기
    // if (viewMode === 'StellarSystem' && selectedStellarSystemId === id) {
    //   detailGroupRef.current.quaternion.copy(camera.quaternion);
    // } else {
    //   detailGroupRef.current.quaternion.identity();
    // }
  });

  return (
    <group
      ref={ref}
      position={stellarSystemPos}
      onClick={() => setSelectedStellarSystemId(id)}
    >
      <group ref={detailGroupRef}>
        <Star position={[0, 0, 0]} color="#ff6b6b" size={1.5} />
        <Planet position={[3, 2, 0]} color="#4ecdc4" size={1} />
        <Planet position={[-3, -1, 2]} color="#45b7d1" size={0.8} />
        <Planet position={[0, 3, -2]} color="#96ceb4" size={1.2} />
        <Planet position={[4, -2, 1]} color="#feca57" size={0.6} />
        <Planet position={[-4, 1, -1]} color="#ff9ff3" size={0.9} />
      </group>
      <mesh
        ref={lowDetailMesh}
        onClick={() =>
          setFocusedPosition(new THREE.Vector3(...stellarSystemPos))
        }
      >
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial
          color="#ff6b6b"
          emissive="#ffffff"
          emissiveIntensity={0.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
