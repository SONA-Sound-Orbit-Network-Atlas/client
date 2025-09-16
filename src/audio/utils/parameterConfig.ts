// 파라미터 변경에 강건한 설정 기반 매핑 시스템
// 새로운 파라미터가 추가되거나 범위가 변경되어도 설정만 수정하면 됩니다.

// 유틸리티 함수들
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function mapLin(n: number, a: number, b: number): number {
  return a + (b - a) * n;
}

export function mapExp(n: number, a: number, b: number, k: number = 2.0): number {
  const clamped = clamp(n, 0, 1);
  return a * Math.pow(b / a, Math.pow(clamped, k));
}

export function curve(n: number, type: 'exp' | 'log' | 'sigmoid'): number {
  const clamped = clamp(n, 0, 1);
  switch (type) {
    case 'exp': return Math.pow(clamped, 2);
    case 'log': return Math.sqrt(clamped);
    case 'sigmoid': return 1 / (1 + Math.exp(-6 * (clamped - 0.5)));
    default: return clamped;
  }
}

export interface ParameterConfig {
  min: number;
  max: number;
  step?: number;
  defaultValue?: number;
  normalize?: (value: number) => number; // 커스텀 정규화 함수
  label?: string;
  description?: string;
  category?: 'sound' | 'pattern' | 'pitch';
}

export interface ParameterMapping {
  source: string; // 소스 파라미터 이름
  targets: Array<{
    name: string; // 타겟 파라미터 이름
    weight: number; // 0-1 가중치
    transform?: (normalizedValue: number) => number; // 변환 함수
  }>;
  constraints?: {
    [role in import('../../types/audio').InstrumentRole]?: {
      min?: number;
      max?: number;
      scale?: number;
    };
  };
}

// 파라미터 설정 (쉽게 수정 가능)
export const PARAMETER_CONFIG: Record<string, ParameterConfig> = {
  // 기존 확정 파라미터들
  planetSize: {
    min: 0.01,
    max: 1.00,
    step: 0.01,
    defaultValue: 0.5,
    label: 'Planet Size',
    category: 'pitch'
  },
  
  planetColor: {
    min: 0,
    max: 360,
    step: 1,
    defaultValue: 180,
    label: 'Planet Color (Hue)',
    category: 'sound'
  },
  
  planetBrightness: {
    min: 0.3,
    max: 5.0,
    step: 0.1,
    defaultValue: 2.65,
    label: 'Planet Brightness',
    category: 'sound'
  },
  
  distanceFromStar: {
    min: 1.0,
    max: 20.0,
    step: 0.1,
    defaultValue: 10.5,
    label: 'Distance From Star',
    category: 'sound'
  },
  
  orbitSpeed: {
    min: 0.01,
    max: 1.0,
    step: 0.01,
    defaultValue: 0.5,
    label: 'Orbit Speed',
    category: 'pattern'
  },
  
  rotationSpeed: {
    min: 0.01,
    max: 1.0,
    step: 0.01,
    defaultValue: 0.5,
    label: 'Rotation Speed',
    category: 'sound'
  },
  
  // 새로운 음색 제어 파라미터
  oscillatorType: {
    min: 0,
    max: 7,
    step: 1,
    defaultValue: 0,
    label: 'Oscillator Type',
    category: 'sound'
  },
  
  // 새로운 필터/이펙트 파라미터
  filterResonance: {
    min: 0.1,
    max: 30.0,
    step: 0.1,
    defaultValue: 1.0,
    label: 'Filter Resonance',
    category: 'sound'
  },
  
  // 새로운 공간감 파라미터
  spatialDepth: {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
    label: 'Spatial Depth',
    category: 'sound'
  },
  
  // 새로운 패턴 복잡도 파라미터
  patternComplexity: {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
    label: 'Pattern Complexity',
    category: 'pattern'
  },
  
  // 새로운 멜로딕 변화 파라미터
  melodicVariation: {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
    label: 'Melodic Variation',
    category: 'pitch'
  },
  
  // 새로운 리듬 밀도 파라미터
  rhythmDensity: {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
    label: 'Rhythm Density',
    category: 'pattern'
  },
  
  inclination: {
    min: -180,
    max: 180,
    step: 1,
    defaultValue: 0,
    label: 'Inclination',
    category: 'pitch'
  },
  
  eccentricity: {
    min: 0.0,
    max: 0.9,
    step: 0.01,
    defaultValue: 0.45,
    label: 'Eccentricity',
    category: 'pattern'
  },
  
  tilt: {
    min: 0.0,
    max: 180.0,
    step: 1.0,
    defaultValue: 90.0,
    label: 'Tilt',
    category: 'sound'
  },
  
  // 새로운 파라미터도 쉽게 추가 가능
  // magneticField: {
  //   min: 0.0,
  //   max: 100.0,
  //   step: 0.1,
  //   defaultValue: 50.0,
  //   label: 'Magnetic Field',
  //   category: 'sound'
  // }
};

