// 공통 인스트루먼트 인터페이스와 매핑/프리셋 정의
// 악기 별 커스텀 코드를 단일 진입점으로 통합해 유지보수성을 높입니다.

import * as Tone from 'tone';
import type { InstrumentRole, PlanetPhysicalProperties, MappedAudioParameters } from '../../types/audio';
import { PLANET_PROPERTIES } from '../../types/planetProperties';
import { mapRawPropertiesToAudioTargets } from '../utils/parameterConfig';

// === 타입 정의 ===

export type SynthTypeId =
  | 'analog-lead'
  | 'airy-keys'
  | 'deep-sub'
  | 'pluck-bass'
  | 'warm-stack'
  | 'spark-chords'
  | 'sequence'
  | 'glass-arp'
  | 'lush-pad'
  | 'shimmer-pad'
  | 'percussion-kit'
  | 'electro-hit';

export type OscillatorTypeId = Tone.ToneOscillatorType;

export interface SynthTypeDefinition {
  id: SynthTypeId;
  label: string;
  toneBias: number;   // 0..1 (밝기/음색 성향)
  motionBias: number; // 0..1 (리듬/공간 성향)
  description?: string;
  oscillatorSuggestions?: OscillatorTypeId[];
}

export interface OscillatorOption {
  id: OscillatorTypeId;
  label: string;
}

export interface InstrumentUpdateContext {
  synthType?: SynthTypeId;
  oscillatorType?: OscillatorTypeId;
}

export interface ResolvedInstrumentContext {
  synthType: SynthTypeId;
  oscillatorType: OscillatorTypeId;
}

export interface ToneMacro {
  brightness: number; // 0..1
  warmth: number;     // 0..1
  texture: number;    // 0..1
}

export interface MotionMacro {
  density: number; // 0..1
  space: number;   // 0..1
  movement: number; // 0..1
  accent: number;   // 0..1
  pan: number;      // 0..1
}

export interface MacroMeta {
  size: number;        // 0..1
  distance: number;    // 0..1
  color: number;       // 0..1
  inclination: number; // 0..1
  tilt: number;        // 0..1
}

export interface SimplifiedInstrumentMacros {
  tone: ToneMacro;
  motion: MotionMacro;
  meta: MacroMeta;
}

// === 유틸 함수 ===

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

function normalize(value: number, min: number, max: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return 0;
  }
  return clamp01((value - min) / (max - min));
}

function lerp(min: number, max: number, t: number): number {
  return min + (max - min) * t;
}

// 지수/비선형 매핑: perceptual(인식적) 스케일을 위해 사용
// k > 1 이면 더 극단적인 비선형(하위 값에 더 가중), k < 1이면 완화
export function mapExp(n: number, a: number, b: number, k: number = 1): number {
  const t = clamp01(n);
  // 안전한 0 대응: a가 0일 경우 선형로 처리
  if (a === 0) return lerp(a, b, Math.pow(t, k));
  const ratio = Math.pow(b / a, Math.pow(t, k));
  return a * ratio;
}

// 부드러운 시그모이드 형태로 0..1을 조절
export function sigmoid(n: number, steepness = 6): number {
  const x = clamp01(n) * 2 - 1; // -1..1
  return 1 / (1 + Math.exp(-steepness * x));
}

function weightedMix(base: number, target: number, amount: number): number {
  const mixed = base * (1 - amount) + target * amount;
  return clamp01(mixed);
}

function getNormalizedProperty(
  props: PlanetPhysicalProperties,
  key: keyof PlanetPhysicalProperties
): number {
  const def = PLANET_PROPERTIES[key as string];
  if (!def) return 0.5;
  const value = (props as Record<string, unknown>)[key] ?? def.defaultValue;
  const numericValue = typeof value === 'number' ? value : def.defaultValue;
  return normalize(numericValue, def.min, def.max);
}

// === 신스 프리셋 & 오실레이터 옵션 ===

