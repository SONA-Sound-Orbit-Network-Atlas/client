// 행성들 ( 악기들)

import { useFrame, useLoader } from '@react-three/fiber';
import { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import type { Planet } from '@/types/stellar';
import { calculateOrbitPosition } from '@/utils/orbitCalculations';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';
import { valueToColor } from '@/utils/valueToColor';
import { Outlines, Sphere } from '@react-three/drei';
import { FakeGlowMaterial } from './materials/FakeGlowMaterial';

interface PlanetProps {
  planet: Planet;
  isSelectable?: boolean;
}

export default function Planet({ planet, isSelectable = false }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { setSelectedObjectId, selectedObjectId } = useSelectedObjectStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  // Planet의 properties에서 필요한 값들을 추출하는 헬퍼 함수들
  const getPropertyValue = (
    key: keyof typeof planet.properties,
    defaultValue: number = 0
  ): number => {
    return planet.properties[key] ?? defaultValue;
  };

  const cloudTexture = useLoader(THREE.TextureLoader, '/assets/Clouds2.png');

  // 필요한 속성들 추출
  const planetSize = getPropertyValue('planetSize', 0.3);
  const planetColor = getPropertyValue('planetColor', 100);
  const planetBrightness = getPropertyValue('planetBrightness', 0.3);
  const distanceFromStar = getPropertyValue('distanceFromStar', 10.5);

  // planetBrightness를 FakeGlowMaterial 속성으로 매핑
  const glowSize = planetBrightness * 0.3; // 0.09 ~ 1.5
  const glowIntensity = Math.min(planetBrightness * 0.2, 1.0); // 0.06 ~ 1.0
  const glowFalloff = Math.max(0.1, 1.0 - planetBrightness * 0.15); // 0.1 ~ 0.925
  const orbitSpeed = getPropertyValue('orbitSpeed', 0.5);
  const rotationSpeed = getPropertyValue('rotationSpeed', 0.01);
  const inclination = getPropertyValue('inclination', 0);
  const eccentricity = getPropertyValue('eccentricity', 0);
  const tilt = getPropertyValue('tilt', 0);

  // OrbitLine을 위한 점들 계산
  const orbitPoints = useMemo(() => {
    const defaultSegments = 128;
    const curvePoints = [];

    for (let i = 0; i <= defaultSegments; i++) {
      const angle = (i / defaultSegments) * 2 * Math.PI;
      const { x, y, z } = calculateOrbitPosition(
        distanceFromStar,
        inclination,
        eccentricity,
        angle
      );
      curvePoints.push(new THREE.Vector3(x, y, z));
    }

    return curvePoints;
  }, [distanceFromStar, inclination, eccentricity]);

  const orbitGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(orbitPoints);
  }, [orbitPoints]);

  useEffect(() => {
    setIsSelected(selectedObjectId === planet.id);
  }, [selectedObjectId, planet.id]);

  const onPlanetClicked = () => {
    if (isSelectable) {
      setSelectedObjectId(planet.id);
    }
  };
  const onPlanetPointerOver = () => {
    setIsHovered(true);
  };
  const onPlanetPointerOut = () => {
    setIsHovered(false);
  };

  // const color = new THREE.Color(valueToColor(planetColor, 0, 360));
  const color = useMemo(() => {
    return new THREE.Color(valueToColor(planetColor, 0, 360));
  }, [planetColor]);
  // Atmosphere + Cloud Shader
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uBaseColor: { value: new THREE.Color(color) },
        uCloudMap: { value: cloudTexture },
        uRotation: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uBaseColor;
        uniform sampler2D uCloudMap;
        uniform float uRotation;
        varying vec2 vUv;

        vec2 rotateUV(vec2 uv, float angle) {
          vec2 center = uv - 0.5;
          float s = sin(angle);
          float c = cos(angle);
          mat2 rot = mat2(c, -s, s, c);
          return rot * center + 0.5;
        }

        void main() {
          vec2 uv = rotateUV(vUv, uRotation);
          vec3 cloudColor = texture2D(uCloudMap, uv).rgb;

          // 채도 낮추기: gray mix
          float gray = dot(cloudColor, vec3(0.299, 0.587, 0.114));
          vec3 finalColor = mix(uBaseColor, vec3(gray), 0.5);

          gl_FragColor = vec4(finalColor, 0.5);
        }
      `,
    });
  }, [color, cloudTexture]);

  useFrame((state, deltaTime) => {
    if (meshRef.current) {
      // 1. 공전 각도 계산
      const currentAngle = orbitSpeed * state.clock.elapsedTime;

      // 2. 타원 궤도 계산
      const { x, y, z } = calculateOrbitPosition(
        distanceFromStar,
        inclination,
        eccentricity,
        currentAngle
      );

      // 3. 위치 업데이트
      meshRef.current.position.set(x, y, z);

      // 4. 자전 (Y축 기준으로 자전속도만 적용)
      meshRef.current.rotation.y += rotationSpeed * deltaTime;
    }
  });

  // 자전축 기울기(tilt) 초기 설정
  useEffect(() => {
    if (meshRef.current) {
      // tilt를 라디안으로 변환하여 X축 회전으로 적용 (자전축 기울기)
      // Z축 회전이 아닌 X축 회전으로 자전축을 기울임
      meshRef.current.rotation.x = (tilt * Math.PI) / 180;
    }
  }, [tilt]);

  return (
    <>
      {/* OrbitLine 렌더링 */}
      <lineLoop geometry={orbitGeometry}>
        <lineBasicMaterial color={isSelected ? 'green' : '#4f4f4f'} />
      </lineLoop>

      {/* Planet 렌더링 */}
      <group ref={meshRef}>
        {/* planet */}
        <mesh
          onClick={onPlanetClicked}
          onPointerOver={onPlanetPointerOver}
          onPointerOut={onPlanetPointerOut}
          renderOrder={2}
        >
          <Outlines
            thickness={1}
            color={isHovered ? '#FFFFFF' : 'yellow'}
            visible={isHovered || isSelected}
          />
          <sphereGeometry args={[planetSize, 16, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
        Atmosphere + Clouds
        <mesh ref={atmosphereRef} scale={1.01} material={atmosphereMaterial}>
          <sphereGeometry args={[planetSize, 64, 64]} />
        </mesh>
        {/* glow */}
        <Sphere
          args={[planetSize * (2 + glowSize), 16, 16]}
          renderOrder={1}
          visible={true}
        >
          <FakeGlowMaterial
            falloff={glowFalloff}
            glowInternalRadius={6}
            glowColor={valueToColor(planetColor, 0, 360)}
            glowSharpness={glowIntensity * 5}
            side={THREE.DoubleSide}
            depthTest={true}
            depthWrite={false}
          />
        </Sphere>
      </group>
    </>
  );
}
