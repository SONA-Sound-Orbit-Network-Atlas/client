// SONA 항성(Star) 속성 정의
// 전역 음악 제어를 담당하는 항성의 속성들

import type { PropertyDefinition, PropertyCategory } from './planetProperties';

// 항성 전용 속성 (전역 제어)
export interface StarProperties {
  name: string;
  // SONA 지침: 항성 → 전역 음악 제어 (MVP)
  spin: number; // 0-100 → BPM (60-180)
  brightness: number; // 0-100 → Master Tone Character
  color: number; // 0-360 → Key/Scale
  size: number; // 0-100 → Complexity (1-3)
}

// 항성 속성 설정 (전역 제어용)
export const STAR_PROPERTIES: Record<string, PropertyDefinition> = {
  spin: {
    key: 'spin',
    label: '항성 자전',
    description: '항성의 자전 속도 (전체 BPM 결정)',
    category: 'pattern',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
    controlType: 'slider',
    audioTargets: [
      { name: 'bpm', weight: 1.0, transform: (n) => 60 + n * 120 }, // 60-180 BPM
    ],
  },

  brightness: {
    key: 'brightness',
    label: '항성 밝기',
    description:
      '항성의 밝기 (전체 음색 특성 결정 - 어두우면 따뜻하고 부드러운 톤, 밝으면 선명하고 날카로운 톤)',
    category: 'audio',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 75,
    controlType: 'slider',
    audioTargets: [
      { name: 'toneCharacter', weight: 1.0, transform: (n) => n }, // 0-100 Tone Character
    ],
  },

  color: {
    key: 'color',
    label: '항성 색상',
    description: '항성의 색상 (Key/Scale 결정)',
    category: 'pitch',
    min: 0,
    max: 360,
    step: 1,
    defaultValue: 60,
    controlType: 'slider',
    audioTargets: [
      { name: 'key', weight: 1.0, transform: (n) => Math.floor(n / 30) }, // 0-11 (12 keys)
      {
        name: 'scale',
        weight: 1.0,
        transform: (n) => Math.floor((n % 60) / 8.57),
      }, // 0-6 (7 scales)
    ],
  },

  size: {
    key: 'size',
    label: '항성 크기',
    description: '항성의 크기 (패턴 복잡도 결정)',
    category: 'pattern',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
    controlType: 'slider',
    audioTargets: [
      {
        name: 'complexity',
        weight: 1.0,
        transform: (n) => Math.floor(n / 33.33) + 1,
      }, // 1-3 Complexity
    ],
  },
};

// === 유틸리티 함수들 ===

// 기본 항성 속성 생성
export function createDefaultStarProperties(
  overrides: Partial<StarProperties> = {}
): StarProperties {
  const defaults: Partial<StarProperties> = {};

  Object.values(STAR_PROPERTIES).forEach((def) => {
    (defaults as Record<string, number>)[def.key] = def.defaultValue;
  });

  return {
    name: 'Star',
    spin: 50,
    brightness: 75,
    color: 60,
    size: 50,
    ...defaults,
    ...overrides,
  };
}

// 항성 속성 정규화
export function normalizeStarProperty(key: string, value: number): number {
  const def = STAR_PROPERTIES[key];
  if (!def) return 0.5;
  return Math.max(0, Math.min(1, (value - def.min) / (def.max - def.min)));
}

// 카테고리별 항성 속성 필터링
export function getStarPropertiesByCategory(
  category: PropertyCategory
): PropertyDefinition[] {
  return Object.values(STAR_PROPERTIES).filter(
    (def) => def.category === category
  );
}

// 항성 속성을 오디오 매핑으로 변환
export function mapStarPropertiesToAudio(
  properties: StarProperties
): Record<string, number> {
  const result: Record<string, number> = {};

  Object.entries(properties).forEach(([key, value]) => {
    const def = STAR_PROPERTIES[key];
    if (!def?.audioTargets) return;

    const normalizedValue = normalizeStarProperty(
      key,
      value || def.defaultValue
    );

    def.audioTargets.forEach((target) => {
      const mappedValue = target.transform
        ? target.transform(normalizedValue)
        : normalizedValue;

      result[target.name] = mappedValue * target.weight;
    });
  });

  return result;
}

// UI용 항성 속성 변환
export interface UIStarProperty {
  key: string;
  value: number;
  definition: PropertyDefinition;
}

export function starPropertiesToUI(
  properties: StarProperties
): UIStarProperty[] {
  return Object.entries(properties)
    .filter(([key]) => STAR_PROPERTIES[key])
    .map(([key, value]) => ({
      key,
      value: value || STAR_PROPERTIES[key].defaultValue,
      definition: STAR_PROPERTIES[key],
    }));
}