const SYNTH_LIBRARY: Record<InstrumentRole, SynthTypeDefinition[]> = {
  MELODY: [
    {
      id: 'analog-lead',
      label: 'Analog Lead',
      toneBias: 0.75,
      motionBias: 0.45,
      description: 'Rich saw based lead with gentle movement',
      oscillatorSuggestions: ['sawtooth', 'triangle'],
    },
    {
      id: 'airy-keys',
      label: 'Airy Keys',
      toneBias: 0.55,
      motionBias: 0.65,
      description: 'Soft triangle based keys with wider space',
      oscillatorSuggestions: ['triangle', 'sine'],
    },
  ],
  BASS: [
    {
      id: 'deep-sub',
      label: 'Deep Sub',
      toneBias: 0.25,
      motionBias: 0.35,
      description: 'Smooth sine focused bass foundation',
      oscillatorSuggestions: ['sine', 'triangle'],
    },
    {
      id: 'pluck-bass',
      label: 'Pluck Bass',
      toneBias: 0.55,
      motionBias: 0.4,
      description: 'Tight pluck with harmonic bite',
      oscillatorSuggestions: ['square', 'sawtooth'],
    },
  ],
  CHORD: [
    {
      id: 'warm-stack',
      label: 'Warm Stack',
      toneBias: 0.5,
      motionBias: 0.55,
      description: 'Rounded chords with gentle movement',
      oscillatorSuggestions: ['sawtooth', 'triangle'],
    },
    {
      id: 'spark-chords',
      label: 'Spark Chords',
      toneBias: 0.7,
      motionBias: 0.45,
      description: 'Brighter stack for rhythmic comping',
      oscillatorSuggestions: ['square', 'sawtooth'],
    },
  ],
  PAD: [
    {
      id: 'lush-pad',
      label: 'Lush Pad',
      toneBias: 0.45,
      motionBias: 0.75,
      description: 'Wide, slowly evolving pad texture',
      oscillatorSuggestions: ['sawtooth', 'triangle'],
    },
    {
      id: 'shimmer-pad',
      label: 'Shimmer Pad',
      toneBias: 0.65,
      motionBias: 0.85,
      description: 'Airy pad with sparkling high end',
      oscillatorSuggestions: ['triangle', 'sine'],
    },
  ],
  ARPEGGIO: [
    {
      id: 'sequence',
      label: 'Sequence',
      toneBias: 0.55,
      motionBias: 0.5,
      description: 'Tight step sequence style arpeggiator',
      oscillatorSuggestions: ['square', 'sawtooth'],
    },
    {
      id: 'glass-arp',
      label: 'Glass Arp',
      toneBias: 0.6,
      motionBias: 0.6,
      description: 'Bell-ish arpeggio with airy motion',
      oscillatorSuggestions: ['triangle', 'sine'],
    },
  ],
  DRUM: [
    {
      id: 'percussion-kit',
      label: 'Percussion Kit',
      toneBias: 0.6,
      motionBias: 0.65,
      description: 'Balanced electronic kit mapping',
      oscillatorSuggestions: ['sine', 'square'],
    },
    {
      id: 'electro-hit',
      label: 'Electro Hit',
      toneBias: 0.7,
      motionBias: 0.5,
      description: 'Aggressive electronic percussion',
      oscillatorSuggestions: ['square', 'sawtooth'],
    },
  ],
};

const OSCILLATOR_OPTIONS: OscillatorOption[] = [
  { id: 'sine', label: 'Sine' },
  { id: 'triangle', label: 'Triangle' },
  { id: 'square', label: 'Square' },
  { id: 'sawtooth', label: 'Saw' },
];

export function getSynthProfilesForRole(role: InstrumentRole): SynthTypeDefinition[] {
  return SYNTH_LIBRARY[role];
}

export function getSynthProfile(role: InstrumentRole, id: SynthTypeId): SynthTypeDefinition {
  const list = SYNTH_LIBRARY[role];
  return list.find((preset) => preset.id === id) ?? list[0];
}

export function getDefaultSynthType(role: InstrumentRole): SynthTypeId {
  return SYNTH_LIBRARY[role][0].id;
}

export function getAvailableOscillatorOptions(): OscillatorOption[] {
  return OSCILLATOR_OPTIONS;
}

export function getDefaultOscillatorType(
  role: InstrumentRole,
  synthType?: SynthTypeId
): OscillatorTypeId {
  const preset = synthType
    ? getSynthProfile(role, synthType)
    : SYNTH_LIBRARY[role][0];
  return preset.oscillatorSuggestions?.[0] ?? 'sawtooth';
}

