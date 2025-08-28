import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useSceneStore } from "@/stores/useSceneStore";
import { useSmoothCameraMove } from "@/hooks/camera/useSmoothCameraMove";

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

  //test code
  const { setViewMode,setCameraTarget } = useSceneStore();

  const isMovingRef = useRef<boolean>(false);
  const controls = useRef<OrbitControlsImpl>(null);
  const duration = 2; // 카메라 이동 시간간

  useEffect(()=>{
    // 테스트용
    setCameraTarget(targetPosition);
  },[targetPosition]);

  // 카메라 이동 로직
  useSmoothCameraMove({
    targetPosition,
    controlsRef: controls.current,
    duration,
    onMoveStart:()=>{isMovingRef.current = true;},
    onMoveEnd:()=>{isMovingRef.current = false;}
  });

  useFrame(() => {
    // 줌 거리 체크 (항상 실행)
    if (controls.current && !isMovingRef.current) {
      const distance = controls.current.getDistance();
      if (distance > 20) {
        setCameraTarget(targetPosition);
        setViewMode('Galaxy');
      }
    }
  });

  return (
    <OrbitControls 
      ref={controls}
      enableDamping={true}
      dampingFactor={0.05}
      enableRotate={!isMovingRef.current}
      enableZoom={!isMovingRef.current}
      enablePan={false}
    />
  );
}

// 부드러운 이동을 위한 함수
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}