import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useSceneStore } from "@/stores/useSceneStore";

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
  const { setCameraIsMoving,setViewMode } = useSceneStore();

  const isMovingRef = useRef<boolean>(false);
  const controls = useRef<OrbitControlsImpl>(null);
  const startTimeRef = useRef<number>(0);
  const { camera } = useThree();
  const duration = 2;

  useEffect(()=>{
    isMovingRef.current = true;
    setCameraIsMoving(true);
  },[targetPosition]);

  useFrame((state, deltaTime) => {
    // 줌 거리 체크 (항상 실행)
    if (controls.current && !isMovingRef.current) {
      const distance = controls.current.getDistance();
      if (distance > 20) {
        setViewMode('Galaxy');
      }
    }

    // 카메라 이동 로직
    if (targetPosition && controls.current && isMovingRef.current) {
      const offset = new THREE.Vector3(5, 5, 3);
      const targetCameraPos = targetPosition.clone().add(offset);

      //경과 시간 계산
      startTimeRef.current += deltaTime;
      const progress = Math.min(startTimeRef.current / duration, 1.0);
      const easedProgress = easeInOutCubic(progress);

      // 부드러운 카메라 이동
      camera.position.lerp(targetCameraPos, easedProgress);
      controls.current.target.lerp(targetPosition, easedProgress);
      
      const distance = camera.position.distanceTo(targetCameraPos);
      if(distance < 0.1){
        isMovingRef.current = false;
        setCameraIsMoving(false);
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
      enablePan={!isMovingRef.current}
    />
  );
}

// 부드러운 이동을 위한 함수
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}