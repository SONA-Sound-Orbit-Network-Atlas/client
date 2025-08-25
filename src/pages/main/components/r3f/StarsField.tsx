import * as THREE from 'three';
import { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

type Props = {
  count?: number;
  autoExpand?: boolean; // 자동으로 확산 시작할지 여부
  centerStart?: boolean; // 중앙에서 시작할지 여부
};

export default function StarsField({
  count = 2500,
  autoExpand = false,
  centerStart = false,
}: Props) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  // centerStart가 false이고 autoExpand가 true면 즉시 확산 완료 (메인 페이지)
  const [animationProgress, setAnimationProgress] = useState(
    autoExpand && !centerStart ? 1 : 0
  );
  const [isExpanding, setIsExpanding] = useState(autoExpand && !centerStart);

  // 자동 확산 시작
  useEffect(() => {
    if (autoExpand && !isExpanding) {
      setIsExpanding(true);
    }
  }, [autoExpand, isExpanding]);

  // 별들의 최종 목표 위치 생성
  const starsData = useMemo(() => {
    const finalPositions: THREE.Vector3[] = [];
    const scales: number[] = [];
    const colors: THREE.Color[] = [];

    for (let i = 0; i < count; i++) {
      // 구형 좌표계로 최종 위치 생성
      const phi = Math.acos(2.0 * Math.random() - 1.0);
      const theta = Math.random() * 2.0 * Math.PI;
      const radius = 8 + Math.random() * 12;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      finalPositions.push(new THREE.Vector3(x, y, z));

      // 별들 크기
      const scale = Math.random() * 0.08 + 0.04;
      scales.push(scale);

      // 민트색 계열 색상
      const hue = Math.random() * 0.1 + 0.5; // 민트-청록색 계열 (0.5-0.6)
      const saturation = 0.6 + Math.random() * 0.4;
      const lightness = 0.5 + Math.random() * 0.3;
      const color = new THREE.Color().setHSL(hue, saturation, lightness);
      colors.push(color);
    }

    return { finalPositions, scales, colors };
  }, [count]);

  // 인스턴스 매트릭스 초기화 (모든 별들을 중앙에 위치시킴)
  useMemo(() => {
    if (!meshRef.current) return;

    const temp = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      // 초기에는 모든 별들을 중앙(0, 0, 0)에 위치시킴
      temp.position.set(0, 0, 0);
      temp.scale.setScalar(starsData.scales[i]);
      temp.updateMatrix();
      meshRef.current.setMatrixAt(i, temp.matrix);
      meshRef.current.setColorAt(i, starsData.colors[i]);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [starsData, count]);

  // 이징 함수
  function easeOutQuart(t: number): number {
    return 1 - Math.pow(1 - t, 4);
  }

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const temp = new THREE.Object3D();

    // 애니메이션 진행도 업데이트
    if (isExpanding && animationProgress < 1) {
      setAnimationProgress((prev) => Math.min(prev + delta * 0.8, 1));
    }

    // 별들 애니메이션
    const easedProgress = easeOutQuart(animationProgress);

    // 셰이더 uniforms 업데이트
    if (meshRef.current.material && 'uniforms' in meshRef.current.material) {
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.time.value =
        time;
    }

    for (let i = 0; i < count; i++) {
      const finalPos = starsData.finalPositions[i];

      // 초기 위치(중앙)에서 최종 위치로 보간
      const currentPos = new THREE.Vector3().lerpVectors(
        new THREE.Vector3(0, 0, 0), // 시작 위치 (중앙)
        finalPos, // 최종 위치
        easedProgress
      );

      temp.position.copy(currentPos);
      temp.scale.setScalar(starsData.scales[i] * (0.1 + easedProgress * 0.9));

      // 빌보드 효과
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
          varying float vOpacity;
          
          float random(float n) {
            return fract(sin(n * 12.9898) * 43758.5453);
          }
          
          void main() {
            vUv = uv;
            
            float instanceId = float(gl_InstanceID);
            vOpacity = random(instanceId) * 0.6 + 0.3;
            
            vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          varying float vOpacity;
          
          void main() {
            float distance = length(vUv - 0.5);
            
            float coreAlpha = 1.0 - smoothstep(0.0, 0.25, distance);
            coreAlpha = pow(coreAlpha, 1.5) * 0.9;
            
            float glowAlpha = 1.0 - smoothstep(0.0, 1.0, distance);
            glowAlpha = pow(glowAlpha, 4.0) * 0.25;
            
            float alpha = max(coreAlpha, glowAlpha) * 0.9;
            alpha *= vOpacity;
            
            // 민트색 계열로 변경
            vec3 colorCore = vec3(0.4, 1.0, 0.9);   // 밝은 민트색
            vec3 colorGlow = vec3(0.2, 0.6, 0.6);   // 어두운 민트색
            
            float colorMix = coreAlpha / (coreAlpha + glowAlpha + 0.001);
            vec3 finalColor = mix(colorGlow, colorCore, colorMix);
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `}
      />
    </instancedMesh>
  );
}
