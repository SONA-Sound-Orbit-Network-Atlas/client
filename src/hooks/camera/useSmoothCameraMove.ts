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

  const offset = useMemo(() => new THREE.Vector3(5, 10, 6), []);
  const targetCameraPosRef = useRef<THREE.Vector3 | undefined>(
    targetPosition?.clone().add(offset)
  );

  useEffect(() => {
    if (targetPosition && controlsRef) {
      // 새로운 타겟 위치 업데이트
      targetCameraPosRef.current?.copy(targetPosition.clone().add(offset));

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
      targetCameraPosRef.current &&
      isMovingRef.current &&
      controlsRef
    ) {
      startTimeRef.current += deltaTime;
      const progress = Math.min(startTimeRef.current / duration, 1.0);
      const easedProgress = easeInOutCubic(progress);

      // 카메라 위치를 부드럽게 보간
      camera.position.lerp(targetCameraPosRef.current!, easedProgress * 0.1);

      // 컨트롤 타겟도 부드럽게 보간
      if (controlsRef.target) {
        controlsRef.target.lerp(targetPosition, easedProgress * 0.1);
      }

      // 애니메이션 완료 체크 (시간 기반으로만 체크)
      if (progress >= 1.0) {
        // 정확한 위치로 설정
        camera.position.copy(targetCameraPosRef.current!);
        if (controlsRef.target) {
          controlsRef.target.copy(targetPosition);
        }

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
