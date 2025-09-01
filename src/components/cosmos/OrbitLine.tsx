import { useMemo } from 'react';
import * as THREE from 'three';

interface OrbitLineProps {
  orbitRadius: number;
  inclination: number;
}

export default function OrbitLine({
  orbitRadius,
  inclination,
}: OrbitLineProps) {
  const defaultSegments = 128;

  const points = useMemo(() => {
    const inclinationRad = (inclination * Math.PI) / 180;
    const curvePoints = [];

    for (let i = 0; i <= defaultSegments; i++) {
      const angle = (i / defaultSegments) * 2 * Math.PI;

      // 기본 원형 궤도 좌표 (Planet과 동일한 방식)
      const baseX = orbitRadius * Math.cos(angle);
      const baseZ = orbitRadius * Math.sin(angle);

      // 기울기 적용 (Y축 회전 - Planet과 동일한 방식)
      const x =
        baseX * Math.cos(inclinationRad) - baseZ * Math.sin(inclinationRad);
      const z =
        baseX * Math.sin(inclinationRad) + baseZ * Math.cos(inclinationRad);
      const y = orbitRadius * Math.sin(inclinationRad) * Math.sin(angle);

      curvePoints.push(new THREE.Vector3(x, y, z));
    }

    return curvePoints;
  }, [orbitRadius, inclination, defaultSegments]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <lineLoop geometry={geometry}>
      <lineBasicMaterial color="white" />
    </lineLoop>
  );
}
