import type { StellarSystem } from '@/types/stellar';
import type { CreateStellarPayload } from '@/types/stellar';

// 변환 함수 (스토어 → API 포맷)
export function toCreateStellarPayload(
  system: StellarSystem
): CreateStellarPayload {
  const sp = system.star.properties; // 핵심: star.properties에서 꺼내야 함

  return {
    title: system.title,
    galaxy_id: system.galaxy_id,
    star: {
      spin: sp.spin ?? 50,
      brightness: sp.brightness ?? 50,
      color: sp.color ?? 0,
      size: sp.size ?? 50,
    },
    planets: (system.planets ?? []).map((p) => {
      const pr = p.properties;
      return {
        name: p.name,
        role: p.role,
        properties: {
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
        },
      };
    }),
  };
}
