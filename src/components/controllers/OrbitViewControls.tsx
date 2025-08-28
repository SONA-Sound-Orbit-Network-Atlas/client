import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { useRef, useCallback } from "react";
import { useSceneStore } from "@/stores/useSceneStore";
import { useSmoothCameraMove } from "@/hooks/camera/useSmoothCameraMove";
import { UseChangeViewModeOnOutOfDistance } from "@/hooks/camera/UseChangeViewModeOnOutOfDistance";

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
  const { setCameraTarget } = useSceneStore();

  const isMovingRef = useRef<boolean>(false);
  const controls = useRef<OrbitControlsImpl>(null);
  const distanceRef = useRef<number>(0);
  const duration = 2; // 카메라 이동 시간

  const handleMoveStart = useCallback(() => {
    isMovingRef.current = true;
  }, []);
  const handleMoveEnd = useCallback(() => {
    isMovingRef.current = false;
  }, []);
  // 카메라 이동 로직
  useSmoothCameraMove({
    targetPosition,
    controlsRef: controls.current,
    duration,
    onMoveStart:handleMoveStart,
    onMoveEnd:handleMoveEnd
  });

  // 거리 계산 로직 
  useFrame(()=>{
    distanceRef.current = controls.current?.getDistance() || 0;
  });
  UseChangeViewModeOnOutOfDistance({
    distanceRef: distanceRef,
    targetDistance: 20,
    movementLockRef: isMovingRef,
    onOutOfDistance:()=>{
      //TODO : zomeout 되면서 카메라 변경시 화면을 그대로 이어가기위해 카메라 타겟 설정중입니다. 추후 리팩토링 필요
      setCameraTarget(targetPosition);
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