export function resolveInstrumentContext(
  role: InstrumentRole,
  context?: InstrumentUpdateContext
): ResolvedInstrumentContext {
  const synthType = context?.synthType ?? getDefaultSynthType(role);
  const oscillatorType = context?.oscillatorType ?? getDefaultOscillatorType(role, synthType);
  return { synthType, oscillatorType };
}

// === 매핑 로직 ===

function computeMacros(
  role: InstrumentRole,
  props: PlanetPhysicalProperties,
  resolved: ResolvedInstrumentContext
): SimplifiedInstrumentMacros {
  const size = getNormalizedProperty(props, 'planetSize');
  const color = getNormalizedProperty(props, 'planetColor');
  const brightness = getNormalizedProperty(props, 'planetBrightness');
  const distance = getNormalizedProperty(props, 'distanceFromStar');
  const orbitSpeed = getNormalizedProperty(props, 'orbitSpeed');
  const rotationSpeed = getNormalizedProperty(props, 'rotationSpeed');
  const inclination = getNormalizedProperty(props, 'inclination');
  const eccentricity = getNormalizedProperty(props, 'eccentricity');
  const tilt = getNormalizedProperty(props, 'tilt');

  const synthPreset = getSynthProfile(role, resolved.synthType);

  const toneBrightnessBase = clamp01(0.25 + brightness * 0.6 + color * 0.2);
  const toneWarmthBase = clamp01(0.55 - (color - 0.5) * 0.4);
  const toneTextureBase = clamp01(rotationSpeed * 0.6 + size * 0.4);

  const tone: ToneMacro = {
    brightness: weightedMix(toneBrightnessBase, synthPreset.toneBias, 0.4),
    warmth: weightedMix(toneWarmthBase, 1 - synthPreset.toneBias, 0.25),
    texture: weightedMix(toneTextureBase, synthPreset.toneBias, 0.3),
  };

  const movementBase = clamp01(eccentricity * 0.7 + rotationSpeed * 0.3);
  const densityBase = clamp01(orbitSpeed * 0.6 + size * 0.2 + eccentricity * 0.2);
  const spaceBase = clamp01(distance * 0.6 + tilt * 0.3);
  const accentBase = clamp01(eccentricity * 0.6 + (1 - size) * 0.2);

  const roleSpaceBias = role === 'PAD' ? 0.1 : role === 'CHORD' ? 0.05 : 0;

  const motion: MotionMacro = {
    density: weightedMix(densityBase, synthPreset.motionBias, 0.35),
    space: clamp01(weightedMix(spaceBase, synthPreset.motionBias + roleSpaceBias, 0.5)),
    movement: weightedMix(movementBase, synthPreset.motionBias, 0.4),
    accent: weightedMix(accentBase, synthPreset.motionBias, 0.2),
    pan: tilt,
  };

  return {
    tone,
    motion,
    meta: {
      size,
      distance,
      color,
      inclination,
      tilt,
    },
  };
}

