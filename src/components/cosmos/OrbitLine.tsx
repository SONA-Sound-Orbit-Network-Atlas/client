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
    const inclinationRad = (inclination * Math.PI) / 180;
    const curvePoints = [];

    for (let i = 0; i <= defaultSegments; i++) {
      const angle = (i / defaultSegments) * 2 * Math.PI;

      // 타원 궤도 계산 (Planet과 동일한 방식)
      const semiMajorAxis = orbitRadius;
      const semiMinorAxis =
        orbitRadius * Math.sqrt(1 - eccentricity * eccentricity);

      const baseX = semiMajorAxis * Math.cos(angle);
      const baseZ = semiMinorAxis * Math.sin(angle);

      // 기울기 적용 (Y축 회전 - Planet과 동일한 방식)
      const x =
        baseX * Math.cos(inclinationRad) - baseZ * Math.sin(inclinationRad);
      const z =
        baseX * Math.sin(inclinationRad) + baseZ * Math.cos(inclinationRad);

      // 이심률에 따른 Y축 높이 조정 추가
      const yOffset = eccentricity * semiMajorAxis * Math.sin(angle);
      const y =
        orbitRadius * Math.sin(inclinationRad) * Math.sin(angle) + yOffset;

      curvePoints.push(new THREE.Vector3(x, y, z));
    }

    return curvePoints;
  }, [orbitRadius, inclination, eccentricity, defaultSegments]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <lineLoop geometry={geometry}>
      <lineBasicMaterial color="white" />
    </lineLoop>
  );
}
