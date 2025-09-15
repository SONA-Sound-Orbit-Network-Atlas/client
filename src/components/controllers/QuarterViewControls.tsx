import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useThree } from '@react-three/fiber';
import { useSmoothCameraMove } from '@/hooks/camera/useSmoothCameraMove';
import { VIEW_MODE_CONFIG } from '@/constants/viewModeConfig';
import { useSelectedStellarStore } from '@/stores/useSelectedStellarStore';

/**
 * X,Z축 이동
 * y축 이동 제한
 * 쿼터뷰 이동방식 구현
 * @returns 카메라 및 이동 제어 컴포넌트
 */

export default function QuarterViewControls() {
  const controls = useRef<OrbitControlsImpl>(null);
  const { mode } = useSelectedStellarStore();
  const { camera } = useThree();

  useSmoothCameraMove({
    controlsRef: controls.current,
    duration: VIEW_MODE_CONFIG.transition.galaxyToStellar.duration,
  });

  return (
    <OrbitControls
      ref={controls}
      enabled={mode === 'idle'}
      camera={camera}
      enableRotate={true}
      enablePan={true}
      screenSpacePanning={false}
      enableZoom={true}
      mouseButtons={{
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE,
      }}
      // 추가 커스터마이징
      panSpeed={0.8} // 패닝 속도
      zoomSpeed={1.2} // 줌 속도
      minDistance={2} // 최소 줌 거리
      maxDistance={50} // 최대 줌 거리
      maxPolarAngle={Math.PI / 2.5} // 최대 수직 각도 (쿼터뷰 제한)
      minPolarAngle={Math.PI / 6} // 최소 수직 각도
    />
  );
}
