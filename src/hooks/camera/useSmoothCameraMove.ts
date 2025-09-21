// hooks/useSmoothCameraMove.ts
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef, useEffect, useMemo } from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useSceneStore } from '@/stores/useSceneStore';
import { useStellarStore } from '@/stores/useStellarStore';

interface UseSmoothCameraMoveProps {
  controlsRef: OrbitControlsImpl | null | undefined;
  duration?: number; // 카메라 이동 시간
  onMoveEnd?: () => void;
  onMoveStart?: () => void;
}

export function useSmoothCameraMove({
  controlsRef,
  duration = 2,
  onMoveEnd,
  onMoveStart,
}: UseSmoothCameraMoveProps) {
  const { setCameraIsMoving } = useSceneStore();
  const isMovingRef = useRef<boolean>(false);
  const startTimeRef = useRef<number>(0);
  const { camera } = useThree();
  const { stellarStore } = useStellarStore();
  const targetPosition = useMemo(() => {
    if (!stellarStore.position) return undefined;
    return new THREE.Vector3(...stellarStore.position);
  }, [stellarStore.position]);

  // 콜백 함수들을 ref로 저장
  const onMoveStartRef = useRef(onMoveStart);
  const onMoveEndRef = useRef(onMoveEnd);

  // ref 업데이트
  onMoveStartRef.current = onMoveStart;
  onMoveEndRef.current = onMoveEnd;

  const offset = useMemo(() => new THREE.Vector3(16, 30, 20), []);

  // 시작 위치와 목표 위치를 저장
  const startCameraPosRef = useRef<THREE.Vector3 | undefined>(undefined);
  const startTargetPosRef = useRef<THREE.Vector3 | undefined>(undefined);
  const targetCameraPosRef = useRef<THREE.Vector3 | undefined>(undefined);

  useEffect(() => {
    if (targetPosition && controlsRef) {
      // 시작 위치 저장 (현재 카메라 위치와 타겟 위치)
      startCameraPosRef.current = camera.position.clone();
      startTargetPosRef.current = controlsRef.target.clone();

      // 목표 위치 설정
      targetCameraPosRef.current = targetPosition.clone().add(offset);

      // 애니메이션 시작
      isMovingRef.current = true;
      startTimeRef.current = 0;
      setCameraIsMoving(true);
      onMoveStartRef.current?.();
    }
  }, [targetPosition, offset, controlsRef, setCameraIsMoving]);

  useFrame((_, deltaTime) => {
    if (
      targetPosition &&
      startCameraPosRef.current &&
      startTargetPosRef.current &&
      targetCameraPosRef.current &&
      isMovingRef.current &&
      controlsRef
    ) {
      startTimeRef.current += deltaTime;
      const progress = Math.min(startTimeRef.current / duration, 1.0);
      const easedProgress = easeInOutCubic(progress);

      // 시작 위치에서 목표 위치로 직접 보간
      camera.position.lerpVectors(
        startCameraPosRef.current,
        targetCameraPosRef.current,
        easedProgress
      );

      // 컨트롤 타겟도 시작에서 목표로 직접 보간
      if (controlsRef.target) {
        controlsRef.target.lerpVectors(
          startTargetPosRef.current,
          targetPosition,
          easedProgress
        );
      }

      // 애니메이션 완료 체크
      if (progress >= 1.0) {
        isMovingRef.current = false;
        setCameraIsMoving(false);
        onMoveEndRef.current?.(); // 종료 콜백 호출
      }
    }
  });
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
