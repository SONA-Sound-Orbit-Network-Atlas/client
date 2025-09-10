import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useRef } from 'react';
import { useSmoothCameraMove } from '@/hooks/camera/useSmoothCameraMove';
import { VIEW_MODE_CONFIG } from '@/constants/viewModeConfig';
import { useSceneStore } from '@/stores/useSceneStore';

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
  const controls = useRef<OrbitControlsImpl>(null);
  const { cameraIsMoving } = useSceneStore();

  // 카메라 이동 로직
  useSmoothCameraMove({
    targetPosition,
    controlsRef: controls.current!,
    duration: VIEW_MODE_CONFIG.transition.galaxyToStellar.duration,
  });

  return (
    <OrbitControls
      ref={controls}
      enableDamping={!cameraIsMoving} // 카메라 이동 중에는 damping 비활성화
      dampingFactor={0.05}
      enableRotate={!cameraIsMoving} // 카메라 이동 중에는 회전 비활성화
      enableZoom={!cameraIsMoving} // 카메라 이동 중에는 줌 비활성화
      enablePan={false}
      maxDistance={VIEW_MODE_CONFIG.thresholds.maxStellarZoomDistance}
    />
  );
}
