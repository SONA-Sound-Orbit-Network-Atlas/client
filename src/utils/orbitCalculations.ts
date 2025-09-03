/**
 * 타원 궤도 계산
 * @param distanceFromStar 항성과의 거리
 * @param inclination 기울기
 * @param eccentricity 이심률
 * @param angle 공전 각도
 * @returns 타원 궤도 좌표
 */

export function calculateOrbitPosition(
  distanceFromStar: number,
  inclination: number,
  eccentricity: number,
  angle: number
) {
  // 타원 궤도 계산 (X-Z 평면에서만)
  const semiMajorAxis = distanceFromStar;
  const semiMinorAxis =
    distanceFromStar * Math.sqrt(1 - eccentricity * eccentricity);

  // 타원 궤도 좌표 (X-Z 평면)
  const baseX = semiMajorAxis * Math.cos(angle);
  const baseZ = semiMinorAxis * Math.sin(angle);

  // 기울기만 Y축에 적용 (이심률은 X-Z 평면에서만)
  const inclinationRad = (inclination * Math.PI) / 180;
  const x = baseX * Math.cos(inclinationRad) - baseZ * Math.sin(inclinationRad);
  const z = baseX * Math.sin(inclinationRad) + baseZ * Math.cos(inclinationRad);
  const y = distanceFromStar * Math.sin(inclinationRad) * Math.sin(angle);
  // yOffset 제거 - 이심률은 X-Z 평면에서만 작동

  return { x, y, z };
}