// 매핑 설정 (파라미터와 오디오 파라미터 간의 관계) - 대폭 개선
export const MAPPING_CONFIG: ParameterMapping[] = [
  // 🎛️ 오실레이터 타입 (새로운 극적 변화)
  {
    source: 'oscillatorType',
    targets: [
      { name: 'oscType', weight: 1.0, transform: (n) => Math.floor(n * 8) }, // 0-7 타입
      { name: 'wavetableIndex', weight: 1.0, transform: (n) => n },
      { name: 'harmonicity', weight: 1.0, transform: (n) => 0.5 + n * 3.5 } // FM용
    ]
  },

  // 🎨 Color → 음색 (개선된 Tri Hybrid)
  {
    source: 'planetColor',
    targets: [
      { name: 'toneTint', weight: 1.0, transform: (n) => curve(n, 'sigmoid') },
      { name: 'wavefoldAmount', weight: 1.0, transform: (n) => n * 0.8 }, // 더 극적
      { name: 'detune', weight: 0.5, transform: (n) => (n - 0.5) * 50 } // ±25센트 디튠
    ],
    constraints: {
      'BASS': { max: 0.6 }, // 베이스는 디튠 제한
      'DRUM': { scale: 0.3 } // 드럼은 음색 변화 제한
    }
  },

  // ☀️ Brightness → 필터/음량 (더 극적인 변화)
  {
    source: 'planetBrightness',
    targets: [
      { name: 'filterCutoff', weight: 1.0, transform: (n) => 150 + Math.pow(n, 2.8) * (22000 - 150) },
      { name: 'filterResonance', weight: 1.0, transform: (n) => 0.5 + Math.pow(n, 1.5) * 15 },
      { name: 'outputGain', weight: 1.0, transform: (n) => -8 + n * 8 }
    ],
    constraints: {
      'BASS': { max: 8000 }, // 베이스 필터 제한
      'PAD': { min: 300 } // 패드 최소 필터
    }
  },

  // 🌌 Distance → 공간감 (개선된 공간 효과)
  {
    source: 'distanceFromStar',
    targets: [
      { name: 'reverbSend', weight: 1.0, transform: (n) => Math.pow(n, 1.8) * 0.7 },
      { name: 'delayFeedback', weight: 1.0, transform: (n) => n * 0.6 },
      { name: 'spatialWidth', weight: 1.0, transform: (n) => 0.2 + n * 0.8 }
    ]
  },

  // 📐 SpatialDepth → 새로운 3D 공간감
  {
    source: 'spatialDepth',
    targets: [
      { name: 'delayTime', weight: 1.0, transform: (n) => 0.1 + n * 1.5 },
      { name: 'chorusDepth', weight: 1.0, transform: (n) => n * 0.8 },
      { name: 'panSpread', weight: 1.0, transform: (n) => (n - 0.5) * 1.2 } // ±0.6 팬
    ]
  },

  // 🎵 Size + MelodicVariation → 피치/멜로디 (결합 매핑)
  {
    source: 'planetSize',
    targets: [
      { name: 'pitchSemitones', weight: 0.7, transform: (n) => (n - 0.5) * 24 }, // ±12 반음
      { name: 'rangeWidth', weight: 1.0, transform: (n) => Math.round(5 + Math.pow(n, 0.8) * 20) }
    ]
  },
  {
    source: 'melodicVariation',
    targets: [
      { name: 'intervalVariation', weight: 1.0, transform: (n) => n * 0.8 },
      { name: 'scaleDeviation', weight: 0.6, transform: (n) => n * 0.3 },
      { name: 'microtonality', weight: 0.4, transform: (n) => n * 0.15 } // 미분음
    ]
  },

  // 🥁 OrbitSpeed + RhythmDensity → 리듬 패턴 (결합 매핑)
  {
    source: 'orbitSpeed',
    targets: [
      { name: 'rate', weight: 1.0, transform: (n) => 1/16 + Math.pow(n, 2) * (1 - 1/16) },
      { name: 'pulses', weight: 1.0, transform: (n) => Math.round(2 + Math.pow(n, 1.5) * 14) }
    ]
  },
  {
    source: 'rhythmDensity',
    targets: [
      { name: 'subdivision', weight: 1.0, transform: (n) => Math.floor(1 + n * 3) }, // 1-4 세분화
      { name: 'syncopation', weight: 1.0, transform: (n) => n * 0.8 },
      { name: 'ghostNotes', weight: 0.6, transform: (n) => n * 0.4 }
    ]
  },

  // 🌀 RotationSpeed + PatternComplexity → 모듈레이션 (결합 매핑)  
  {
    source: 'rotationSpeed',
    targets: [
      { name: 'tremHz', weight: 1.0, transform: (n) => 0.2 + Math.pow(n, 2) * 12 },
      { name: 'tremDepth', weight: 1.0, transform: (n) => n * 0.7 },
      { name: 'vibratoRate', weight: 0.8, transform: (n) => 2 + n * 8 }
    ]
  },
  {
    source: 'patternComplexity',
    targets: [
      { name: 'polyrhythm', weight: 1.0, transform: (n) => 1 + Math.floor(n * 3) }, // 1-4 폴리리듬
      { name: 'patternEvolution', weight: 1.0, transform: (n) => n * 0.9 },
      { name: 'crossRhythm', weight: 0.7, transform: (n) => n * 0.6 }
    ]
  },

  // 📏 Eccentricity + Tilt → 그루브/공간 (개선된 결합)
  {
    source: 'eccentricity',
    targets: [
      { name: 'swingPct', weight: 1.0, transform: (n) => n * 45 },
      { name: 'accentDb', weight: 1.0, transform: (n) => n * 6 }, // 더 극적인 액센트
      { name: 'timing', weight: 0.8, transform: (n) => (n - 0.5) * 0.1 } // ±50ms 타이밍
    ]
  },
  {
    source: 'tilt',
    targets: [
      { name: 'pan', weight: 1.0, transform: (n) => (n - 0.5) * 1.6 }, // ±0.8 팬
      { name: 'stereoWidth', weight: 1.0, transform: (n) => 0.1 + n * 1.4 },
      { name: 'binaural', weight: 0.5, transform: (n) => n * 0.3 } // 바이노럴 효과
    ]
  }
];

