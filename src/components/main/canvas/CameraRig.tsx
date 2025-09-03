import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import mainStore from '../store/mainStore';

type CameraRigProps = {
  // 줌의 시작/끝 z값 (퍼스펙티브라 z이동으로 줌 느낌)
  zStart?: number;
  zEnd?: number;
};

export default function CameraRig({ zStart = 15, zEnd = -6 }: CameraRigProps) {
  const { camera } = useThree();
  const lookAt = new THREE.Vector3(0, 0, -4.5); // 별모임 중심

  useFrame((_, dt) => {
    // DOM 스크롤 위치를 사용하여 offset 계산
    const scrollTop = mainStore.top;
    const maxScroll = (mainStore.sections - 1) * window.innerHeight;
    const o = Math.min(scrollTop / maxScroll, 1); // 0..1

    // 섹션별로 단계적으로 확대되는 효과
    const sectionProgress = o * (mainStore.sections - 1); // 0 ~ 5 범위
    const currentSection = Math.floor(sectionProgress);
    const sectionOffset = sectionProgress - currentSection;

    // 각 섹션마다 일정한 크기로 "확" 줌인되는 효과
    const easedOffset = Math.pow(sectionOffset, 2); // 더 강한 가속으로 극적인 줌
    const easedScroll =
      (currentSection + easedOffset) / (mainStore.sections - 1);

    // zEnd를 -6으로 설정하여 별모임(z=-4.5) 뒤편까지 들어가기
    const safeZEnd = Math.max(-6, zEnd);
    const targetZ = THREE.MathUtils.lerp(zStart, safeZEnd, easedScroll);

    // OrthographicCamera의 경우 zoom 속성을 직접 조정하여 시각적 줌 효과 생성
    if (camera.type === 'OrthographicCamera') {
      const orthoCamera = camera as THREE.OrthographicCamera;

      // 기본 줌에서 스크롤에 따라 줌 대폭 증가 (75 → 1000)
      const baseZoom = 75;
      const maxZoom = 1000; // 훨씬 더 큰 줌으로 별모임 속으로
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
