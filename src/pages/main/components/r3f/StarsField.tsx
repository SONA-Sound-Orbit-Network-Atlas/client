import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
// import { useScroll } from '@react-three/drei'; // 깜빡임 방지를 위해 현재 사용 안 함

type Props = {
  // totalPages?: number; // 깜빡임 방지를 위해 현재 사용 안 함
  count?: number;
};

export default function StarsField({ count = 2000 }: Props) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  // const scroll = useScroll(); // 깜빡임 방지를 위해 현재 사용 안 함

  // 구들의 초기 데이터 생성
  const sphereData = useMemo(() => {
    const positions: { phi: number; theta: number }[] = [];
    const scales: number[] = [];
    const colors: THREE.Color[] = [];
    const speeds: number[] = [];
    for (let i = 0; i < count; i++) {
      // 구형 좌표계로 위치 생성 (phi, theta 저장)
      const phi = Math.acos(2.0 * Math.random() - 1.0); // 수직 각도 (0 ~ π)
      const theta = Math.random() * 2.0 * Math.PI; // 수평 각도 (0 ~ 2π)

      // 구형 좌표를 객체로 저장
      positions.push({ phi, theta });

      // ========== 별들 크기 조절 ==========
      const scale = Math.random() * 0.1 + 0.05; // 크기 범위: 최소 0.05 ~ 최대 0.15
      scales.push(scale);

      // 파란색 계열 색상
      const hue = Math.random() * 0.2 + 0.5; // 파란색~청록색
      const saturation = 0.6 + Math.random() * 0.4;
      const lightness = 0.4 + Math.random() * 0.4;
      const color = new THREE.Color().setHSL(hue, saturation, lightness);
      colors.push(color);

      // 회전 속도 (현재는 사용 안 함)
      speeds.push(Math.random() * 0.02 + 0.005);
    }

    return { positions, scales, colors, speeds };
  }, [count]);

  // 인스턴스 매트릭스 초기화
  useMemo(() => {
    if (!meshRef.current) return;

    const temp = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      // 초기 위치는 구형 좌표계로 계산
      const radius = 6; // 별들이 HeroCube로부터 떨어진 거리 (위의 useFrame과 동일하게 조절)
      const phi = sphereData.positions[i].phi;
      const theta = sphereData.positions[i].theta;

      temp.position.x = radius * Math.sin(phi) * Math.cos(theta);
      temp.position.y = radius * Math.cos(phi);
      temp.position.z = radius * Math.sin(phi) * Math.sin(theta);

      temp.scale.setScalar(sphereData.scales[i]);
      temp.updateMatrix();
      meshRef.current.setMatrixAt(i, temp.matrix);
      meshRef.current.setColorAt(i, sphereData.colors[i]);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [sphereData, count]);

  useFrame((state) => {
    if (!meshRef.current) return;

    // 동적으로 범위 계산 (현재는 깜빡임 방지를 위해 사용 안 함)
    // const pageSize = 1 / totalPages;
    // const r1 = scroll.range(0 * pageSize, pageSize);
    // const r3 = scroll.range(2 * pageSize, pageSize);

    const temp = new THREE.Object3D();
    const time = state.clock.elapsedTime;

    // 셰이더 uniforms 업데이트
    if (meshRef.current.material && 'uniforms' in meshRef.current.material) {
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.time.value =
        time;
    }

    for (let i = 0; i < count; i++) {
      const basePosition = sphereData.positions[i];

      // ========== 회전 설정 ==========
      const rotationSpeed = 0; // 회전 속도 (양수=반시계, 음수=시계방향, 절댓값이 클수록 빠름) - 0으로 설정하여 회전 정지
      const angle = time * rotationSpeed + (i / count) * Math.PI * 2;

      // ========== 별들 위치 설정 ==========
      const radius = 6; // HeroCube로부터의 거리 (클수록 멀어짐, 작을수록 가까워짐)
      const phi = basePosition.phi; // 수직 각도 (구에서의 위도)
      const theta = basePosition.theta + angle; // 수평 각도 + 회전

      temp.position.x = radius * Math.sin(phi) * Math.cos(theta);
      temp.position.y = radius * Math.cos(phi);
      temp.position.z = radius * Math.sin(phi) * Math.sin(theta);

      // 완전히 고정된 크기 (깜빡임 완전 방지)
      const baseScale = sphereData.scales[i];
      // const scaleMultiplier = 1 + r1 * 0.1 + r3 * 0.05; // 스케일 변화 - 깜빡임 방지를 위해 주석 처리
      temp.scale.setScalar(baseScale); // 고정 크기

      // 빌보드 효과 - 항상 카메라를 향하도록
      temp.lookAt(state.camera.position);

      temp.updateMatrix();
      meshRef.current.setMatrixAt(i, temp.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        uniforms={{
          time: { value: 0 },
          size: { value: 0.05 },
        }}
        vertexShader={`
          uniform float size;
          varying vec2 vUv;
          varying float vOpacity; // 각 별의 투명도 전달
          
          // 인스턴스 ID를 기반으로 랜덤 값 생성
          float random(float n) {
            return fract(sin(n * 12.9898) * 43758.5453);
          }
          
          void main() {
            vUv = uv;
            
            // 인스턴스 ID를 기반으로 각 별마다 다른 투명도 생성
            float instanceId = float(gl_InstanceID);
            vOpacity = random(instanceId) * 0.6 + 0.3; // 0.3 ~ 0.9 범위
            
            vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          varying float vOpacity; // 각 별의 투명도 받기
          
          void main() {
            // 중심에서의 거리 계산
            float distance = length(vUv - 0.5);
            
            // ========== 별의 구체 부분 (코어) 조절 ==========
            float coreAlpha = 1.0 - smoothstep(0.0, 0.25, distance);
            //                                  ↑     ↑
            //                            시작점   끝점 (적당한 크기의 밝은 코어)
            coreAlpha = pow(coreAlpha, 1.5) * 0.9; // 밝고 선명한 코어
            
            // ========== 네온 글로우 효과 조절 ==========
            float glowAlpha = 1.0 - smoothstep(0.0, 1.0, distance);
            //                                       ↑
            //                              글로우 범위 (배경까지 영향을 주도록 더 넓게)
            glowAlpha = pow(glowAlpha, 4.0) * 0.25;
            //                         ↑       ↑
            //                    선명도      강도 (배경 조명 효과를 위해 약간 증가)
            //                 (매우 부드럽게)  (배경까지 은은하게 밝히는 효과)
            
            // ========== 전체 밝기 조절 ==========
            float alpha = max(coreAlpha, glowAlpha) * 0.9;
            //                                        ↑
            //                              전체 네온 밝기 (캡처처럼 은은한 밝기)
            
            // ========== 개별 투명도 적용 ==========
            alpha *= vOpacity; // 각 별마다 다른 투명도 적용
            
            // ========== 네온 색상 조절 ==========
            vec3 colorCore = vec3(0.6, 0.8, 1.0);   // 코어 색상 (밝고 화려하게)
            vec3 colorGlow = vec3(0.08, 0.15, 0.4); // 글로우 색상 (캡처처럼 은은한 파란색)
            
            // 거리에 따른 색상 혼합
            float colorMix = coreAlpha / (coreAlpha + glowAlpha + 0.001);
            vec3 finalColor = mix(colorGlow, colorCore, colorMix);
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `}
      />
    </instancedMesh>
  );
}