// 설정 기반 정규화 함수
export function normalizeParameter(paramName: string, value: number): number {
  const config = PARAMETER_CONFIG[paramName];
  if (!config) {
    console.warn(`Unknown parameter: ${paramName}`);
    return 0.5; // 기본값
  }
  
  return Math.max(0, Math.min(1, (value - config.min) / (config.max - config.min)));
}

// 설정 기반 기본값 생성
export function getDefaultValue(paramName: string): number {
  const config = PARAMETER_CONFIG[paramName];
  if (!config) return 0.5;
  return config.defaultValue ?? (config.min + config.max) / 2;
}

// 설정 기반 속성 초기화
export function initializePropertiesFromConfig(rng: { nextFloat(): number }): Record<string, number> {
  const properties: Record<string, number> = {};
  
  for (const [paramName, config] of Object.entries(PARAMETER_CONFIG)) {
    const randomValue = config.min + rng.nextFloat() * (config.max - config.min);
    properties[paramName] = randomValue;
  }
  
  return properties;
}

// 설정 기반 매핑 적용 (mappers.ts 호환)
export function applyMappingFromConfig(
  properties: Record<string, number>, 
  role: import('../../types/audio').InstrumentRole
): Record<string, number> {
  const result: Record<string, number> = {};
  
  for (const mapping of MAPPING_CONFIG) {
    const sourceValue = properties[mapping.source];
    if (sourceValue === undefined) continue;
    
    const normalizedValue = normalizeParameter(mapping.source, sourceValue);
    
    for (const target of mapping.targets) {
      let mappedValue = target.transform ? target.transform(normalizedValue) : normalizedValue;
      mappedValue *= target.weight;
      
      // 역할별 제약 적용
      if (mapping.constraints?.[role]) {
        const constraint = mapping.constraints[role];
        if (constraint.min !== undefined) mappedValue = Math.max(constraint.min, mappedValue);
        if (constraint.max !== undefined) mappedValue = Math.min(constraint.max, mappedValue);
        if (constraint.scale !== undefined) mappedValue *= constraint.scale;
      }
      
      result[target.name] = mappedValue;
    }
  }
  
  return result;
}

