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
  // audioTargets는 이 속성이 어떤 오디오 파라미터(target name)에 연결되는지
  // 선언적으로만 기술합니다. 실제 값 변환(예: non-linear curve, 단위 환산)은
  // `src/audio/*` 쪽에서 처리해야 합니다. 여기서는 target 이름과 선택적 가중치만
  // 제공하여 다른 팀의 타입 변경 영향을 최소화합니다.
  audioTargets?: Array<{
    name: string;
    // 가중치(선택적) - 기본값 1.0
    weight?: number;
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
  label: 'Planet Size',
    description: '행성의 크기 (반지름)',
    category: 'visual',
    min: 0.01,
    max: 1.0,
    step: 0.01,
    defaultValue: 0.5,
    controlType: 'slider',
    precision: 2,
    // audioTargets는 선언적 매핑만 보유합니다. 실제 변환은 audio 레이어에서 수행됩니다.
    audioTargets: [
      { name: 'pitchSemitones', weight: 0.7 },
      { name: 'rangeWidth', weight: 1.0 },
    ],
  },

  planetColor: {
    key: 'planetColor',
  label: 'Planet Color',
    description: '행성의 색상 (색조)',
    category: 'visual',
    min: 0,
    max: 360,
    step: 1,
    defaultValue: 180,
    controlType: 'slider',
    audioTargets: [
      { name: 'toneTint', weight: 1.0 },
      { name: 'wavefoldAmount', weight: 1.0 },
      { name: 'detune', weight: 0.5 },
    ],
    constraints: {
      BASS: { max: 0.6 },
      DRUM: { scale: 0.3 },
    },
  },

  planetBrightness: {
    key: 'planetBrightness',
  label: 'Planet Brightness',
    description: '행성의 밝기/자체발광',
    category: 'visual',
    min: 0.3,
    max: 5.0,
    step: 0.1,
    defaultValue: 2.65,
    controlType: 'slider',
    precision: 1,
    audioTargets: [
      { name: 'filterCutoff', weight: 1.0 },
      { name: 'filterResonance', weight: 1.0 },
      { name: 'outputGain', weight: 1.0 },
    ],
    constraints: {
      BASS: { max: 8000 },
      PAD: { min: 300 },
    },
  },

  distanceFromStar: {
    key: 'distanceFromStar',
  label: 'Distance from Star',
    description: '중앙별에서의 거리',
    category: 'orbit',
    min: 1.0,
    max: 60.0,
    step: 0.1,
    defaultValue: 10.5,
    controlType: 'slider',
    precision: 1,
    audioTargets: [
      { name: 'reverbSend', weight: 1.0 },
      { name: 'delayFeedback', weight: 1.0 },
      { name: 'spatialWidth', weight: 1.0 },
    ],
  },

  orbitSpeed: {
    key: 'orbitSpeed',
  label: 'Orbit Speed',
    description: '궤도 운동 속도',
    category: 'orbit',
    min: 0.01,
    max: 1.0,
    step: 0.01,
    defaultValue: 0.5,
    controlType: 'slider',
    precision: 2,
    audioTargets: [
      { name: 'rate', weight: 1.0 },
      { name: 'pulses', weight: 1.0 },
    ],
  },

  rotationSpeed: {
    key: 'rotationSpeed',
  label: 'Rotation Speed',
    description: '자전 운동 속도',
    category: 'orbit',
    min: 0.01,
    max: 1.0,
    step: 0.01,
    defaultValue: 0.5,
    controlType: 'slider',
    precision: 2,
    audioTargets: [
      { name: 'tremHz', weight: 1.0 },
      { name: 'tremDepth', weight: 1.0 },
      { name: 'vibratoRate', weight: 0.8 },
    ],
  },

  inclination: {
    key: 'inclination',
  label: 'Inclination',
    description: '궤도면의 기울기',
    category: 'orbit',
    min: 1,
    max: 90,
    step: 1,
    defaultValue: 0,
    controlType: 'slider',
    audioTargets: [{ name: 'pitchOffset', weight: 0.5 }],
  },

  eccentricity: {
    key: 'eccentricity',
  label: 'Eccentricity',
    description: '궤도의 찌그러짐 정도',
    category: 'orbit',
    min: 0.0,
    max: 0.9,
    step: 0.01,
    defaultValue: 0.45,
    controlType: 'slider',
    precision: 2,
    audioTargets: [
      { name: 'swingPct', weight: 1.0 },
      { name: 'accentDb', weight: 1.0 },
      { name: 'timing', weight: 0.8 },
    ],
  },

  tilt: {
    key: 'tilt',
  label: 'Axial Tilt',
    description: '자전축의 기울기',
    category: 'orbit',
    min: 0.0,
    max: 180.0,
    step: 1.0,
    defaultValue: 90.0,
    controlType: 'slider',
    audioTargets: [
      { name: 'pan', weight: 1.0 },
      { name: 'stereoWidth', weight: 1.0 },
      { name: 'binaural', weight: 0.5 },
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
  // 항상 0~1로 clamp
  const normalized = (value - def.min) / (def.max - def.min);
  return clamp(normalized, 0, 1);
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
      // audioTargets는 이제 선언적입니다. 실제 변환(transform)은 audio 레이어에서 수행됩니다.
      const weight = target.weight ?? 1.0;
      // 기본 매핑: 정규화된 값에 가중치만 곱하여 전달합니다.
      let mappedValue = normalizedValue * weight;

      // 역할별 제약 적용 (타입 안전하게 처리)
      if (def.constraints?.[role]) {
        const constraint = def.constraints[role]!;
        if (constraint.disabled) return;
        if (constraint.min !== undefined) mappedValue = Math.max(constraint.min, mappedValue);
        if (constraint.max !== undefined) mappedValue = Math.min(constraint.max, mappedValue);
        if (constraint.scale !== undefined) mappedValue *= constraint.scale;
      }

      result[target.name] = mappedValue;
    });
  });

  return result;
}
