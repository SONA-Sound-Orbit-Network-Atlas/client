// src/utils/randomProperties.ts
import { STAR_PROPERTIES, type StarProperties } from '@/types/starProperties';
import {
  PLANET_PROPERTIES,
  type PlanetProperties,
} from '@/types/planetProperties';

// 공통: step/precision 반영 난수
export function randStep(
  min: number,
  max: number,
  step = 1,
  precision?: number
) {
  const steps = Math.floor((max - min) / step);
  const k = Math.floor(Math.random() * (steps + 1));
  const v = min + k * step;
  return precision != null ? +v.toFixed(precision) : v;
}

/* =========================
   STAR: 스키마 기반
   ========================= */
export function createRandomStarProperties(): StarProperties {
  const out = {} as StarProperties;

  (
    Object.entries(STAR_PROPERTIES) as [
      keyof StarProperties,
      { min: number; max: number; step?: number }, // precision 없으면 생략
    ][]
  ).forEach(([key, def]) => {
    (out as any)[key] = randStep(def.min, def.max, def.step ?? 1); // eslint-disable-line
  });

  return out;
}

/* =========================
   PLANET: 스키마 기반
   ========================= */
export function createRandomPlanetProperties(opts?: {
  clampInclination?: boolean;
}): PlanetProperties {
  const { clampInclination = true } = opts ?? {};
  const out = {} as PlanetProperties;

  (
    Object.entries(PLANET_PROPERTIES) as [
      keyof PlanetProperties,
      { min: number; max: number; step?: number; precision?: number },
    ][]
  ).forEach(([key, def]) => {
    const min =
      clampInclination && key === 'inclination'
        ? Math.max(def.min, -90)
        : def.min;
    const max =
      clampInclination && key === 'inclination'
        ? Math.min(def.max, 90)
        : def.max;

    (out as any)[key] = randStep(min, max, def.step ?? 1, def.precision); // eslint-disable-line
  });

  return out;
}
