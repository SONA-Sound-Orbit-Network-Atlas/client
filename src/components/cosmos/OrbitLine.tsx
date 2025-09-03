import { calculateOrbitPosition } from '@/utils/orbitCalculations';
import { useMemo } from 'react';
import * as THREE from 'three';

interface OrbitLineProps {
  orbitRadius: number;
  inclination: number;
  eccentricity: number;
}

export default function OrbitLine({
  orbitRadius,
  inclination,
  eccentricity,
}: OrbitLineProps) {
  const defaultSegments = 128;

  const points = useMemo(() => {
    const curvePoints = [];
    for (let i = 0; i <= defaultSegments; i++) {
      // 1. 공전 각도 계산
      const angle = (i / defaultSegments) * 2 * Math.PI;
      // 2. 타원 궤도 계산
      const { x, y, z } = calculateOrbitPosition(
        orbitRadius,
        inclination,
        eccentricity,
        angle
      );

      // 3. 위치 업데이트
      curvePoints.push(new THREE.Vector3(x, y, z));
    }

    return curvePoints;
  }, [orbitRadius, inclination, eccentricity]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <lineLoop geometry={geometry}>
      <lineBasicMaterial color="white" />
    </lineLoop>
  );
}