export function macrosToAudioParameters(
  role: InstrumentRole,
  macros: SimplifiedInstrumentMacros,
  context: ResolvedInstrumentContext,
  // 선택적: raw audio target 값을 외부에서 주입할 수 있음
  rawAudioTargets?: Record<string, number>
): MappedAudioParameters {
  const { tone, motion, meta } = macros;

  // 기본 베이스 파라미터 (macros -> audio parameter 변환)
  const cutoffBase = mapExp(tone.brightness, 200, 9500, 1.25);
  const resonanceBase = lerp(0.6, 6.5, tone.texture);
  const stereoWidthBase = lerp(0.2, 1.2, motion.space);
  // reverb와 delay 피드에 대해 비선형 맵 적용 (공간감 변화가 더 가청되도록)
  const reverbSendBase = sigmoid(motion.space, 5) * (0.55 - 0.05) + 0.05;
  const delayTimeBase = lerp(0.12, 0.6, motion.space);
  const delayFeedbackBase = Math.pow(motion.space, 1.4) * (0.4 - 0.05) + 0.05;

  // 역할별 sensitivity 맵: 각 역할이 특정 파라미터에 대해 얼마나 민감하게 반응하는지 정의합니다.
  // 값은 곱셈 계수로 사용됩니다. 1.0 = 기본, >1 더 민감, <1 덜 민감
  const ROLE_SENSITIVITY: Record<InstrumentRole, Partial<Record<keyof MappedAudioParameters, number>>> = {
    DRUM: {
      outGainDb: 1.2,      // 드럼은 출력 게인을 조금 더 민감하게 반응
      reverbSend: 0.6,     // 드럼에는 리버브를 적게 보내는 편이 자연스러움
      delayFeedback: 0.5,  // 딜레이 피드백 민감도 낮춤
      cutoffHz: 0.9,       // 컷오프는 약간 둔하게
      stereoWidth: 0.85,   // 스테레오 확장성 낮춤
      pan: 1.0,            // 패닝은 기본
    },
    BASS: {
      outGainDb: 1.05,
      reverbSend: 0.5,
      cutoffHz: 0.75,
      stereoWidth: 0.4,
    },
    PAD: {
      reverbSend: 1.4,
      stereoWidth: 1.25,
      delayFeedback: 1.1,
      outGainDb: 0.95,
    },
    MELODY: {
      outGainDb: 1.0,
      reverbSend: 0.9,
      cutoffHz: 1.05,
    },
    CHORD: {
      reverbSend: 1.1,
      stereoWidth: 1.0,
      outGainDb: 0.95,
    },
    ARPEGGIO: {
      outGainDb: 1.05,
      delayFeedback: 1.15,
      stereoWidth: 0.95,
    },
  };

  const pulses = clamp(Math.round(2 + motion.density * 12), 2, 16);
  const subdivision = motion.density > 0.75 ? 3 : motion.density > 0.4 ? 2 : 1;
  const rate = motion.density > 0.66 ? '16n' : motion.density > 0.33 ? '8n' : '4n';

  // rawAudioTargets(planetTransforms 결과)가 주어지면 해당 값을 Tone.js 파라미터 기대 범위에 맞게 변환 및 clamp
  let cutoffHz = cutoffBase;
  let stereoWidth = stereoWidthBase;
  let reverbSend = reverbSendBase;
  let pan = (motion.pan - 0.5) * 1.4;
  let padOutGainDb: number | undefined = undefined;
  // 로컬 변수로 params 필드들을 미리 선언: rawAudioTargets 블록에서 params가 아직 선언되기 전에 사용되므로
  const delayFeedback = delayFeedbackBase;
  const chorusDepth = lerp(0.1, 0.5, motion.space);
  const tremDepth = lerp(0.1, 0.6, motion.movement);
  const binaural = lerp(0, 0.22, motion.space);
  const panSpread = (motion.movement - 0.5) * 0.9;
  const ghostNotes = motion.density * 0.4;
  const syncopation = motion.movement * 0.65;
  // timing은 이후 params.timing에 의해 계산되므로 로컬 변수는 제거
  const swingPct = motion.movement * 36;
  const accentDb = lerp(0.5, 5, motion.accent);


  // PAD 악기일 때만 값 덮어쓰기 (macros 기반)
  if (role === 'PAD') {
    // PAD는 모든 주요 프로퍼티가 사운드에 크게 반영되도록 비선형 맵/가중치 강화
    const padBrightness = clamp01(macros.tone.brightness);
    const padSpace = clamp01(macros.motion.space);
    const padTilt = clamp01(macros.meta.tilt ?? 0.5);
    const padInclination = clamp01(macros.meta.inclination ?? 0.5);
    const planetSizeNorm = macros.meta?.size !== undefined ? macros.meta.size : 0.5;

    // 컷오프: brightness, tilt, inclination 모두 반영 (exp 맵 계수 증가)
    const cutoffFromBrightness = mapExp(padBrightness, 400, 14000, 3.2);
    const cutoffFromTilt = mapExp(padTilt, 400, 14000, 2.2);
    const cutoffFromInclination = mapExp(padInclination, 400, 14000, 2.2);
    cutoffHz = Math.max(200, Math.min(14000, (cutoffFromBrightness * 0.6 + cutoffFromTilt * 0.2 + cutoffFromInclination * 0.2)));

    // stereoWidth: space, tilt 반영 (sigmoid 맵 계수 증가)
    const stereoFromSpace = sigmoid(padSpace, 8) * 0.95;
    const stereoFromTilt = sigmoid(padTilt, 6) * 0.7;
    stereoWidth = Math.max(0, Math.min(0.95, (stereoFromSpace * 0.7 + stereoFromTilt * 0.3)));

    // reverbSend: space, inclination 반영 (exp 맵 계수 증가)
    const reverbFromSpace = Math.pow(padSpace, 2.2) * 0.8;
    const reverbFromInclination = Math.pow(padInclination, 1.7) * 0.5;
    reverbSend = Math.max(0, Math.min(0.8, (reverbFromSpace * 0.7 + reverbFromInclination * 0.3)));

    // 볼륨: planetSizeNorm, brightness, tilt 모두 반영 (exp/sigmoid 맵 계수 증가)
    const outGainBase = lerp(-30, 0, sigmoid(padBrightness, 8));
    const outGainExp = mapExp(padBrightness, -30, 0, 2.8);
    const outGainSize = lerp(-30, 0, Math.pow(planetSizeNorm, 2.2));
    const outGainTilt = lerp(-30, 0, Math.pow(padTilt, 1.7));
    padOutGainDb = Math.max(-30, Math.min(0, (outGainBase * 0.4 + outGainExp * 0.2 + outGainSize * 0.3 + outGainTilt * 0.1)));

    // 로그로 변화 확인
    
  }

  // 역할별 sensitivity 적용 (드럼 우선)
  const sensitivity = ROLE_SENSITIVITY[role] ?? {};
  const applySens = <K extends keyof MappedAudioParameters>(key: K, value: number) => {
    const s = sensitivity[key] as number | undefined;
    return typeof s === 'number' ? value * s : value;
  };

  cutoffHz = applySens('cutoffHz', cutoffHz);
  stereoWidth = applySens('stereoWidth', stereoWidth);
  reverbSend = applySens('reverbSend', reverbSend);
  pan = applySens('pan', pan);

  if (role === 'BASS') {
    cutoffHz = clamp(cutoffHz, 80, 2500);
    stereoWidth = Math.min(stereoWidth, 0.45);
    reverbSend = Math.min(reverbSend, 0.15);
    pan = clamp(pan, -0.35, 0.35);
  } else if (role === 'DRUM') {
    stereoWidth = Math.min(stereoWidth, 0.8);
    // 드럼 전용 추가 제한: 리버브를 지나치게 키우지 않음
    reverbSend = Math.min(reverbSend, 0.22);
  } else if (role === 'PAD') {
    reverbSend = Math.max(reverbSend, 0.18);
    stereoWidth = Math.max(stereoWidth, 0.7);
  }

  const params: MappedAudioParameters = {
    oscType: context.oscillatorType,
    harmonicity: lerp(0.8, 3.2, tone.texture),
    wtIndex: tone.brightness,
    toneTint: tone.warmth,
    waveFold: lerp(0, 0.45, tone.texture),
    detune: lerp(-25, 25, tone.warmth),
  cutoffHz,
    // outGainDb은 로그/시그모이드 맵을 사용해 더 자연스럽게 변화
  outGainDb: padOutGainDb !== undefined ? padOutGainDb : lerp(-10, 0, sigmoid(tone.brightness, 6)),
    resonanceQ: resonanceBase,
    filterResonance: lerp(0.7, 7.5, tone.texture),
    reverbSend,
    delayTime: delayTimeBase,
    delayFeedback: delayFeedback,
    spatialWidth: lerp(0.25, 1.1, motion.space),
    panSpread: panSpread,
    chorusDepth: chorusDepth,
    binaural: binaural,
    pitchSemitones: lerp(-6, 6, tone.warmth),
    rangeWidth: Math.round(6 + tone.texture * 18 - meta.size * 4),
    intervalVariation: lerp(0.1, 0.8, motion.movement),
    scaleDeviation: Math.abs(0.5 - tone.warmth) * 0.25,
    microtonality: motion.accent * 0.12,
    rate,
    pulses,
    subdivision,
    syncopation: syncopation,
    ghostNotes: ghostNotes,
    tremHz: lerp(0.4, 8.5, motion.movement),
    tremDepth: tremDepth,
    vibratoRate: lerp(2.5, 8.5, tone.texture),
    polyrhythm: clamp(Math.round(1 + motion.density * 3), 1, 4),
    patternEvolution: motion.accent * 0.6,
    crossRhythm: motion.movement * 0.4,
    swingPct: swingPct,
    accentDb: accentDb,
    timing: (motion.movement - 0.5) * 0.04,
    pan,
    stereoWidth,
    reverbSize: lerp(0.3, 0.9, motion.space),
    msBlend: lerp(0.35, 0.7, motion.space),
  };

  if (role === 'PAD' || role === 'CHORD') {
    params.ghostNotes = Math.min(params.ghostNotes, 0.25);
    params.syncopation = Math.min(params.syncopation, 0.5);
  }

  if (role === 'DRUM') {
    params.rate = motion.density > 0.5 ? '16n' : '8n';
    params.intervalVariation = Math.min(params.intervalVariation, 0.4);
  }

  // === rawAudioTargets 값으로 덮어쓰기 및 clamp ===
  if (rawAudioTargets) {
    if (typeof rawAudioTargets.filterCutoff === 'number') {
      params.cutoffHz = Math.max(150, Math.min(14000, rawAudioTargets.filterCutoff));
    }
    if (typeof rawAudioTargets.stereoWidth === 'number') {
      params.stereoWidth = Math.max(0, Math.min(1.5, rawAudioTargets.stereoWidth));
    }
    if (typeof rawAudioTargets.reverbSend === 'number') {
      params.reverbSend = clamp01(rawAudioTargets.reverbSend);
    }
    if (typeof rawAudioTargets.outGainDb === 'number') {
      params.outGainDb = Math.max(-30, Math.min(0, rawAudioTargets.outGainDb));
    }
    if (typeof rawAudioTargets.pan === 'number') {
      params.pan = Math.max(-0.8, Math.min(0.8, rawAudioTargets.pan));
    }
    if (typeof rawAudioTargets.delayFeedback === 'number') {
      params.delayFeedback = clamp01(rawAudioTargets.delayFeedback);
    }
    if (typeof rawAudioTargets.chorusDepth === 'number') {
      params.chorusDepth = clamp01(rawAudioTargets.chorusDepth);
    }
    if (typeof rawAudioTargets.tremDepth === 'number') {
      params.tremDepth = clamp01(rawAudioTargets.tremDepth);
    }
    if (typeof rawAudioTargets.binaural === 'number') {
      params.binaural = clamp01(rawAudioTargets.binaural);
    }
    if (typeof rawAudioTargets.panSpread === 'number') {
      params.panSpread = Math.max(-1, Math.min(1, rawAudioTargets.panSpread));
    }
    if (typeof rawAudioTargets.ghostNotes === 'number') {
      params.ghostNotes = clamp01(rawAudioTargets.ghostNotes);
    }
    if (typeof rawAudioTargets.syncopation === 'number') {
      params.syncopation = clamp01(rawAudioTargets.syncopation);
    }
    if (typeof rawAudioTargets.timing === 'number') {
      params.timing = Math.max(-1, Math.min(1, rawAudioTargets.timing));
    }
    if (typeof rawAudioTargets.swingPct === 'number') {
      params.swingPct = clamp01(rawAudioTargets.swingPct / 100);
    }
    if (typeof rawAudioTargets.accentDb === 'number') {
      params.accentDb = clamp01(rawAudioTargets.accentDb / 6);
    }
  }

  // === 최종적으로 모든 파라미터에 대해 clamp 적용 ===
  // 0~1 범위가 요구되는 파라미터는 clamp01, dB/Hz/pan 등은 별도 처리
  // clampMap은 더 이상 사용하지 않으므로 제거
  // 각 파라미터를 명시적으로 clamp
  if (typeof params.reverbSend === 'number') {
    const original = params.reverbSend;
    params.reverbSend = Math.max(0, Math.min(0.7, original));
    
  }
  if (typeof params.delayFeedback === 'number') {
    const original = params.delayFeedback;
    params.delayFeedback = Math.max(0, Math.min(1, original));
    
  }
  if (typeof params.stereoWidth === 'number') {
    const original = params.stereoWidth;
    params.stereoWidth = Math.max(0, Math.min(0.85, original));
    
  }
  if (typeof params.cutoffHz === 'number') {
    const original = params.cutoffHz;
    params.cutoffHz = Math.max(200, Math.min(14000, original));
    
  }
  if (typeof params.pan === 'number') {
    const original = params.pan;
    params.pan = Math.max(-0.8, Math.min(0.8, original));
    
  }
  if (typeof params.outGainDb === 'number') {
    const original = params.outGainDb;
    params.outGainDb = Math.max(-30, Math.min(0, original));
    
  }
  return params;
}

