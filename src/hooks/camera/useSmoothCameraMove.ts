// hooks/useSmoothCameraMove.ts
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useEffect } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {useSceneStore} from "@/stores/useSceneStore";

interface UseSmoothCameraMoveProps {
  targetPosition: THREE.Vector3; // 이동 목표 포지션션
  controlsRef: OrbitControlsImpl | null;
  duration?: number; // 카메라 이동 시간
  onMoveEnd?: () => void;
  onMoveStart?: () => void;
}

export function useSmoothCameraMove({
  targetPosition,
  controlsRef,
  duration = 2,
  onMoveEnd,
  onMoveStart,
}: UseSmoothCameraMoveProps) {

    const {setCameraIsMoving} = useSceneStore();
    const isMovingRef = useRef<boolean>(false);
    const startTimeRef = useRef<number>(0);
    const {camera} = useThree();

    useEffect(()=>{
    if(targetPosition){
        isMovingRef.current = true;
        startTimeRef.current = 0;
        setCameraIsMoving(true);
        onMoveStart?.();
    }
},[targetPosition,onMoveStart]); // setCameraIsMoving은 로깅용이기 때문에 의존성 배열에 포함X

useFrame((state, deltaTime) => {
    if(targetPosition && isMovingRef.current){
        //카메라 이동 로직직
        const offset = new THREE.Vector3(5, 5, 3);
        const targetCameraPos = targetPosition.clone().add(offset);
        //경과 시간 계산
        startTimeRef.current += deltaTime;
        const progress = Math.min(startTimeRef.current / duration, 1.0);      
        const easedProgress = easeInOutCubic(progress);
        // 부드러운 카메라 이동
        camera.position.lerp(targetCameraPos, easedProgress);
        controlsRef?.target.lerp(targetPosition, easedProgress);

        // 카메라 이동 완료 체크
        const distance = camera.position.distanceTo(targetCameraPos);
        if(distance < 0.1){
            isMovingRef.current = false;
            setCameraIsMoving(false);
            onMoveEnd?.();
        }
    }
  });
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}