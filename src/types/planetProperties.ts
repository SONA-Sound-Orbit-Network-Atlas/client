// SONA 속성 통합 정의 (Single Source of Truth)
// 항성(Star)과 행성(Planet)을 명확히 분리하여 관리

export type PropertyCategory =
  | 'visual'
  | 'orbit'
  | 'audio'
  | 'pattern'
  | 'pitch';
export type ControlType = 'slider' | 'color' | 'select' | 'toggle';

// 악기 역할 (행성 전용)
export type InstrumentRole =
  | 'DRUM'
  | 'BASS'
  | 'CHORD'
  | 'MELODY'
  | 'ARPEGGIO'
  | 'PAD';

// 각 속성의 완전한 설정 정보
//
// audioTargets 주석:
//   audioTargets는 "이 속성이 오디오 엔진의 어떤 파라미터에 매핑되는지"를 선언적으로 명시하는 용도입니다.
//   실제 오디오 파라미터 적용(값 변환, Tone.js 등)은 audio 시스템 코드에서 처리합니다.
//   즉, audioTargets는 구조와 의도를 문서화하는 선언적 정보이며, 데이터/오디오 처리 로직은 포함하지 않습니다.
//
export interface PropertyDefinition {
  // 기본 정보
  key: string;
  label: string;
  description: string;
  category: PropertyCategory;

  // 값 범위와 타입
  min: number;
  max: number;
  step: number;
  defaultValue: number;

  // UI 컨트롤
  controlType: ControlType;
  precision?: number; // 소수점 자릿수

  // 오디오 매핑 정보
  audioTargets?: Array<{
    name: string;
    weight: number;
    transform?: (normalizedValue: number) => number;
  }>;

  // 역할별 제약사항
  constraints?: {
    [role in InstrumentRole]?: {
      min?: number;
      max?: number;
      scale?: number;
      disabled?: boolean;
    };
  };

  // 정규화 함수 (선택적)
  normalize?: (value: number) => number;
}

// 악기 역할 (오디오 시스템과 통일)
// export type InstrumentRole = 'DRUM' | 'BASS' | 'CHORD' | 'MELODY' | 'ARPEGGIO' | 'PAD';

// 유틸리티 함수들 (오디오 시스템과 공유)
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function mapLin(n: number, a: number, b: number): number {
  return a + (b - a) * n;
}

export function mapExp(
  n: number,
  a: number,
  b: number,
  k: number = 2.0
): number {
  const clamped = clamp(n, 0, 1);
  return a * Math.pow(b / a, Math.pow(clamped, k));
}

export function curve(n: number, type: 'exp' | 'log' | 'sigmoid'): number {
  const clamped = clamp(n, 0, 1);
  switch (type) {
    case 'exp':
      return Math.pow(clamped, 2);
    case 'log':
      return Math.sqrt(clamped);
    case 'sigmoid':
      return 1 / (1 + Math.exp(-6 * (clamped - 0.5)));
    default:
      return clamped;
  }
}