export function mapPlanetToAudioParameters(
  role: InstrumentRole,
  props: PlanetPhysicalProperties,
  context?: InstrumentUpdateContext
): MappedAudioParameters {
  const resolved = resolveInstrumentContext(role, context);
  const macros = computeMacros(role, props, resolved);
  // planetTransforms에서 raw transform 결과를 가져와 macrosToAudioParameters에 전달
  // mapRawPropertiesToAudioTargets는 audio/utils/parameterConfig에서 노출됨
  // import 최소화를 위해 require로 동적 로드합니다.
  const rawTargets = mapRawPropertiesToAudioTargets(props as PlanetPhysicalProperties, role);
  return macrosToAudioParameters(role, macros, resolved, rawTargets);
}

export function mapPlanetToInstrumentMacros(
  role: InstrumentRole,
  props: PlanetPhysicalProperties,
  context?: InstrumentUpdateContext
): SimplifiedInstrumentMacros {
  const resolved = resolveInstrumentContext(role, context);
  return computeMacros(role, props, resolved);
}

export function generateInitialPlanetProperties(rng: { nextFloat(): number }): Record<string, number> {
  const props: Record<string, number> = {};
  Object.values(PLANET_PROPERTIES).forEach((def) => {
    const v = def.min + (def.max - def.min) * rng.nextFloat();
    props[def.key] = Number.isFinite(v) ? v : def.defaultValue;
  });
  return props;
}

