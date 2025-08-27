// src/pages/main/CameraRig.tsx
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import state from './store';

type Props = {
  // 줌의 시작/끝 z값 (퍼스펙티브라 z이동으로 줌 느낌)
  zStart?: number;
  zEnd?: number;
};

export default function CameraRig({ zStart = 15, zEnd = -2 }: Props) {
  const { camera } = useThree();
  const lookAt = new THREE.Vector3(0, 0, -4.5); // 별모임 중심

  useFrame((_, dt) => {
    // DOM 스크롤 위치를 사용하여 offset 계산
    const scrollTop = state.top;
    const maxScroll = (state.sections - 1) * window.innerHeight;
    const o = Math.min(scrollTop / maxScroll, 1); // 0..1

    // 스크롤에 따라 더 빠르게 줌인되도록 곡선 적용
    const easedScroll = Math.pow(o, 0.3); // 0.3 제곱으로 매우 극적인 줌인

    // zEnd를 -2로 설정하여 별모임(z=-4.5) 중앙으로 들어가기
    const safeZEnd = Math.max(-2, zEnd);
    const targetZ = THREE.MathUtils.lerp(zStart, safeZEnd, easedScroll);

    // OrthographicCamera의 경우 zoom 속성을 직접 조정하여 시각적 줌 효과 생성
    if (camera.type === 'OrthographicCamera') {
      const orthoCamera = camera as THREE.OrthographicCamera;

      // 기본 줌에서 스크롤에 따라 줌 대폭 증가 (75 → 400)
      const baseZoom = 75;
      const maxZoom = 400;
      const targetZoom = THREE.MathUtils.lerp(baseZoom, maxZoom, easedScroll);

      // 부드러운 줌 전환
      orthoCamera.zoom = THREE.MathUtils.damp(
        orthoCamera.zoom,
        targetZoom,
        6,
        dt
      );

      // 줌 변경 후 projection matrix 업데이트 필수!
      orthoCamera.updateProjectionMatrix();
    }

    // 더 빠른 카메라 이동을 위해 damping 값 증가
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 8, dt);

    // 별모임 중심을 바라보도록 설정
    camera.lookAt(lookAt);
  });

  return null;
}
