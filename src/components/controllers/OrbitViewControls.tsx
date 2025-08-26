import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";

/**
 * X,Z축 이동
 * y축 이동 제한
 * 쿼터뷰 이동방식 구현 
 * @returns 카메라 및 이동 제어 컴포넌트
 */

interface OrbitViewControlsProps {
  targetPosition: THREE.Vector3;
}

export default function OrbitViewControls({ targetPosition }: OrbitViewControlsProps) {

  const controls = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (targetPosition && controls.current) {
      const offset = new THREE.Vector3(5, 5, 3);
      const targetCameraPos = targetPosition.clone().add(offset);
      
      // 부드러운 카메라 이동
      camera.position.lerp(targetCameraPos, 0.02);
      controls.current.target.lerp(targetPosition, 0.02);
    }
  });

  return (
    <OrbitControls 
      ref={controls}
      enableDamping={true}
      dampingFactor={0.05}
      enableRotate={true}
      enableZoom={true}
      enablePan={true}
    />
  );
}