// === 공통 베이스 클래스 ===

export interface Instrument {
  getId(): string;
  getRole(): InstrumentRole;
  triggerAttackRelease(
    notes: string | string[],
    duration: string | number,
    time?: Tone.Unit.Time,
    velocity?: number
  ): void;
  updateFromPlanet(
    props: PlanetPhysicalProperties,
    context?: InstrumentUpdateContext
  ): void;
  dispose(): void;
  isDisposed(): boolean;
}

export abstract class AbstractInstrumentBase implements Instrument {
  protected readonly role: InstrumentRole;
  protected readonly id: string;
  protected disposed: boolean;
  private lastContext: ResolvedInstrumentContext | null;

  constructor(role: InstrumentRole, id: string) {
    this.role = role;
    this.id = id;
    this.disposed = false;
    this.lastContext = null;
  }

  getId(): string {
    return this.id;
  }

  getRole(): InstrumentRole {
    return this.role;
  }

  isDisposed(): boolean {
    return this.disposed;
  }

  updateFromPlanet(
    props: PlanetPhysicalProperties,
    context?: InstrumentUpdateContext
  ): void {
    if (this.disposed) return;

    const resolved = resolveInstrumentContext(this.role, context);
    const oscillatorChanged =
      !this.lastContext ||
      this.lastContext.oscillatorType !== resolved.oscillatorType;

    if (oscillatorChanged) {
      this.applyOscillatorType(resolved.oscillatorType);
    }

    const macros = computeMacros(this.role, props, resolved);
    const params = macrosToAudioParameters(this.role, macros, resolved);
    this.handleParameterUpdate(params);
    this.lastContext = resolved;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.lastContext = null;
    
  }

  protected abstract handleParameterUpdate(
    params: MappedAudioParameters
  ): void;

  protected abstract applyOscillatorType(type: OscillatorTypeId): void;

  triggerAttackRelease(
    notes: string | string[],
    duration: string | number,
    time?: Tone.Unit.Time,
    velocity?: number
  ): void {
    // 하위 클래스에서 구현해야 함
    console.warn(`triggerAttackRelease not implemented in ${this.role} instrument`, {
      notes, duration, time, velocity
    });
    throw new Error('triggerAttackRelease must be implemented by concrete instrument classes.');
  }
}

