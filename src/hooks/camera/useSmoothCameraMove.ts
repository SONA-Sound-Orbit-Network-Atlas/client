// hooks/useSmoothCameraMove.ts
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef, useEffect, useMemo } from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useSceneStore } from '@/stores/useSceneStore';

interface UseSmoothCameraMoveProps {
  targetPosition: THREE.Vector3; // 이동 목표 포지션
  controlsRef: OrbitControlsImpl | null | undefined;
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
  const { setCameraIsMoving } = useSceneStore();
  const isMovingRef = useRef<boolean>(false);
  const startTimeRef = useRef<number>(0);
  const { camera } = useThree();

  // 콜백 함수들을 ref로 저장
  const onMoveStartRef = useRef(onMoveStart);
  const onMoveEndRef = useRef(onMoveEnd);

  // ref 업데이트
  onMoveStartRef.current = onMoveStart;
  onMoveEndRef.current = onMoveEnd;

  const offset = useMemo(() => new THREE.Vector3(5, 10, 6), []);
  const targetCameraPosRef = useRef<THREE.Vector3>(
    targetPosition.clone().add(offset)
  );

  useEffect(() => {
    if (targetPosition) {
      // 새로운 타겟 위치 업데이트
      targetCameraPosRef.current.copy(targetPosition.clone().add(offset));

      // controlsRef가 준비되었을 때만 애니메이션 시작
      if (controlsRef) {
        isMovingRef.current = true;
        startTimeRef.current = 0;
        setCameraIsMoving(true);
        onMoveStartRef.current?.();
      }
    }
  }, [targetPosition, offset, controlsRef, setCameraIsMoving]);

  // controlsRef가 준비된 후 대기 중인 애니메이션 시작
  useEffect(() => {
    if (controlsRef && targetPosition && !isMovingRef.current) {
      // 타겟 위치가 이미 설정되어 있고 애니메이션이 시작되지 않았다면 시작
      const currentTarget = targetCameraPosRef.current.clone().sub(offset);
      if (currentTarget.distanceTo(targetPosition) > 0.1) {
        isMovingRef.current = true;
        startTimeRef.current = 0;
        setCameraIsMoving(true);
        onMoveStartRef.current?.();
      }
    }
  }, [controlsRef, targetPosition, offset, setCameraIsMoving]);

  useFrame((_, deltaTime) => {
    if (targetPosition && isMovingRef.current && controlsRef) {
      startTimeRef.current += deltaTime;
      const progress = Math.min(startTimeRef.current / duration, 1.0);
      const easedProgress = easeInOutCubic(progress);

      // 카메라 위치를 부드럽게 보간
      camera.position.lerp(targetCameraPosRef.current, easedProgress * 0.1);

      // 컨트롤 타겟도 부드럽게 보간
      if (controlsRef.target) {
        controlsRef.target.lerp(targetPosition, easedProgress * 0.1);
      }

      // 애니메이션 완료 체크 (거리와 시간 모두 고려)
      const distance = camera.position.distanceTo(targetCameraPosRef.current);
      if (distance < 0.1 || progress >= 1.0) {
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