// mappers.ts와 호환성을 위한 매핑 함수
export function mapPlanetToAudio(
  role: import('../../types/audio').InstrumentRole,
  props: import('../../types/audio').PlanetPhysicalProperties
): import('../../types/audio').MappedAudioParameters {
  // 새로운 속성 구조를 Record<string, number>로 변환
  const propsRecord = props as unknown as Record<string, number>;
  
  // 설정 기반 매핑 적용
  const mappedValues = applyMappingFromConfig(propsRecord, role);
  
  // MappedAudioParameters 형식으로 변환하여 반환 (정확한 매핑키 사용)
  return {
    // 새로운 오실레이터 제어
    oscType: mappedValues.oscType || 0,
    harmonicity: mappedValues.harmonicity || 1,
    
    // Color → 음색 (정확한 매핑키)
    wtIndex: mappedValues.wavetableIndex || 0.5,
    toneTint: mappedValues.toneTint || 0.5,
    waveFold: mappedValues.wavefoldAmount || 0.3,
    detune: mappedValues.detune || 0,
    
    // Brightness → 필터/음량 (정확한 매핑키)
    cutoffHz: mappedValues.filterCutoff || 2000,
    outGainDb: mappedValues.outputGain || -3,
    resonanceQ: mappedValues.filterResonance || 0.5,
    filterResonance: mappedValues.filterResonance || 1.0,
    
    // Distance → 공간감 (정확한 매핑키)
    reverbSend: mappedValues.reverbSend || 0.2,
    delayTime: mappedValues.delayTime || 0.5,
    delayFeedback: mappedValues.delayFeedback || 0.3,
    spatialWidth: mappedValues.spatialWidth || 1.0,
    
    // 새로운 3D 공간감
    panSpread: mappedValues.panSpread || 0,
    chorusDepth: mappedValues.chorusDepth || 0.3,
    binaural: mappedValues.binaural || 0,
    
    // Size + MelodicVariation → 피치/멜로디
    pitchSemitones: mappedValues.pitchSemitones || 0,
    rangeWidth: mappedValues.rangeWidth || 12,
    intervalVariation: mappedValues.intervalVariation || 0.5,
    scaleDeviation: mappedValues.scaleDeviation || 0,
    microtonality: mappedValues.microtonality || 0,
    
    // OrbitSpeed + RhythmDensity → 리듬
    rate: `${Math.max(1, Math.round((mappedValues.rate || 0.25) * 16))}n` as string,
    pulses: mappedValues.pulses || 8,
    subdivision: mappedValues.subdivision || 1,
    syncopation: mappedValues.syncopation || 0,
    ghostNotes: mappedValues.ghostNotes || 0,
    
    // RotationSpeed + PatternComplexity → 모듈레이션
    tremHz: mappedValues.tremHz || 2,
    tremDepth: mappedValues.tremDepth || 0.2,
    vibratoRate: mappedValues.vibratoRate || 5,
    polyrhythm: mappedValues.polyrhythm || 1,
    patternEvolution: mappedValues.patternEvolution || 0,
    crossRhythm: mappedValues.crossRhythm || 0,
    
    // Eccentricity + Tilt → 그루브/공간
    swingPct: mappedValues.swingPct || 0,
    accentDb: mappedValues.accentDb || 1,
    timing: mappedValues.timing || 0,
    pan: mappedValues.pan || 0,
    stereoWidth: mappedValues.stereoWidth || 1.0,
    
    // 기존 호환성 유지
    reverbSize: mappedValues.reverbSize || 0.5,
    msBlend: mappedValues.msBlend || 0.5
  };
}

// UI 슬라이더용 설정 추출
export function getSliderConfig(paramName: string) {
  const config = PARAMETER_CONFIG[paramName];
  if (!config) return null;
  
  return {
    min: config.min,
    max: config.max,
    step: config.step || 0.01,
    defaultValue: config.defaultValue || (config.min + config.max) / 2,
    label: config.label || paramName,
    category: config.category || 'sound'
  };
}
