import { OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useRef, useCallback } from 'react';
import { useSceneStore } from '@/stores/useSceneStore';
import { useSmoothCameraMove } from '@/hooks/camera/useSmoothCameraMove';
import { useChangeViewModeOnOutOfDistance } from '@/hooks/camera/useChangeViewModeOnOutOfDistance';
import { VIEW_MODE_CONFIG } from '@/constants/viewModeConfig';

/**
 * X,Z축 이동
 * y축 이동 제한
 * 쿼터뷰 이동방식 구현
 * @returns 카메라 및 이동 제어 컴포넌트
 */

interface OrbitViewControlsProps {
  targetPosition: THREE.Vector3;
}

export default function OrbitViewControls({
  targetPosition,
}: OrbitViewControlsProps) {
  //test code
  const { setCameraTarget } = useSceneStore();

  const isMovingRef = useRef<boolean>(false);
  const controls = useRef<OrbitControlsImpl>(null);
  const distanceRef = useRef<number>(0);

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
    duration: VIEW_MODE_CONFIG.transition.galaxyToStellar.duration,
    onMoveStart: handleMoveStart,
    onMoveEnd: handleMoveEnd,
  });

  // 거리 계산 로직
  useFrame(() => {
    distanceRef.current = controls.current?.getDistance() || 0;
  });

  return (
    <OrbitControls
      ref={controls}
      enableDamping={true}
      dampingFactor={0.05}
      enableRotate={true}
      enableZoom={!isMovingRef.current}
      enablePan={false}
      maxDistance={VIEW_MODE_CONFIG.thresholds.maxStellarZoomDistance}
    />
  );
}
