// src/types/stellarWrite.ts
import type { StellarSystem, InstrumentRole } from '@/types/stellar';
import type { StarProperties } from '@/types/starProperties';

// ⭐ 스텔라 스토어 -> 스텔라 백엔드 페이로드 변경해서 보냄
export type StellarWritePayload = {
  title: string;
  galaxy_id: string;
  // position: [number, number, number];
  star: {
    name: string;
    properties: StarProperties; // 스토어 값 그대로
  };
  planets: Array<{
    name: string;
    role: InstrumentRole;
    // 스토어에는 music 데이터는 빼고, 변경해서 보내야 함
    properties: {
      planetSize: number;
      planetColor: number;
      planetBrightness: number;
      distanceFromStar: number;
      orbitSpeed: number;
      rotationSpeed: number;
      inclination: number;
      eccentricity: number;
      tilt: number;
    };
  }>;
};

// 패스스루 매퍼 (필요한 최솟값만)
export function toStellarWritePayload(
  system: StellarSystem
): StellarWritePayload {
  return {
    title: system.title,
    galaxy_id: system.galaxy_id,
    // position: system.position,
    star: {
      name: system.star.name,
      properties: system.star.properties, // 그대로
    },
    planets: (system.planets ?? []).map((p) => ({
      name: p.name,
      role: p.role,
      properties: {
        planetSize: p.properties.planetSize ?? 0.5,
        planetColor: p.properties.planetColor ?? 180,
        planetBrightness: p.properties.planetBrightness ?? 2.65,
        distanceFromStar: p.properties.distanceFromStar ?? 10.5,
        orbitSpeed: p.properties.orbitSpeed ?? 0.5,
        rotationSpeed: p.properties.rotationSpeed ?? 0.5,
        inclination: p.properties.inclination ?? 0.0,
        eccentricity: p.properties.eccentricity ?? 0.45,
        tilt: p.properties.tilt ?? 90.0,
      },
    })),
  };
}
