import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// 별 배치 설정
const STAR_CONFIG = {
  COUNT: 1500, // 별 개수
  SPREAD_X: 4000, // X축 방향 퍼짐 범위
  SPREAD_Y: 1000, // Y축 방향 퍼짐 범위
  SPREAD_Z: 4000, // Z축 방향 퍼짐 범위
} as const;

// 별 렌더링 설정
const RENDER_CONFIG = {
  SIZE: 2, // 별 크기
  OPACITY: 0.8, // 투명도
  ALPHA_TEST: 0.01, // 투명도 임계값 (선명도)
} as const;

export default function BackgroundStars() {
  const { camera } = useThree();
  const pointsRef = useRef<THREE.Points>(null);

  // 별들의 geometry 생성
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    for (let i = 0; i < STAR_CONFIG.COUNT; i++) {
      positions.push(
        (Math.random() - 0.5) * STAR_CONFIG.SPREAD_X, // X축 범위
        (Math.random() - 0.5) * STAR_CONFIG.SPREAD_Y, // Y축 범위
        (Math.random() - 0.5) * STAR_CONFIG.SPREAD_Z // Z축 범위
      );
      colors.push(1, 1, 1); // 흰색
    }

    geo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    return geo;
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      // 카메라 위치에 별들을 고정
      pointsRef.current.position.copy(camera.position);
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={RENDER_CONFIG.SIZE}
        vertexColors
        transparent
        opacity={RENDER_CONFIG.OPACITY}
        sizeAttenuation={true} // 거리에 따른 크기 변화
        alphaTest={RENDER_CONFIG.ALPHA_TEST} // 투명도 임계값으로 더 선명한 가장자리
        blending={THREE.AdditiveBlending} // 가산 블렌딩으로 더 부드럽게
        depthWrite={false} // 깊이 버퍼 쓰기 비활성화
        map={undefined}
        fog={false}
      />
    </points>
  );
}
