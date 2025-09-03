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
  // 2. 타원 궤도 계산 (이심률 적용)
  const semiMajorAxis = distanceFromStar;
  const semiMinorAxis =
    distanceFromStar * Math.sqrt(1 - eccentricity * eccentricity);

  // 타원 궤도 좌표 (semiMinorAxis 사용)
  const baseX = semiMajorAxis * Math.cos(angle);
  const baseZ = semiMinorAxis * Math.sin(angle);

  // 이심률에 따른 Y축 높이 조정 (타원 궤도면의 기울기)
  const yOffset = eccentricity * semiMajorAxis * Math.sin(angle);

  // 3. 기울기 적용 (Y축 회전)
  const inclinationRad = (inclination * Math.PI) / 180;
  const x = baseX * Math.cos(inclinationRad) - baseZ * Math.sin(inclinationRad);
  const z = baseX * Math.sin(inclinationRad) + baseZ * Math.cos(inclinationRad);
  const y =
    distanceFromStar * Math.sin(inclinationRad) * Math.sin(angle) + yOffset;

  return { x, y, z };
}