// 모든 행성 속성의 통합 정의
export const PLANET_PROPERTIES: Record<string, PropertyDefinition> = {
  // === 시각적/궤도 속성 ===
  planetSize: {
    key: 'planetSize',
    label: '행성 크기',
    description: '행성의 크기 (반지름)',
    category: 'visual',
    min: 0.01,
    max: 1.0,
    step: 0.01,
    defaultValue: 0.5,
    controlType: 'slider',
    precision: 2,
    audioTargets: [
      { name: 'pitchSemitones', weight: 0.7, transform: (n) => (n - 0.5) * 24 },
      {
        name: 'rangeWidth',
        weight: 1.0,
        transform: (n) => Math.round(5 + Math.pow(n, 0.8) * 20),
      },
    ],
  },

  planetColor: {
    key: 'planetColor',
    label: '행성 색상',
    description: '행성의 색상 (색조)',
    category: 'visual',
    min: 0,
    max: 360,
    step: 1,
    defaultValue: 180,
    controlType: 'slider',
    audioTargets: [
      { name: 'toneTint', weight: 1.0, transform: (n) => curve(n, 'sigmoid') },
      { name: 'wavefoldAmount', weight: 1.0, transform: (n) => n * 0.8 },
      { name: 'detune', weight: 0.5, transform: (n) => (n - 0.5) * 50 },
    ],
    constraints: {
      BASS: { max: 0.6 },
      DRUM: { scale: 0.3 },
    },
  },

  planetBrightness: {
    key: 'planetBrightness',
    label: '행성 밝기',
    description: '행성의 밝기/자체발광',
    category: 'visual',
    min: 0.3,
    max: 5.0,
    step: 0.1,
    defaultValue: 2.65,
    controlType: 'slider',
    precision: 1,
    audioTargets: [
      {
        name: 'filterCutoff',
        weight: 1.0,
        transform: (n) => 150 + Math.pow(n, 2.8) * (22000 - 150),
      },
      {
        name: 'filterResonance',
        weight: 1.0,
        transform: (n) => 0.5 + Math.pow(n, 1.5) * 15,
      },
      { name: 'outputGain', weight: 1.0, transform: (n) => -8 + n * 8 },
    ],
    constraints: {
      BASS: { max: 8000 },
      PAD: { min: 300 },
    },
  },

  distanceFromStar: {
    key: 'distanceFromStar',
    label: '항성으로부터 거리',
    description: '중앙별에서의 거리',
    category: 'orbit',
    min: 1.0,
    max: 20.0,
    step: 0.1,
    defaultValue: 10.5,
    controlType: 'slider',
    precision: 1,
    audioTargets: [
      {
        name: 'reverbSend',
        weight: 1.0,
        transform: (n) => Math.pow(n, 1.8) * 0.7,
      },
      { name: 'delayFeedback', weight: 1.0, transform: (n) => n * 0.6 },
      { name: 'spatialWidth', weight: 1.0, transform: (n) => 0.2 + n * 0.8 },
    ],
  },

  orbitSpeed: {
    key: 'orbitSpeed',
    label: '공전 속도',
    description: '궤도 운동 속도',
    category: 'orbit',
    min: 0.01,
    max: 1.0,
    step: 0.01,
    defaultValue: 0.5,
    controlType: 'slider',
    precision: 2,
    audioTargets: [
      {
        name: 'rate',
        weight: 1.0,
        transform: (n) => 1 / 16 + Math.pow(n, 2) * (1 - 1 / 16),
      },
      {
        name: 'pulses',
        weight: 1.0,
        transform: (n) => Math.round(2 + Math.pow(n, 1.5) * 14),
      },
    ],
  },

  rotationSpeed: {
    key: 'rotationSpeed',
    label: '자전 속도',
    description: '자전 운동 속도',
    category: 'orbit',
    min: 0.01,
    max: 1.0,
    step: 0.01,
    defaultValue: 0.5,
    controlType: 'slider',
    precision: 2,
    audioTargets: [
      {
        name: 'tremHz',
        weight: 1.0,
        transform: (n) => 0.2 + Math.pow(n, 2) * 12,
      },
      { name: 'tremDepth', weight: 1.0, transform: (n) => n * 0.7 },
      { name: 'vibratoRate', weight: 0.8, transform: (n) => 2 + n * 8 },
    ],
  },

  inclination: {
    key: 'inclination',
    label: '궤도 기울기',
    description: '궤도면의 기울기',
    category: 'orbit',
    min: -180,
    max: 180,
    step: 1,
    defaultValue: 0,
    controlType: 'slider',
    audioTargets: [
      { name: 'pitchOffset', weight: 0.5, transform: (n) => (n - 0.5) * 12 },
    ],
  },

  eccentricity: {
    key: 'eccentricity',
    label: '궤도 이심률',
    description: '궤도의 찌그러짐 정도',
    category: 'orbit',
    min: 0.0,
    max: 0.9,
    step: 0.01,
    defaultValue: 0.45,
    controlType: 'slider',
    precision: 2,
    audioTargets: [
      { name: 'swingPct', weight: 1.0, transform: (n) => n * 45 },
      { name: 'accentDb', weight: 1.0, transform: (n) => n * 6 },
      { name: 'timing', weight: 0.8, transform: (n) => (n - 0.5) * 0.1 },
    ],
  },

  tilt: {
    key: 'tilt',
    label: '축 기울기',
    description: '자전축의 기울기',
    category: 'orbit',
    min: 0.0,
    max: 180.0,
    step: 1.0,
    defaultValue: 90.0,
    controlType: 'slider',
    audioTargets: [
      { name: 'pan', weight: 1.0, transform: (n) => (n - 0.5) * 1.6 },
      { name: 'stereoWidth', weight: 1.0, transform: (n) => 0.1 + n * 1.4 },
      { name: 'binaural', weight: 0.5, transform: (n) => n * 0.3 },
    ],
  },

  // === 오디오 전용 속성 ===
  oscillatorType: {
    key: 'oscillatorType',
    label: '오실레이터 타입',
    description: '기본 파형의 타입',
    category: 'audio',
    min: 0,
    max: 7,
    step: 1,
    defaultValue: 0,
    controlType: 'select',
    audioTargets: [
      { name: 'oscType', weight: 1.0, transform: (n) => Math.floor(n * 8) },
      { name: 'wavetableIndex', weight: 1.0, transform: (n) => n },
      { name: 'harmonicity', weight: 1.0, transform: (n) => 0.5 + n * 3.5 },
    ],
  },

  filterResonance: {
    key: 'filterResonance',
    label: '필터 공명',
    description: '필터의 공명 강도',
    category: 'audio',
    min: 0.1,
    max: 30.0,
    step: 0.1,
    defaultValue: 1.0,
    controlType: 'slider',
    precision: 1,
    audioTargets: [
      { name: 'filterResonance', weight: 1.0, transform: (n) => n },
    ],
  },

  spatialDepth: {
    key: 'spatialDepth',
    label: '공간 깊이',
    description: '3D 공간감의 깊이',
    category: 'audio',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
    controlType: 'slider',
    audioTargets: [
      { name: 'delayTime', weight: 1.0, transform: (n) => 0.1 + n * 1.5 },
      { name: 'chorusDepth', weight: 1.0, transform: (n) => n * 0.8 },
      { name: 'panSpread', weight: 1.0, transform: (n) => (n - 0.5) * 1.2 },
    ],
  },

  patternComplexity: {
    key: 'patternComplexity',
    label: '패턴 복잡도',
    description: '리듬 패턴의 복잡함',
    category: 'pattern',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
    controlType: 'slider',
    audioTargets: [
      {
        name: 'polyrhythm',
        weight: 1.0,
        transform: (n) => 1 + Math.floor(n * 3),
      },
      { name: 'patternEvolution', weight: 1.0, transform: (n) => n * 0.9 },
      { name: 'crossRhythm', weight: 0.7, transform: (n) => n * 0.6 },
    ],
  },

  rhythmDensity: {
    key: 'rhythmDensity',
    label: '리듬 밀도',
    description: '리듬의 조밀함',
    category: 'pattern',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
    controlType: 'slider',
    audioTargets: [
      {
        name: 'subdivision',
        weight: 1.0,
        transform: (n) => Math.floor(1 + n * 3),
      },
      { name: 'syncopation', weight: 1.0, transform: (n) => n * 0.8 },
      { name: 'ghostNotes', weight: 0.6, transform: (n) => n * 0.4 },
    ],
  },

  melodicVariation: {
    key: 'melodicVariation',
    label: '멜로디 변화',
    description: '멜로디의 변화 정도',
    category: 'pitch',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
    controlType: 'slider',
    audioTargets: [
      { name: 'intervalVariation', weight: 1.0, transform: (n) => n * 0.8 },
      { name: 'scaleDeviation', weight: 0.6, transform: (n) => n * 0.3 },
      { name: 'microtonality', weight: 0.4, transform: (n) => n * 0.15 },
    ],
  },
};

