// 행성들 ( 악기들)

import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Planet } from '@/types/stellar';
import { calculateOrbitPosition } from '@/utils/orbitCalculations';
import { useSceneStore } from '@/stores/useSceneStore';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';
import { valueToColor } from '@/utils/valueToColor';
import { Outlines } from '@react-three/drei';

interface PlanetProps {
  planet: Planet;
  isSelectable?: boolean;
}

export default function Planet({ planet, isSelectable = false }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { setSelectedPlanetIndex } = useSceneStore();
  const { setSelectedObjectId } = useSelectedObjectStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const { selectedObjectId } = useSelectedObjectStore();

  // Planet의 properties에서 필요한 값들을 추출하는 헬퍼 함수들
  const getPropertyValue = (
    label: string,
    defaultValue: number = 0
  ): number => {
    const property = planet.properties.find((prop) => prop.label === label);
    return property?.value ?? defaultValue;
  };

  // 필요한 속성들 추출
  const planetSize = getPropertyValue('planetSize', 0.3);
  const planetColor = getPropertyValue('planetColor', 100);
  const planetBrightness = getPropertyValue('planetBrightness', 0.3);
  const distanceFromStar = getPropertyValue(
    'distanceFromStar',
    planet.planetId + 1
  );
  const orbitSpeed = getPropertyValue('orbitSpeed', 0.5);
  const rotationSpeed = getPropertyValue('rotationSpeed', 0.01);
  const inclination = getPropertyValue('inclination', 0);
  const eccentricity = getPropertyValue('eccentricity', 0);
  const tilt = getPropertyValue('tilt', 0);

  useEffect(() => {
    setIsSelected(selectedObjectId === planet.planetId);
  }, [selectedObjectId, planet.planetId]);

  const onPlanetClicked = () => {
    if (isSelectable) {
      setSelectedPlanetIndex(planet.planetId);
      setSelectedObjectId(planet.planetId);
    }
  };
  const onPlanetPointerOver = () => {
    setIsHovered(true);
  };
  const onPlanetPointerOut = () => {
    setIsHovered(false);
  };

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

      // 4. 자전
      meshRef.current.rotation.y += rotationSpeed * deltaTime;
      meshRef.current.rotation.z += tilt * deltaTime;
    }
  });

  return (
    <mesh
      ref={meshRef}
      onClick={onPlanetClicked}
      onPointerOver={onPlanetPointerOver}
      onPointerOut={onPlanetPointerOut}
    >
      <Outlines
        thickness={1}
        color={isHovered ? 'white' : 'yellow'}
        visible={isHovered || isSelected}
      />
      <sphereGeometry args={[planetSize, 16, 16]} />
      <meshStandardMaterial
        color={valueToColor(planetColor, 0, 360)}
        emissive={isSelected ? '#ff0000' : '#000000'}
        emissiveIntensity={planetBrightness}
      />
    </mesh>
  );
}
