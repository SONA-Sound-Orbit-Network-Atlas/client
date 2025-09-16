// stellar의 properties를 씬 오브젝트에 적용하기 위해 정규화하는 함수

import type { StarProperties } from '@/types/starProperties';
import { valueToColor } from '../valueToColor';

interface NormalizedStarProperties {
  spin: number;
  brightness: number;
  color: string;
  size: number;
}

export function normalizeStarProperties(
  properties: StarProperties
): NormalizedStarProperties {
  const normalizedProperties: NormalizedStarProperties = {
    ...properties,
    spin: normalizeSpinForStar(properties.spin),
    brightness: normalizeBrightnessForStar(properties.brightness),
    color: normalizeColorForStar(properties.color),
    size: normalizeSizeForStar(properties.size),
  };
  return normalizedProperties;
}

const normalizeSpinForStar = (spin: number): number => {
  return Math.max(0, Math.min(1, (spin - 0) / (100 - 0)));
};
export const normalizeBrightnessForStar = (brightness: number): number => {
  // 0~100 입력값을 0.3~5.0 범위로 정규화 (양 극값은 도달하기 힘들도록)
  const normalized = Math.max(0, Math.min(1, (brightness - 0) / (100 - 0)));
  // S-curve 함수를 사용하여 양 극값에 도달하기 어렵게 만듦
  const sCurve = (t: number) => t * t * (3 - 2 * t); // smoothstep 함수
  const eased = sCurve(normalized);
  // 0.3~5.0 범위로 매핑
  return 0.3 + eased * (5.0 - 0.3);
};

export const normalizeSizeForStar = (size: number): number => {
  // 0~100 입력값을 0.1~3.0 범위로 균등하게 정규화
  const normalized = Math.max(0, Math.min(1, (size - 0) / (100 - 0)));
  // 0.1~3.0 범위로 균등하게 매핑
  return 0.1 + normalized * (3.0 - 0.1);
};

export const normalizeColorForStar = (color: number): string => {
  return valueToColor(color, 0, 360);
};
