// src/types/stellarWrite.ts
import type { StellarSystem, InstrumentRole } from '@/types/stellar';
import type { StarProperties } from '@/types/starProperties';
import type { PlanetProperties } from '@/types/planetProperties';

export type StellarWritePayload = {
  title: string;
  galaxy_id: string;
  position: [number, number, number];
  star: {
    name: string;
    spin: number;
    brightness: number;
    color: number;
    size: number;
  };
  planets: Array<{
    name: string;
    role: InstrumentRole;
    properties: {
      size: number;
      color: number;
      brightness: number;
      distance: number;
      speed: number;
      tilt: number;
      spin: number;
      eccentricity: number;
      elevation: number;
      phase: number;
    };
  }>;
};

// 필요시 값만 간단 기본값으로 채워서 number 보장
const mapStarProps = (sp: StarProperties) => ({
  name: sp.name ?? 'Star',
  spin: sp.spin ?? 50,
  brightness: sp.brightness ?? 50,
  color: sp.color ?? 0,
  size: sp.size ?? 50,
});

const mapPlanetProps = (pr: PlanetProperties) => ({
  size: pr.size ?? 50,
  color: pr.color ?? 0,
  brightness: pr.brightness ?? 50,
  distance: pr.distance ?? 0,
  speed: pr.speed ?? 0,
  tilt: pr.tilt ?? 0,
  spin: pr.spin ?? 0,
  eccentricity: pr.eccentricity ?? 0,
  elevation: pr.elevation ?? 0,
  phase: pr.phase ?? 0,
});

// 조회 타입 -> 공용 쓰기 페이로드
export function toStellarWritePayload(
  system: StellarSystem
): StellarWritePayload {
  return {
    title: system.title,
    galaxy_id: system.galaxy_id,
    position: system.position,
    star: mapStarProps(system.star.properties),
    planets: (system.planets ?? []).map((p) => ({
      name: p.name,
      role: p.role,
      properties: mapPlanetProps(p.properties),
    })),
  };
}
