// 메인 항성성

import type { Star } from '@/types/stellar';
import { FakeGlowMaterial } from './materials/FakeGlowMaterial';
import { Outlines, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useEffect, useState, useCallback } from 'react';
import { useSelectedObjectStore } from '@/stores/useSelectedObjectStore';
import { normalizeStarProperties } from '@/utils/display/propertiesNormalization';

interface StarProps {
  star: Star;
  position?: [number, number, number];
}

export default function Star({ star, position = [0, 0, 0] }: StarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const { setSelectedObjectId, selectedObjectId } = useSelectedObjectStore();

  const normalizedStar = normalizeStarProperties(star.properties);

  // 필요한 속성들 추출 (실제 데이터의 속성명 사용)
  const size = normalizedStar.size;
  const color = normalizedStar.color;
  const brightness = normalizedStar.brightness; // 0.01 단위로 변환

  // brightness를 FakeGlowMaterial 속성으로 매핑
  const glowSize = brightness * 0.5; // 0.15 ~ 2.5
  const glowIntensity = Math.min(brightness * 0.3, 1.0); // 0.09 ~ 1.0
  const glowFalloff = Math.max(0.1, 1.0 - brightness * 0.2); // 0.1 ~ 0.9

  const onStarPointerOver = useCallback(() => {
    setIsHovered(true);
  }, []);

  const onStarPointerOut = useCallback(() => {
    setIsHovered(false);
  }, []);

  const onClick = useCallback(() => {
    setSelectedObjectId(star.id);
  }, [setSelectedObjectId, star.id]);
  useEffect(() => {
    setIsSelected(selectedObjectId === star.id);
  }, [selectedObjectId, star.id]);

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
