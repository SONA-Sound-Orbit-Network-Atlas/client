// src/utils/randomProperties.ts
import type { StarProperties } from '@/types/starProperties';
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

// Star용 정의(원하시면 별도 상수로 외부 분리 가능)
const STAR_DEFS: Record<
  keyof StarProperties,
  { min: number; max: number; step?: number; precision?: number }
> = {
  spin: { min: 0, max: 100, step: 1 },
  brightness: { min: 0, max: 100, step: 1 },
  color: { min: 0, max: 360, step: 1 },
  size: { min: 0.1, max: 2.0, step: 0.1, precision: 1 }, // 예: 소수1자리
};

export function createRandomStarProperties(): StarProperties {
  return {
    spin: randStep(
      STAR_DEFS.spin.min,
      STAR_DEFS.spin.max,
      STAR_DEFS.spin.step,
      STAR_DEFS.spin.precision
    ),
    brightness: randStep(
      STAR_DEFS.brightness.min,
      STAR_DEFS.brightness.max,
      STAR_DEFS.brightness.step,
      STAR_DEFS.brightness.precision
    ),
    color: randStep(
      STAR_DEFS.color.min,
      STAR_DEFS.color.max,
      STAR_DEFS.color.step,
      STAR_DEFS.color.precision
    ),
    size: randStep(
      STAR_DEFS.size.min,
      STAR_DEFS.size.max,
      STAR_DEFS.size.step,
      STAR_DEFS.size.precision
    ),
  };
}

// Planet용: PLANET_PROPERTIES 기반으로 전 필드 생성
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