// 행성 속성 타입 (백엔드 호환)
export type PlanetProperties = {
  [K in keyof typeof PLANET_PROPERTIES]?: number;
};

// UI용 속성 정보
export interface UIProperty {
  key: string;
  value: number;
  definition: PropertyDefinition;
}

// === 유틸리티 함수들 ===

// 속성 정규화
export function normalizeProperty(key: string, value: number): number {
  const def = PLANET_PROPERTIES[key];
  if (!def) return 0.5;
  return clamp((value - def.min) / (def.max - def.min), 0, 1);
}

// 기본값 생성
export function createDefaultProperties(
  overrides: Partial<PlanetProperties> = {}
): PlanetProperties {
  const defaults: PlanetProperties = {};

  Object.values(PLANET_PROPERTIES).forEach((def) => {
    defaults[def.key as keyof PlanetProperties] = def.defaultValue;
  });

  return { ...defaults, ...overrides };
}

// 카테고리별 속성 필터링
export function getPropertiesByCategory(
  category: PropertyCategory
): PropertyDefinition[] {
  return Object.values(PLANET_PROPERTIES).filter(
    (def) => def.category === category
  );
}

// UI 속성 변환 (UI 컴포넌트용)
export function propertiesToUI(properties: PlanetProperties): UIProperty[] {
  return Object.entries(properties)
    .filter(([key]) => PLANET_PROPERTIES[key])
    .map(([key, value]) => ({
      key,
      value: value || PLANET_PROPERTIES[key].defaultValue,
      definition: PLANET_PROPERTIES[key],
    }));
}

// 오디오 매핑 적용
export function mapPropertiesToAudio(
  properties: PlanetProperties,
  role: InstrumentRole
): Record<string, number> {
  const result: Record<string, number> = {};

  Object.entries(properties).forEach(([key, value]) => {
    const def = PLANET_PROPERTIES[key];
    if (!def?.audioTargets) return;

    const normalizedValue = normalizeProperty(key, value || def.defaultValue);

    def.audioTargets.forEach((target) => {
      let mappedValue = target.transform
        ? target.transform(normalizedValue)
        : normalizedValue;
      mappedValue *= target.weight;

      // 역할별 제약 적용
      if (def.constraints?.[role]) {
        const constraint = def.constraints[role];
        if (constraint.disabled) return;
        if (constraint.min !== undefined)
          mappedValue = Math.max(constraint.min, mappedValue);
        if (constraint.max !== undefined)
          mappedValue = Math.min(constraint.max, mappedValue);
        if (constraint.scale !== undefined) mappedValue *= constraint.scale;
      }

      result[target.name] = mappedValue;
    });
  });

  return result;
}
