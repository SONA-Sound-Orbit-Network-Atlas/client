// 메인 항성성

import type { CentralStar } from '@/types/stellar';
import { valueToColor } from '@/utils/valueToColor';
import { FakeGlowMaterial } from './materials/FakeGlowMaterial';
import { Outlines, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useEffect, useState } from 'react';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';

interface StarProps {
  centralStar: CentralStar;
  position?: [number, number, number];
}

export default function Star({ centralStar, position = [0, 0, 0] }: StarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const { setSelectedObjectId, selectedObjectId } = useSelectedObjectStore();

  // CentralStar의 properties에서 필요한 값들을 추출하는 헬퍼 함수
  const getPropertyValue = (
    label: string,
    defaultValue: number = 1
  ): number => {
    const property = centralStar.properties.find(
      (prop) => prop.label === label
    );
    return property?.value ?? defaultValue;
  };

  // 필요한 속성들 추출 (실제 데이터의 속성명 사용)
  const size = getPropertyValue('planetSize', 1); // 0.01 단위로 변환
  const colorValue = getPropertyValue('planetColor', 100);
  const brightness = getPropertyValue('planetBrightness', 0.5); // 0.01 단위로 변환

  // 색상 변환 (숫자 값을 색상으로)
  const color = valueToColor(colorValue, 0, 360);

  // brightness를 FakeGlowMaterial 속성으로 매핑
  const glowSize = brightness * 0.5; // 0.15 ~ 2.5
  const glowIntensity = Math.min(brightness * 0.3, 1.0); // 0.09 ~ 1.0
  const glowFalloff = Math.max(0.1, 1.0 - brightness * 0.2); // 0.1 ~ 0.9

  const onStarPointerOver = () => {
    setIsHovered(true);
  };
  const onStarPointerOut = () => {
    setIsHovered(false);
  };
  const onClick = () => {
    setSelectedObjectId(centralStar.planetId);
  };
  useEffect(() => {
    setIsSelected(selectedObjectId === centralStar.planetId);
  }, [selectedObjectId, centralStar.planetId]);

  return (
    <group>
      <Sphere
        args={[size, 32, 32]}
        renderOrder={1}
        position={position}
        onClick={onClick}
        onPointerOver={onStarPointerOver}
        onPointerOut={onStarPointerOut}
        receiveShadow={false}
      >
        <Outlines
          thickness={1}
          color={isHovered ? 'white' : 'yellow'}
          visible={isHovered || isSelected}
        />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={brightness}
        />
      </Sphere>
      <Sphere
        args={[size * (3.0 + glowSize), 32, 32]}
        renderOrder={1}
        position={position}
      >
        <FakeGlowMaterial
          falloff={glowFalloff}
          glowInternalRadius={6}
          glowColor={color}
          glowSharpness={glowIntensity * 3}
          side={THREE.DoubleSide}
          depthTest={true}
          depthWrite={false}
        />
      </Sphere>
    </group>
  );
}
